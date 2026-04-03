import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import SongDetails from '../../components/SongDetails';
import SongBox from '../../components/SongBox';
import HeaderWithSearch from "../../components/HeaderWithSearch";
import {useLocalSearchParams} from "expo-router";
import {fetchSongDetails} from "@/services/api";
import {SongRecord} from "@/services/records";
import {toast} from "sonner-native";

export default function Song() {
	const {mbid} = useLocalSearchParams<{ mbid: string }>();
	const [song, setSong] = useState<SongRecord | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadSong = async () => {
			if (!mbid) return;
			try {
				const data = await fetchSongDetails(mbid);
				setSong(data.song);
			} catch (error) {
				toast("Failed to load song.")
			} finally {
				setLoading(false);
			}
		};
		loadSong();
	}, [mbid]);

	return (
		<View style={styles.container}>
			<HeaderWithSearch title="Search Results"/>

			{loading ? (
				<View style={styles.centerContainer}>
					<ActivityIndicator size="large" color="#C6B3E8"/>
					<Text style={styles.loadingText}>Loading Album...</Text>
				</View>
			) : (
				<View style={styles.safeArea}>
					<ScrollView
						showsVerticalScrollIndicator={false}
						style={styles.scroll}
						contentContainerStyle={styles.scrollContent}
					>
						{song && (
							<>
								<SongDetails song={song}/>
								<SongBox song={song}/>
							</>
						)}
					</ScrollView>
				</View>
			)}
		</View>
	);
}
const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#14172B',
	},
	scroll: {
		flex: 1,
		backgroundColor: '#14172B',
	},
	scrollContent: {
		flexGrow: 1,
		backgroundColor: '#14172B',
	},
	centerContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#14172B'},
	container: {
		flex: 1,
		backgroundColor: "#14172B",
	},
	loadingText: {
		color: "#C6B3E8",
		marginTop: 12,
		fontSize: 16,
	},
});
