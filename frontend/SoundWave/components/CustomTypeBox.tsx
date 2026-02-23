import { TextInput, StyleSheet } from "react-native";

type CustomTypeBoxProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "text" | "password" | "email";
  width?: string | number;
  height?: number;
  margin?: number;
};

export default function CustomTypeBox({
  value,
  onChange,
  placeholder,
  type = "text",
  width = "100%",
  height = 50,
  margin = 10,
}: CustomTypeBoxProps) {
  return (
    <TextInput
      value={value}
      placeholder={placeholder}
      onChangeText={onChange}
      secureTextEntry={type === "password"}
      keyboardType={type === "email" ? "email-address" : "default"}
      autoCapitalize="none"
      style={[
        styles.input,
        {
          width: width,
          height: height,
          marginVertical: margin,
        },
      ]}
      placeholderTextColor="#888"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#AAA",
    fontSize: 15,
  },
});