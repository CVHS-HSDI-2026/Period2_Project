import { useState } from "react";
import { ScrollView } from "react-native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomTypeBox from "../../components/CustomTypeBox";
import { Image } from "react-native";

export default function ResetPass() {
  const router = useRouter();
  const { token } = useLocalSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Check if passwords match
  const passwordsMatch = password === confirmPassword;

  const handleResetPassword = async () => {
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
       // delete this later when connected to backend 
       // its just a test
      setTimeout(() => {
        setSuccess(true);
      }, 1000);

      const response = await fetch("http://backendurl/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Failed to reset password");
        return;
      }

      setSuccess(true);

    } catch (err) {
      setError("Network error. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.background}>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>

          {success ? (
            <>
              <Text style={styles.title}>Password Updated</Text>

              <Text style={styles.description}>
                Your password has been successfully reset.
              </Text>

              {/* Button moved from ForgotPass */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push("/Login")}
              >
                <Text style={styles.loginText}>Back to Login</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Title Logo */}
              <Image
                source={require("../../assets/web-name.png")}
                style={styles.logo}
                resizeMode="contain"
              />

              {/* Avatar */}
              <View style={styles.avatar}>
                <Image
                  source={require("../../assets/logo.png")}
                  style={styles.avatarLogo}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.title}>Reset Password</Text>

              <Text style={styles.description}>
                Enter a new password for your account.
              </Text>

              {/* New Password */}
              <Text style={styles.label}>New Password</Text>
              <CustomTypeBox
                value={password}
                onChange={setPassword}
                placeholder="Enter new password"
                type="password"
              />

              {/* Confirm Password */}
              <Text style={styles.label}>Confirm Password</Text>
              <CustomTypeBox
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirm new password"
                type="password"
              />

              {/* Live password mismatch message */}
              {confirmPassword.length > 0 && !passwordsMatch && (
                <Text style={styles.error}>Passwords do not match</Text>
              )}

              {error ? <Text style={styles.error}>{error}</Text> : null}

              {/* Reset Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  (loading || !passwordsMatch) && styles.loginButtonDisabled,
                ]}
                onPress={handleResetPassword}
                disabled={loading || !passwordsMatch}
              >
                <Text style={styles.loginText}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Text>
              </TouchableOpacity>
            </>
          )}

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#14172B",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 10,
    marginLeft: 0,
  },
  card: {
    width: "85%",
    maxWidth: 400,
    backgroundColor: "#CFCFDC",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    alignSelf: "center",
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
  avatarLogo: {
    width: 90,
    height: 90,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    textAlign: "center",
    color: "#444",
    marginVertical:12,
  },
  error: {
    color: "#cc0000",
    fontSize: 13,
    marginTop: 6,
    alignSelf: "center",
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
});
