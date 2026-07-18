import { Pressable, Switch, Text, View } from "react-native";
import { styles } from "../styles/appStyles";
import { formatMoney } from "../utils/money";
import { getBaseDue } from "../utils/session";
import { MoneyField } from "./MoneyField";

export function PersonCard({
  person,
  attendee,
  splitAmount,
  onUpdateAttendee,
  onRemovePerson,
  onMarkFullPayment,
}) {
  const totalDue = getBaseDue(attendee.expense, splitAmount);

  return (
    <View style={styles.personCard}>
      <View style={styles.personHeader}>
        <View>
          <Text style={styles.personName}>{person.name}</Text>
          <Text style={styles.personMeta}>{attendee.present ? "Asiste hoy" : "No asiste hoy"}</Text>
        </View>
        <View style={styles.headerActions}>
          <Switch
            value={attendee.present}
            onValueChange={(value) => onUpdateAttendee(person.id, { present: value })}
            trackColor={{ false: "#d1d5db", true: "#86efac" }}
            thumbColor={attendee.present ? "#166534" : "#f8fafc"}
          />
          <Pressable onPress={() => onRemovePerson(person.id)}>
            <Text style={styles.removeText}>Borrar</Text>
          </Pressable>
        </View>
      </View>

      {attendee.present ? (
        <View style={styles.metricsWrap}>
          <MoneyField
            label="Gasto en compras"
            value={attendee.expense}
            onChangeValue={(value) => onUpdateAttendee(person.id, { expense: value })}
          />
          <View style={styles.quickActions}>
            <Text style={styles.quickActionsLabel}>Debe total {formatMoney(totalDue)}</Text>
            <View style={styles.quickButtonsRow}>
              <Pressable
                style={styles.quickButton}
                onPress={() => onMarkFullPayment(person.id, "cash", attendee.expense)}
              >
                <Text style={styles.quickButtonText}>Pago EF</Text>
              </Pressable>
              <Pressable
                style={styles.quickButton}
                onPress={() => onMarkFullPayment(person.id, "transfer", attendee.expense)}
              >
                <Text style={styles.quickButtonText}>Pago TX</Text>
              </Pressable>
            </View>
          </View>
          <MoneyField
            label="Pago en efectivo"
            value={attendee.cashPaid}
            onChangeValue={(value) => onUpdateAttendee(person.id, { cashPaid: value })}
          />
          <MoneyField
            label="Pago por transferencia"
            value={attendee.transferPaid}
            onChangeValue={(value) => onUpdateAttendee(person.id, { transferPaid: value })}
          />
        </View>
      ) : null}
    </View>
  );
}
