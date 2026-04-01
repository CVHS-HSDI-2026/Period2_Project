import {useState} from "react";

import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import CustomTypeBox from "../../components/CustomTypeBox";
import {useRouter} from "expo-router";
import {signUp} from "@/services/api";
import {SignupRecord} from "@/services/records";

export default function SignUp() {
	const router = useRouter();

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleGoogleSignup = () => {
		console.log("Google signup pressed");
	};

	const handleSignup = () => {
		if (confirmPassword !== password) {
			throw new Error("Passwords don't match");
			// 	todo: handle in less explosive way
		}

		let signup: SignupRecord = {
			username: username,
			password: password,
			email: email
		}

		signUp(signup).then(r => {
			if (r) {
				router.push("/");
			}
		});
	};

	return (
		<View style={styles.background}>
			<ScrollView style={{width: '100%'}} contentContainerStyle={styles.scrollContent}
						showsVerticalScrollIndicator={false}>
				<View style={styles.card}>

					{/* Logo */}
					<Image
						source={require("../../assets/web-name.png")}
						style={styles.logo}
						resizeMode="contain"
					/>

					{/* Avatar */}
					<View style={styles.avatar}>
						<Ionicons name="person-add" size={60} color="black"/>
					</View>

					{/* Google Signup */}
					{/* ts is not implemented and we don't have the time to 💀 */}
					{/*<TouchableOpacity*/}
					{/*	style={styles.googleButton}*/}
					{/*	onPress={handleGoogleSignup}*/}
					{/*>*/}
					{/*	<View style={styles.googleLogoContainer}>*/}
					{/*		<Image source={require("../../assets/google-logo.png")}*/}
					{/*			   style={styles.logoForGoogle}*/}
					{/*			   resizeMode="contain"*/}
					{/*		/>*/}
					{/*	</View>*/}
					{/*	<Text style={styles.googleText}> Sign up with Google</Text>*/}
					{/*</TouchableOpacity>*/}

					{/* Username */}
					<Text style={styles.label}>Username</Text>
					<CustomTypeBox
						value={username}
						onChange={setUsername}
						placeholder="Enter your username"
						type="text"
					/>

					{/* Email */}
					<Text style={styles.label}>Email</Text>
					<CustomTypeBox
						value={email}
						onChange={setEmail}
						placeholder="Enter your email"
						type="email"
					/>

					{/* Password */}
					<Text style={styles.label}>Password</Text>
					<CustomTypeBox
						value={password}
						onChange={setPassword}
						placeholder="Enter your password"
						type="password"
					/>

					{/* Confirm Password */}
					<Text style={styles.label}>Confirm Password</Text>
					<CustomTypeBox
						value={confirmPassword}
						onChange={setConfirmPassword}
						placeholder="Confirm your password"
						type="password"
					/>

					{/* Signup Button */}
					<TouchableOpacity
						style={styles.signupButton}
						onPress={handleSignup}
					>
						<Text style={styles.signupText}>Sign Up</Text>
					</TouchableOpacity>

					{/* Back to Login */}
					<TouchableOpacity onPress={() => router.push("/Login")}>
						<Text style={styles.link}>Already have an account? Log in</Text>
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
	scrollContainer: {
		flexGrow: 1,
		backgroundColor: "#14172B",
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 40,
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
	},
	logo: {
		width: "40%",
		height: 80,
		marginBottom: 15,
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
	signupButton: {
		width: "60%",
		backgroundColor: "black",
		paddingVertical: 10,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 20,
	},
	signupText: {
		color: "white",
		fontWeight: "600",
	},
	link: {
		fontSize: 12,
		textDecorationLine: "underline",
		marginTop: 10,
	},
});