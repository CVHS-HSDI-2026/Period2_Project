import { useState } from "react";
import { ScrollView } from "react-native";
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

export default function ForgotPass() {
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleLogin = async () => {
    setError("");

    if (!emailOrUsername.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

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
        setError(data.message || "Login failed");
        return;
      }
      
      router.replace("/");
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

        {/* Title */}
        <Image source={require("../../assets/web-name.png")}
        style={styles.logo}
        resizeMode="contain"
         />

        {/* Avatar Circle */}
        <View style={styles.avatar}>
          <Ionicons name="person" size={60} color="black" />
        </View>


        {/* Email */}
        <Text style={styles.label}>Email/Username</Text>
        <CustomTypeBox
          value={emailOrUsername}
          onChange={setEmailOrUsername}
          placeholder="Enter your email or username"
          type="text"
        />

        
        {error ? (
          <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
        ) : null}
        

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>
            {loading ? "Logging in" : "Login"}
          </Text>
        </TouchableOpacity>

        {/* Links */}
        <TouchableOpacity onPress={() => router.push("/Signup")}>
          <Text style={styles.link}>Click here to sign up</Text>
        </TouchableOpacity>

        
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
    // width: "90%",
    // maxWidth: 1200,
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
  googleLogoContainer: {
    width: 30,
    height: 20,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginRight: '19%',
    marginLeft: 7,
  },
  logoForGoogle: {
    width: 30,
    height: 30,
    position: "absolute",
    marginVertical: 2,
    marginHorizontal: 2,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
