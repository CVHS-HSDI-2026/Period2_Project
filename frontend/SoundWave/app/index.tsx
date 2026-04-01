import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View, ScrollView} from "react-native";
import {useRouter} from "expo-router";

import HeaderWithSearch from "../components/HeaderWithSearch";
import SongCard from "../components/SongCard";
import {fetchPopular, fetchNewReleases} from "@/services/api";

// homepage
export default function App() {
	const router = useRouter();

	const [popular, setPopular] = useState<any[]>([]);
	const [newMusic, setNewMusic] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadHomePageData = async () => {
			try {
				const [popularData, newData] = await Promise.all([
					fetchPopular(),
					fetchNewReleases()
				]);

				setPopular(popularData?.results || []);
				setNewMusic(newData?.results || []);
			} catch (error) {
				console.error("Failed to load home page data:", error);
			} finally {
				setLoading(false);
			}
		};

		loadHomePageData();
	}, []);

	return (
		<View style={styles.container}>
			<HeaderWithSearch title="SoundWave"/>

			<ScrollView showsVerticalScrollIndicator={false}>
				{/* ================= Popular ================= */}
				<Text style={styles.sectionTitle}>Popular</Text>

				<ScrollView horizontal showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.horizontalContent}>
					{popular && popular.length > 0 ? (
						popular.map((music: any, i: number) => (
							<SongCard
								key={`popular-${i}`}
								variant="popular"
								title={music.title}
								artist={music.artist || "Unknown Artist"} // Mapped from SQL query
								rating={music.rating} // Dynamically calculated average rating!
								commentsCount={music.review_count} // Total number of reviews!
								onPress={() => router.push({pathname: "/Song", params: {mbid: music.mbid}})}
							/>
						))
					) : (
						<Text style={styles.emptyText}>Trending music will appear here soon.</Text>
					)}
				</ScrollView>

				{/* ================= New Releases ================= */}
				<Text style={styles.sectionTitle}>New Releases</Text>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.horizontalContent}
				>
					{newMusic && newMusic.length > 0 ? (
						newMusic.map((music: any, i: number) => (
							<SongCard
								key={`new-${i}`}
								variant="popular"
								title={music.title}
								artist={music.artist || "Unknown Artist"}
								rating={music.rating}
								commentsCount={music.review_count}
								onPress={() => router.push({pathname: "/Song", params: {mbid: music.mbid}})}
							/>
						))
					) : (
						<Text style={styles.emptyText}>New releases will appear here soon.</Text>
					)}
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
	emptyText: {
		color: "#A0A0B0",
		fontSize: 16,
	}
});