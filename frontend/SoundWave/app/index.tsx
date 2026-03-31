import React from "react";
import {StyleSheet, Text, View, ScrollView} from "react-native";
import {useRouter} from "expo-router";

import HeaderWithSearch from "../components/HeaderWithSearch";
import SongCard from "../components/SongCard";

// homepage
export default function App() {
	const router = useRouter();

	React.useEffect(() => {
		console.log("HOME PAGE LOADED");
	}, []);

	return (
		<View style={styles.container}>
			<HeaderWithSearch title="SoundWave"/>

			<ScrollView showsVerticalScrollIndicator={false}>
				{/* ================= Popular ================= */}
				<Text style={styles.sectionTitle}>Popular</Text>

				<ScrollView horizontal showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.horizontalContent}>
					<View style={styles.horizontalContent}>
						<Text style={{ color: "#A0A0B0", fontSize: 16 }}>Trending music will appear here soon.</Text>
					</View>
				</ScrollView>

				{/* ================= New Releases ================= */}
				<Text style={styles.sectionTitle}>New Releases</Text>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.horizontalContent}
				>
					<View style={styles.horizontalContent}>
						<Text style={{ color: "#A0A0B0", fontSize: 16 }}>New releases will appear here soon.</Text>
					</View>
				</ScrollView>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#14172B",
	},

	sectionTitle: {
		fontSize: 32,
		fontWeight: "700",
		marginTop: 24,
		marginBottom: 8,
		marginLeft: 20,
		color: "#FFFFFF",
	},

	horizontalContent: {
		flexDirection: "row",
		gap: 24,
		paddingVertical: 20,
		paddingHorizontal: 20,
	},
});