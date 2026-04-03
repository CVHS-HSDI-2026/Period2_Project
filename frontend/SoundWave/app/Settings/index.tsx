import {
	StyleSheet,
	Text,
	View,
	Pressable,
	ScrollView,
	TextInput,
	Image,
	TouchableOpacity,
	ActivityIndicator
} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderWithSearch from "../../components/HeaderWithSearch";
import {useRouter} from "expo-router";
import {useFonts, Jost_400Regular, Jost_500Medium, Jost_700Bold} from '@expo-google-fonts/jost';
import {useAuth} from "@/context/context";
import {changePassword, deleteUser, fetchProfile, updateUserSettings} from "@/services/api";
import {toast} from "sonner-native";


export default function Settings() {
	const router = useRouter();
	const {user, setUser} = useAuth();
	const [fontsLoaded] = useFonts({Jost_400Regular, Jost_500Medium, Jost_700Bold});

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false)

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const [displayName, setDisplayName] = useState("");
	const [profilePicUrl, setProfilePicUrl] = useState("");
	const [privacy, setPrivacy] = useState("Public");
	const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
	const [isSecure, setIsSecure] = useState<boolean>(true);

	useEffect(() => {
		const loadSettings = async () => {
			if (user?.username) {
				try {
					const data = await fetchProfile(user.username);
					setDisplayName(data.user.display_name || "");
					setProfilePicUrl(data.user.profile_pic_url || "");
					setPrivacy(data.user.privacy || "Public");
				} catch (error) {
					toast("Failed to load current settings.");
				} finally {
					setLoading(false);
				}
			}
		};
		loadSettings();
	}, [user]);

	if (!fontsLoaded) return null;

	if (loading) {
		return (
			<View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
				<ActivityIndicator size="large" color="#C6B3E8" />
			</View>
		);
	}

	const handleSaveChanges = async () => {
		if (!user?.username) return;
		setSaving(true);
		setPasswordError("");

		try {
			await updateUserSettings(user.username, {
				display_name: displayName,
				profile_pic_url: profilePicUrl,
				privacy: privacy
			});

			if (oldPassword || newPassword || confirmPassword) {
				if (!oldPassword) {
					setPasswordError("Old password is required to set a new one.");
					setSaving(false);
					return;
				}
				if (newPassword !== confirmPassword) {
					setPasswordError("New passwords do not match.");
					setSaving(false);
					return;
				}
				await changePassword(user.username, oldPassword, newPassword);
				setOldPassword("");
				setNewPassword("");
				setConfirmPassword("");
			}

			toast("Settings saved successfully!");
		} catch (error: any) {
			toast(error.message || "Failed to save settings.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<View style={styles.container}>
			<HeaderWithSearch title="SoundWave"/>
			<ScrollView style={{width: '100%'}} contentContainerStyle={styles.scrollContent}
						showsVerticalScrollIndicator={false}>

				<TouchableOpacity onPress={() => router.back()} style={{alignSelf: "flex-start"}}>
					<Image
						source={require('../../assets/chevron-right.png')}
						style={styles.backArrow}
						resizeMode="contain"
					/>
				</TouchableOpacity>


				<Text style={styles.headings}>Settings</Text>

				{/* display name */}
				<Text style={styles.titles}>Display Name</Text>
				<Text style={styles.subTitles}>New Display Name</Text>
				<TextInput
					style={styles.newInput}
					placeholder="Enter new display name"
					placeholderTextColor="#aaa"
					value={displayName}
					onChangeText={setDisplayName}
				/>

				<Text style={styles.subTitles}>Profile Picture URL</Text>
				<TextInput
					style={styles.newInput}
					placeholder="https://imgur.com/example.jpg"
					placeholderTextColor="#aaa"
					value={profilePicUrl}
					onChangeText={setProfilePicUrl}
				/>

				<Text style={styles.titles}>Change Password</Text>

				<Text style={styles.subTitles}>Old Password</Text>
				<TextInput
					style={styles.newInput}
					secureTextEntry={isSecure}
					placeholder="Enter current password"
					placeholderTextColor="#aaa"
					value={oldPassword}
					onChangeText={setOldPassword}
				/>

				<Text style={styles.subTitles}>New Password</Text>
				<TextInput
					style={styles.newInput}
					placeholder="Enter new password"
					placeholderTextColor="#aaa"
					value={newPassword}
					onChangeText={setNewPassword}
				/>
				<Text style={styles.subTitles}>Confirm Password</Text>
				<View style={styles.passwordWrapper}>
					<TextInput
						style={styles.newInput}
						secureTextEntry={isSecure}
						placeholder="Re-enter new password"
						placeholderTextColor="#aaa"
						value={confirmPassword}
						onChangeText={setConfirmPassword}
					/>
					<Pressable onPress={() => setIsSecure(!isSecure)} style={styles.eyeInside}>
						<Image
							source={isSecure ? require("../../assets/open-eye.png") : require("../../assets/closed-eye.png")}
							style={styles.eyes}
							resizeMode="contain"
						/>
					</Pressable>
				</View>
				{passwordError !== "" && (
					<Text style={styles.errorText}>{passwordError}</Text>
				)}

				{/* privacy */}
				<Text style={styles.titles}>Privacy</Text>
				<Pressable style={styles.dropdownHeader} onPress={() => setShowPrivacyDropdown(!showPrivacyDropdown)}>
					<Text style={styles.dropdownHeaderText}>{privacy}</Text>
					<Text style={styles.dropdownArrow}>
						{showPrivacyDropdown ?
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
								 fill="#FFFFFF">
								<path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/>
							</svg> :
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
								 fill="#FFFFFF">
								<path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>
							</svg>}
					</Text>
				</Pressable>

				{showPrivacyDropdown && (
					<View style={styles.dropdownContainer}>
						{/* this kinda sucked... let's use a map to make it better*/}

						{["Public", "Private"].map((opt) => (
							<Pressable key={opt} style={styles.optionRow} onPress={() => { setPrivacy(opt); setShowPrivacyDropdown(false); }}>
								<View style={styles.mcCircle}>
									{privacy === opt && <View style={styles.selected} />}
								</View>
								<Text style={styles.optionText}>{opt}</Text>
							</Pressable>
						))}

						{/*<Pressable style={styles.optionRow} onPress={() => {*/}
						{/*	setPrivacy("Public");*/}
						{/*	setShowPrivacyDropdown(false);*/}
						{/*}}>*/}
						{/*	<View style={styles.mcCircle}>*/}
						{/*		{privacy === "Public" && <View style={styles.selected}/>}*/}
						{/*	</View>*/}
						{/*	<Text style={styles.optionText}>Public</Text>*/}
						{/*</Pressable>*/}

						{/*<Pressable style={styles.optionRow} onPress={() => {*/}
						{/*	setPrivacy("Private");*/}
						{/*	setShowPrivacyDropdown(false);*/}
						{/*}}>*/}
						{/*	<View style={styles.mcCircle}>*/}
						{/*		{privacy === "Private" && <View style={styles.selected}/>}*/}
						{/*	</View>*/}
						{/*	<Text style={styles.optionText}>Private</Text>*/}
						{/*</Pressable>*/}
					</View>
				)}

				<Pressable style={styles.saveButton} onPress={handleSaveChanges} disabled={saving}>
					<Text style={styles.buttonText}>{saving ? "Saving..." : "Save"}</Text>
				</Pressable>

				{/* account */}
				<Text style={styles.titles}>Account</Text>
				<View style={styles.accountBox}>
					<Pressable style={styles.logoutRow} onPress={() => {
						setUser(null);
						toast("Logged out successfully. Redirecting to login page...")
						router.push('/Login');
					}}>
						<View style={styles.logoutContent}>
							<Text style={styles.logoutText}>Log Out</Text>
							<Image
								source={require('../../assets/logout.png')}
								style={styles.logout}
								resizeMode="contain"
							/>
						</View>
					</Pressable>

					<Pressable style={styles.deleteRow} onPress={() => {
						deleteUser(user.username).then(r => {
							if (r) {
								toast("Deleted user successfully. Redirecting to signup page...");
								router.push('/Signup');
							}
						});
					}}>
						<View style={styles.deleteContent}>
							<Text style={styles.deleteText}>Delete Account</Text>
							<Image
								source={require('../../assets/Delete.png')}
								style={styles.delete}
								resizeMode="contain"
							/>
						</View>
					</Pressable>
				</View>

			</ScrollView>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#181B33",
		alignItems: "flex-start",
		width: "100%",
	},
	scrollContent: {
		paddingVertical: 40,
		paddingLeft: 40,
		width: "95%",
		maxWidth: "100%",
	},
	backArrow: {
		width: 20,
		height: 20,
	},


	headings: {
		fontSize: 30,
		color: "#FFFFFF",
		fontFamily: "Jost_500Medium",
		marginTop: 8,
		marginBottom: 1,
		//  marginLeft: 5,

	},


	titles: {
		fontSize: 20,
		color: "#FFFFFF",
		fontFamily: "Jost_500Medium",
		marginTop: 16,
		marginBottom: 6,
		//  marginLeft: 5,

	},
	subTitles: {
		fontSize: 14,
		color: "#FFFFFF",
		fontFamily: "Jost_400Regular",
		marginBottom: 6,
		marginLeft: 4,
	},
	newInput: {
		width: "100%",
		borderWidth: 1,
		borderColor: "#FFFFFF50",
		borderRadius: 8,
		padding: 12,
//    paddingRight: 35,
		color: "#FFFFFF",
		fontFamily: "Jost_400Regular",
		fontSize: 16,
		marginBottom: 16,
	},
	passwordWrapper: {
		width: "100%",
		position: "relative",
		justifyContent: "center",
		marginBottom: 2,
	},
	eyeInside: {
		position: "absolute",
		right: 15,
		height: "100%",
		justifyContent: "center",
		marginBottom: 16,
	},
	eyes: {
		height: 20,
		width: 20,
	},
	accountBox: {
		width: "100%",
		backgroundColor: "#cfcfe3",
		borderRadius: 8,
		padding: 14,
		marginVertical: 10,
	},


	deleteRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 6,
	},


	deleteContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},


	deleteText: {
		color: "red",
		fontFamily: "Jost_500Medium",
		fontSize: 16,
		marginRight: 10,
	},


	delete: {
		width: 20,
		height: 20,
	},


	logoutRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},


	logoutContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},


	logoutText: {
		fontFamily: "Jost_500Medium",
		fontSize: 16,
		marginRight: 10,
	},


	logout: {
		width: 20,
		height: 20,
	},


	dropdownHeader: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#FFFFFF50",
		borderRadius: 8,
		padding: 12,
		marginBottom: 10,
	},


	dropdownHeaderText: {
		color: "#FFFFFF",
		fontFamily: "Jost_400Regular",
		fontSize: 16,
	},


	dropdownArrow: {
		color: "#FFFFFF",
		fontSize: 14,
		marginTop: 6,
	},


	dropdownContainer: {
		backgroundColor: "#1f2245",
		borderRadius: 8,
		paddingVertical: 8,
		marginBottom: 16,
	},


	optionRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 12,
	},


	optionText: {
		color: "#FFFFFF",
		fontFamily: "Jost_400Regular",
		fontSize: 15,
	},


	mcCircle: {
		height: 18,
		width: 18,
		borderRadius: 9,
		borderWidth: 2,
		borderColor: "#FFFFFF",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
		objectFit: 'contain',
	},
	selected: {
		height: 8,
		width: 8,
		borderRadius: 4,
		backgroundColor: "#FFFFFF",
	},
	saveButton: {
		backgroundColor: "#cfcfe3",
		paddingVertical: 12,
		paddingHorizontal: 24,
		minWidth: 120,
		height: 35,
		width: "10%",
		borderRadius: 7,
		marginTop: 10,
		//  borderWidth: 0,
		cursor: "pointer",
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: "black",
		fontFamily: "Jost_500Medium",
		fontSize: 16,

	},
	errorText: {
		color: "red",
		fontSize: 13,
		marginBottom: 10,
		marginLeft: 6,
		fontFamily: "Jost_400Regular",
	}
});
