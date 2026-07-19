import { CameraView } from "expo-camera";
import { Modal, Pressable, SafeAreaView, Text, View } from "react-native";
import { styles } from "../styles/appStyles";

export function ScannerModal({
  visible,
  hasScanned,
  onClose,
  onScan,
  onResetScan,
}) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.scannerScreen}>
        <View style={styles.scannerHeader}>
          <Text style={styles.sectionTitle}>Escanear QR</Text>
          <Pressable style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>Cerrar</Text>
          </Pressable>
        </View>
        <Text style={styles.emptyText}>
          Importa personas y juntada actual. Reemplaza datos locales.
        </Text>
        <View style={styles.scannerFrame}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={hasScanned ? undefined : onScan}
          />
        </View>
        {hasScanned ? (
          <Pressable style={styles.primaryWideButton} onPress={onResetScan}>
            <Text style={styles.primaryButtonText}>Escanear otro</Text>
          </Pressable>
        ) : null}
      </SafeAreaView>
    </Modal>
  );
}
