import { Modal, Pressable, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { styles } from "../styles/appStyles";

export function ShareQrModal({ visible, payload, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Compartir grupo y juntada</Text>
          <Text style={styles.modalText}>
            El otro telefono escanea este QR para copiar personas y estado actual.
          </Text>
          <View style={styles.qrWrap}>
            <QRCode value={payload} size={220} backgroundColor="#ffffff" color="#111315" />
          </View>
          <Pressable style={styles.primaryWideButton} onPress={onClose}>
            <Text style={styles.primaryButtonText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
