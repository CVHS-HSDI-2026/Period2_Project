import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomTypeBox from "../../components/CustomTypeBox";
import { useRouter } from "expo-router";
import { Image } from 'react-native';

export default function Login() {
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleGoogleLogin = () => {
    console.log("Google login pressed");
  };

  const handleLogin = () => {
    console.log("Login pressed");

            router.push("/"); // change later to your home route
  };

  return (
    <View style={styles.background}>
      <View style={styles.card}>

        {/* Title */}
        <Image source={require("../../assets/web-name.png")}
        style={styles.logo}
        resizeMode="contain"
         />

        {/* Avatar Circle */}
        <View style={styles.avatar}>
          <Ionicons name="person" size={60} color="black" />
        </View>

        {/* Google Login */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
        >
          <Ionicons name="logo-google" size={20} color="white" />
          <Text style={styles.googleText}> Log in with Google</Text>
        </TouchableOpacity>

        {/* Email */}
        <Text style={styles.label}>Email/Username</Text>
        <CustomTypeBox
          value={emailOrUsername}
          onChange={setEmailOrUsername}
          placeholder="Enter your email or username"
          type="text"
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <CustomTypeBox
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          type="password"
        />

        {/* Remember Me */}
        <TouchableOpacity
          style={styles.rememberContainer}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View
            style={[
              styles.checkbox,
              rememberMe && styles.checkboxChecked
            ]}
          />
          <Text style={styles.rememberText}>Remember me</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* Links */}
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.link}>Click here to sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={styles.link}>Forgot password?</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#0F1535",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    maxWidth: 400,
    backgroundColor: "#CFCFDC",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
  },
  logo: {
  width: "40%",
  height: 80,
  marginBottom: 15,
},
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E8E8E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4285F4",
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%",
    marginBottom: 15,
  },
  googleText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "black",
  },
  rememberText: {
    fontSize: 13,
  },
  loginButton: {
    width: "60%",
    backgroundColor: "black",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  loginText: {
    color: "white",
    fontWeight: "600",
  },
  link: {
    fontSize: 12,
    textDecorationLine: "underline",
    marginTop: 8,
  },
});
