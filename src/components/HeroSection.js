import { Pressable, Text, View } from "react-native";
import { styles } from "../styles/appStyles";

export function HeroSection({ onResetSession, onShowShareQr, onOpenScanner }) {
  return (
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>Reparto de Gastos</Text>
      <View style={styles.heroActions}>
        <Pressable style={styles.secondaryButton} onPress={onResetSession}>
          <Text style={styles.secondaryButtonText}>Limpiar</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onShowShareQr}>
          <Text style={styles.secondaryButtonText}>QR</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onOpenScanner}>
          <Text style={styles.secondaryButtonText}>Scan</Text>
        </Pressable>
      </View>
    </View>
  );
}
