import { Text, TextInput, View } from "react-native";
import { parseMoney } from "../utils/money";
import { styles } from "../styles/appStyles";

export function MoneyField({ label, value, onChangeValue }) {
  return (
    <View style={styles.moneyField}>
      <Text style={styles.moneyLabel}>{label}</Text>
      <TextInput
        value={value ? String(value) : ""}
        onChangeText={(text) => onChangeValue(parseMoney(text))}
        keyboardType="number-pad"
        placeholder="$0"
        placeholderTextColor="#94a3b8"
        style={styles.moneyInput}
      />
    </View>
  );
}
