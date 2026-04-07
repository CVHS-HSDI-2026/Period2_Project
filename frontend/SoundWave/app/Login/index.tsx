import {useState} from "react";
import {ScrollView} from "react-native";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import CustomTypeBox from "../../components/CustomTypeBox";
import {useRouter} from "expo-router";
import {Image} from 'react-native';
import {LoginRecord} from "@/services/records";
import {login} from "@/services/api";
import {useAuth} from "@/context/context";
import {toast} from "sonner-native";

export default function Login() {
	const router = useRouter();
	const {setUser} = useAuth();

	const [emailOrUsername, setEmailOrUsername] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleLogin = async () => {
		setError("");

		if (!emailOrUsername.trim() || !password.trim()) {
			setError("Please fill in all fields");
			return;
		}

		try {
			setLoading(true);

			let login_attempt: LoginRecord = {
				username: emailOrUsername,
				password: password
			}

			const r = await login(login_attempt);
			if (r) {
				setUser(r);
				toast("Logged in successfully!");
				router.push("/");
			}
		} catch (err: any) {
			setError(err.message || "Login failed. Please try again.");
			toast(err.message || "Login failed.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.background}>
			<ScrollView style={{width: '100%'}} contentContainerStyle={styles.scrollContent}
						showsVerticalScrollIndicator={false}>
				<View style={styles.card}>

					{/* Title */}
					<Image source={require("../../assets/web-name.png")}
						   style={styles.logo}
						   resizeMode="contain"
					/>

					{/* Avatar Circle */}
					<View style={styles.avatar}>
						<Ionicons name="person" size={60} color="black"/>
					</View>

					{/* Google Login */}
					{/* ts is not implemented and we don't have the time to 💀 */}
					{/*<TouchableOpacity*/}
					{/*	style={styles.googleButton}*/}
					{/*	onPress={handleGoogleLogin}*/}
					{/*>*/}
					{/*	<View style={styles.googleLogoContainer}>*/}
					{/*		<Image source={require("../../assets/google-logo.png")}*/}
					{/*			   style={styles.logoForGoogle}*/}
					{/*			   resizeMode="contain"*/}
					{/*		/>*/}
					{/*	</View>*/}
					{/*	<Text style={styles.googleText}> Log in with Google</Text>*/}
					{/*</TouchableOpacity>*/}

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

					{error ? (
						<Text style={{color: "red", marginTop: 5}}>{error}</Text>
					) : null}


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

					<TouchableOpacity onPress={() => router.push("/ForgotPass")}>
						<Text style={styles.link}>Forgot password?</Text>
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
