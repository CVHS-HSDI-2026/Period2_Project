import {useState} from "react";
import {ScrollView, View, Text, StyleSheet, TouchableOpacity,} from "react-native";
import CustomTypeBox from "../../components/CustomTypeBox";
import {useRouter} from "expo-router";
import {changePassword} from "@/services/api";
import {Image} from 'react-native';
import {toast} from "sonner-native";
import {useAuth} from "@/context/context";

export default function Login() {
	const router = useRouter();
	const {user} = useAuth();

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const passwordsMatch = newPassword === confirmPassword;

	const handleChangePassword = async () => {
		setError("");

		if (!oldPassword || !newPassword || !confirmPassword) {
			setError("Please fill in all fields.");
			return;
		}

		if (!passwordsMatch) {
			setError("New passwords do not match.");
			return;
		}

		try {
			setLoading(true);
			await changePassword(user.username, oldPassword, newPassword);
			toast("Password changed successfully.");
			setSuccess(true);
		} catch (err) {
			setError("Network error. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.background}>
			<ScrollView style={{width: '100%'}} contentContainerStyle={styles.scrollContent}
						showsVerticalScrollIndicator={false}>
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

							<Text style={styles.title}>Change Password</Text>
							<Text style={styles.description}>Enter your current password to set a new one.</Text>

							<Text style={styles.label}>Old Password</Text>
							<CustomTypeBox value={oldPassword} onChange={setOldPassword}
										   placeholder="Enter old password" type="password"/>

							<Text style={styles.label}>New Password</Text>
							<CustomTypeBox value={newPassword} onChange={setNewPassword}
										   placeholder="Enter new password" type="password"/>

							<Text style={styles.label}>Confirm New Password</Text>
							<CustomTypeBox value={confirmPassword} onChange={setConfirmPassword}
										   placeholder="Confirm new password" type="password"/>

							{confirmPassword.length > 0 && !passwordsMatch && (
								<Text style={styles.error}>Passwords do not match</Text>
							)}

							{error ? <Text style={styles.error}>{error}</Text> : null}

							<TouchableOpacity
								style={[styles.loginButton, (loading || !passwordsMatch) && styles.loginButtonDisabled]}
								onPress={handleChangePassword}
								disabled={loading || !passwordsMatch}
							>
								<Text style={styles.loginText}>{loading ? "Updating..." : "Update Password"}</Text>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => router.back()}>
								<Text style={styles.link}>Cancel</Text>
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
		marginVertical: 12,
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