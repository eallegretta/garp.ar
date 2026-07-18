import "@expo/metro-runtime";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { HeroSection } from "./src/components/HeroSection";
import { PersonCard } from "./src/components/PersonCard";
import { ScannerModal } from "./src/components/ScannerModal";
import { ShareQrModal } from "./src/components/ShareQrModal";
import { SummaryBox } from "./src/components/SummaryBox";
import { WebInstallBanner } from "./src/components/WebInstallBanner";
import { styles } from "./src/styles/appStyles";
import { loadAppData, persistPeople, persistSession } from "./src/storage/appStorage";
import { getBaseDue, attendeeFromPerson, buildAttendees, buildSummary, createEmptySession, sortPeopleByAttendance } from "./src/utils/session";
import { buildSharePayload, parseSharePayload } from "./src/utils/sharePayload";
import { formatMoney } from "./src/utils/money";

export default function App() {
  const [people, setPeople] = useState([]);
  const [session, setSession] = useState(createEmptySession);
  const [newPersonName, setNewPersonName] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [showShareQr, setShowShareQr] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    async function bootstrap() {
      try {
        const appData = await loadAppData();
        setPeople(appData.people);
        setSession(appData.session);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudo cargar datos guardados.");
      } finally {
        setIsReady(true);
      }
    }

    bootstrap();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    persistPeople(people).catch(console.error);
  }, [isReady, people]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    persistSession(session).catch(console.error);
  }, [isReady, session]);

  const attendees = useMemo(
    () => buildAttendees(people, session.attendees),
    [people, session.attendees],
  );

  const sortedPeople = useMemo(
    () => sortPeopleByAttendance(people, session.attendees),
    [people, session.attendees],
  );

  const summary = useMemo(() => buildSummary(attendees), [attendees]);
  const sharePayload = useMemo(() => buildSharePayload(people, session), [people, session]);

  function addPerson() {
    const trimmedName = newPersonName.trim();
    if (!trimmedName) {
      return;
    }

    const duplicate = people.some(
      (person) => person.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (duplicate) {
      Alert.alert("Nombre repetido", "Esa persona ya existe en el grupo.");
      return;
    }

    setPeople((currentPeople) => [
      ...currentPeople,
      {
        id: `${Date.now()}-${trimmedName}`,
        name: trimmedName,
      },
    ]);
    setNewPersonName("");
  }

  function removePerson(personId) {
    Alert.alert("Eliminar persona", "Se borra del grupo guardado.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setPeople((currentPeople) => currentPeople.filter((person) => person.id !== personId));
          setSession((currentSession) => {
            const nextAttendees = { ...currentSession.attendees };
            delete nextAttendees[personId];
            return {
              ...currentSession,
              attendees: nextAttendees,
            };
          });
        },
      },
    ]);
  }

  function updateAttendee(personId, changes) {
    setSession((currentSession) => ({
      ...currentSession,
      attendees: {
        ...currentSession.attendees,
        [personId]: {
          ...(currentSession.attendees[personId] ?? attendeeFromPerson(personId)),
          ...changes,
        },
      },
    }));
  }

  function resetSession() {
    Alert.alert("Nueva juntada", "Se limpia solo evento actual.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Limpiar",
        style: "destructive",
        onPress: () => setSession(createEmptySession()),
      },
    ]);
  }

  function markFullPayment(personId, method, expense) {
    const totalDue = getBaseDue(expense, summary.splitAmount);

    updateAttendee(personId, {
      cashPaid: method === "cash" ? totalDue : 0,
      transferPaid: method === "transfer" ? totalDue : 0,
    });
  }

  async function openScanner() {
    if (!cameraPermission?.granted) {
      const permissionResult = await requestCameraPermission();
      if (!permissionResult.granted) {
        Alert.alert("Permiso necesario", "Necesitas habilitar camara para importar QR.");
        return;
      }
    }

    setHasScanned(false);
    setShowScanner(true);
  }

  function importFromQr(rawValue) {
    try {
      const importedData = parseSharePayload(rawValue);
      setPeople(importedData.people);
      setSession(importedData.session);
      setShowScanner(false);
      Alert.alert("Importado", "Grupo y juntada actual cargados desde QR.");
    } catch (error) {
      Alert.alert("QR invalido", "No pudimos leer datos de GarpAr.");
    }
  }

  if (!isReady) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <WebInstallBanner />
        <HeroSection
          onResetSession={resetSession}
          onShowShareQr={() => setShowShareQr(true)}
          onOpenScanner={openScanner}
        />

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Grupo</Text>
          <View style={styles.addRow}>
            <TextInput
              value={newPersonName}
              onChangeText={setNewPersonName}
              placeholder="Agregar persona"
              placeholderTextColor="#6b7280"
              style={styles.input}
              onSubmitEditing={addPerson}
            />
            <Pressable style={styles.primaryButton} onPress={addPerson}>
              <Text style={styles.primaryButtonText}>Agregar</Text>
            </Pressable>
          </View>

          {people.length === 0 ? (
            <Text style={styles.emptyText}>Todavia no hay personas cargadas.</Text>
          ) : (
            sortedPeople.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                attendee={session.attendees[person.id] ?? attendeeFromPerson(person.id)}
                splitAmount={summary.splitAmount}
                onUpdateAttendee={updateAttendee}
                onRemovePerson={removePerson}
                onMarkFullPayment={markFullPayment}
              />
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.summaryGrid}>
            <SummaryBox label="Asistentes" value={String(summary.peopleCount)} />
            <SummaryBox label="Gasto total" value={formatMoney(summary.totalExpense)} />
            <SummaryBox label="Por persona" value={formatMoney(summary.splitAmount)} />
            <SummaryBox label="Cobrado hoy" value={formatMoney(summary.collected)} />
          </View>
          <View style={styles.summaryGrid}>
            <SummaryBox label="Efectivo" value={formatMoney(summary.totalCash)} />
            <SummaryBox label="Transferencia" value={formatMoney(summary.totalTransfer)} />
            <SummaryBox label="A devolver" value={formatMoney(summary.totalToReceive)} />
            <SummaryBox label="Falta cobrar" value={formatMoney(summary.totalPending)} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Saldos por persona</Text>
          {summary.rows.length === 0 ? (
            <Text style={styles.emptyText}>Marca asistentes para ver reparto.</Text>
          ) : (
            summary.rows.map((row) => (
              <View key={row.id} style={styles.balanceRow}>
                <View style={styles.balanceHeader}>
                  <Text style={styles.personName}>{row.name}</Text>
                  <Text style={styles.balanceShare}>{formatMoney(row.splitAmount)}</Text>
                </View>
                <Text style={styles.balanceMeta}>
                  Gasto {formatMoney(row.expense)} | Pago {formatMoney(row.paid)}
                </Text>
                <Text
                  style={[
                    styles.balanceStatus,
                    row.receive > 0
                      ? styles.positiveText
                      : row.owe > 0
                        ? styles.negativeText
                        : styles.neutralText,
                  ]}
                >
                  {row.receive > 0
                    ? `Recibe ${formatMoney(row.receive)}`
                    : row.owe > 0
                      ? `Debe ${formatMoney(row.owe)}`
                      : "Saldo cerrado"}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <ShareQrModal
        visible={showShareQr}
        payload={sharePayload}
        onClose={() => setShowShareQr(false)}
      />

      <ScannerModal
        visible={showScanner}
        hasScanned={hasScanned}
        onClose={() => setShowScanner(false)}
        onResetScan={() => setHasScanned(false)}
        onScan={({ data }) => {
          setHasScanned(true);
          importFromQr(data);
        }}
      />
    </SafeAreaView>
  );
}
