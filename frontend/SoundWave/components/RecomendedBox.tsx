import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import SongCard from "../components/SongCard";
import ArtistCard from "../components/ArtistCard";
import { fetchRecommendations } from "@/services/api";

export default function RecommendedBox({ artistName, type }: { artistName: string, type: 'song' | 'album' | 'artist' }) {
	const router = useRouter();
	const [results, setResults] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getRecommendations = async () => {
			if (!artistName) return;

			setLoading(true);
			try {
				const data = await fetchRecommendations(artistName, type);
				setResults(data || []);
			} catch (err) {
				console.error("Recommendations failed:", err);
			} finally {
				setLoading(false);
			}
		};

		getRecommendations();
	}, [artistName, type]);

	if (loading) {
		return (
			<View style={styles.centerContainer}>
				<ActivityIndicator size="small" color="#C6B3E8" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{results.length > 0 ? (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.horizontalContent}
				>
					{results.map((rec: any, i: number) => {

						if (type === 'artist') {
							return (
								<ArtistCard
									key={`rec-art-${i}`}
									variant="popular"
									title={rec.name}
									artist="Artist"
									onPress={() => router.push({ pathname: "/Artist", params: { mbid: rec.mbid } })}
								/>
							);
						}

						return (
							<SongCard
								key={`rec-${i}`}
								variant="popular"
								title={rec.title}
								artist={rec.artist_name || artistName}
								image={rec.cover_url ? { uri: rec.cover_url } : undefined}
								onPress={() =>
									router.push({
										pathname: type === 'album' ? "/Album" : "/Song",
										params: { mbid: rec.mbid }
									})
								}
							/>
						);
					})}
				</ScrollView>
			) : (
				<Text style={styles.emptyText}>No recommendations found.</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#14172B",
	},
	centerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		minHeight: 100,
	},
	horizontalContent: {
		flexDirection: "row",
		gap: 24,
		paddingVertical: 20,
		paddingHorizontal: 0,
	},
	emptyText: {
		color: "#A0A0B0",
		fontSize: 14,
		marginTop: 20,
	}
});