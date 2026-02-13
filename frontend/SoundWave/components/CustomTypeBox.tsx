import { TextInput, StyleSheet } from "react-native";

type CustomTypeBoxProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "text" | "password" | "email";
  width?: string;
  height?: number;
  margin?: number;
};

export default function CustomTypeBox({
  value,
  onChange,
  placeholder,
  type = "text",
  width = "100%",
  height = 45,
  margin = 8,
}: CustomTypeBoxProps) {
  return (
    <TextInput
      value={value}
      placeholder={placeholder}
      onChangeText={onChange}
      secureTextEntry={type === "password"}
      style={[
        styles.input,
        { width, height, marginVertical: margin },
      ]}
      placeholderTextColor="#888"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#AAA",
    fontSize: 14,
  },
});
