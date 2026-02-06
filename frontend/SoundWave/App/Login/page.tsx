import { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import CustomTypeBox from "../../components/CustomTypeBox";

export default function Login() {
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.background}>
      <View style={styles.card}>
        <Text style={styles.appTitle}>SoundWave</Text>

        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>

        {/* Google button (UI only) */}
        <Pressable style={styles.googleButton}>
          <Text style={styles.googleText}>🟢 Log in with Google</Text>
        </Pressable>

        {/* Email / Username */}
        <Text style={styles.label}>Email/Username</Text>
        <CustomTypeBox
          value={emailOrUsername}
          onChange={setEmailOrUsername}
          placeholder="Enter your email or username"
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <CustomTypeBox
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          type="password"
        />

        {/* Login */}
        <Pressable
          style={styles.loginButton}
          onPress={() => router.push("./")}
        >
          <Text style={styles.loginText}>Login</Text>
        </Pressable>

        {/* Links */}
        <Pressable onPress={() => router.push("./Register")}>
          <Text style={styles.link}>Click here to sign up</Text>
        </Pressable>

        <Pressable>
          <Text style={styles.link}>Forgot password?</Text>
        </Pressable>
      </View>
    </View>
  );
}
