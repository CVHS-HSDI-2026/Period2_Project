import { useState } from "react";
import { ScrollView } from "react-native";
import { View, Text, StyleSheet, TouchableOpacity, } from "react-native";
import CustomTypeBox from "../../components/CustomTypeBox";
import { useRouter } from "expo-router";
import { Image } from 'react-native';

export default function Login() {
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);


  const handleLogin = async () => {
    setError("");

    if (!emailOrUsername.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      // delete this later when connected to backend
      // its just a test
      setTimeout(() => {
        setSuccess(true);
      }, 1000);

      const response = await fetch("http://backendurl/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrUsername,
        }),
      });

      const data = await response.json();

      if( !response.ok ) {
        setError(data?.message || "Failed to send");
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
      <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        {success ? (
        <>
          <Text style={styles.title}>Email Sent</Text>

          <Text style={styles.description}>
            We've sent a password reset link to your email. Please check your inbox.
          </Text>
            </>
            ) : (
        <>

        {/* Title */}
        <Image source={require("../../assets/web-name.png")}
        style={styles.logo}
        resizeMode="contain"
         />

        {/* Avatar Circle */}
          <View style={styles.avatar}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.avatarLogo}
              resizeMode="contain"
            />
          </View>

        {/* Password Reset Title */}
        <Text style={styles.title}>Password Reset</Text>

        {/* Description */}
        <Text style={styles.description}>
          Enter your email and we'll send you a link to reset your password.
        </Text>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <CustomTypeBox
          value={emailOrUsername}
          onChange={setEmailOrUsername}
          placeholder="Enter your email"
          type="text"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Send email Button */}
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Text>
        </TouchableOpacity>

        {/* Links */}
        <TouchableOpacity onPress={() => router.push("/Login")}>
          <Text style={styles.link}>Back to login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/ResetPass")}>
          <Text style={styles.link}>reset pass page test</Text>
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