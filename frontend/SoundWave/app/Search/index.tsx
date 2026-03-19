import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View, ScrollView, ActivityIndicator} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";

import HeaderWithSearch from "@/components/HeaderWithSearch";
import SongCard from "@/components/SongCard";
import ArtistCard from "@/components/ArtistCard";
import {fetchSearchResults} from "@/services/api";

export default function SearchResults() {
	const router = useRouter();
	const {q} = useLocalSearchParams<{ q: string }>();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [results, setResults] = useState({
		artists: [],
		albums: [],
		songs: [],
	});

	useEffect(() => {
		const performSearch = async () => {
			if (!q) return;

			setLoading(true);
			setError(null);

			try {
				const data = await fetchSearchResults(q, 'all');

				if (data && data.results) {
					setResults({
						artists: data.results.artists || [],
						albums: data.results.albums || [],
						songs: data.results.songs || [],
					});
				}
			} catch (err) {
				console.error("Search failed:", err);
				setError("Failed to load search results. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		performSearch();
	}, [q]);

	return (
		<View style={styles.container}>
			<HeaderWithSearch title="Search Results"/>

			{loading ? (
				<View style={styles.centerContainer}>
					<ActivityIndicator size="large" color="#C6B3E8"/>
					<Text style={styles.loadingText}>Searching Database...</Text>
				</View>
			) : error ? (
				<View style={styles.centerContainer}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			) : (
				<ScrollView showsVerticalScrollIndicator={false}>
					<Text style={styles.pageTitle}>Results for "{q}"</Text>

					<Text style={styles.sectionTitle}>Artists</Text>
					{results.artists.length > 0 ? (
						<ScrollView horizontal showsHorizontalScrollIndicator={false}
									contentContainerStyle={styles.horizontalContent}>
							{results.artists.map((artist: any) => (
								<ArtistCard
									key={artist.mbid}
									title={artist.name}
									artist={artist.artist_type || "Artist"}
									onPress={() => router.push({pathname: "/Artist", params: {mbid: artist.mbid}})}
								/>
							))}
						</ScrollView>
					) : (
						<Text style={styles.emptyText}>No artists found.</Text>
					)}

					<Text style={styles.sectionTitle}>Albums</Text>
					{results.albums.length > 0 ? (
						<ScrollView horizontal showsHorizontalScrollIndicator={false}
									contentContainerStyle={styles.horizontalContent}>
							{results.albums.map((album: any) => (
								<SongCard
									key={album.mbid}
									title={album.title}
									artist="Album"
									// Pass the new cover_url we added to the backend!
									image={album.cover_url ? {uri: album.cover_url} : undefined}
									onPress={() => router.push({pathname: "/Album", params: {mbid: album.mbid}})}
								/>
							))}
						</ScrollView>
					) : (
						<Text style={styles.emptyText}>No albums found.</Text>
					)}

					<Text style={styles.sectionTitle}>Songs</Text>
					{results.songs.length > 0 ? (
						<ScrollView horizontal showsHorizontalScrollIndicator={false}
									contentContainerStyle={styles.horizontalContent}>
							{results.songs.map((song: any) => (
								<SongCard
									key={song.mbid}
									title={song.title}
									artist="Song"
									onPress={() => router.push({pathname: "/Song", params: {mbid: song.mbid}})}
								/>
							))}
						</ScrollView>
					) : (
						<Text style={styles.emptyText}>No songs found.</Text>
					)}

					{!loading && results.artists.length === 0 && results.albums.length === 0 && results.songs.length === 0 && (
						<View style={styles.centerContainer}>
							<Text style={styles.errorText}>No results found for "{q}".</Text>
						</View>
					)}
				</ScrollView>
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
		marginTop: 60,
	},
	pageTitle: {
		fontSize: 20,
		fontWeight: "400",
		marginTop: 20,
		marginLeft: 20,
		color: "#A0A0B0",
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
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	loadingText: {
		color: "#C6B3E8",
		marginTop: 12,
		fontSize: 16,
	},
	errorText: {
		color: "#FFFFFF",
		fontSize: 16,
	},
	emptyText: {
		color: "#A0A0B0",
		fontSize: 16,
		marginLeft: 20,
		marginTop: 8,
		marginBottom: 24,
	},
});