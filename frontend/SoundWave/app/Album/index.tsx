import {StyleSheet, View, ScrollView, ActivityIndicator, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '@/components/HeaderWithSearch';
import CommentBoxWithTracks from '@/components/AlbumBox';
import AlbumDetails from '@/components/AlbumDetails';
import {useLocalSearchParams} from "expo-router";
import {fetchAlbumDetails} from "@/services/api";
import HeaderWithSearch from "@/components/HeaderWithSearch";

export interface Track {
	mbid: string;
	title: string;
	duration: number;
	number: string;
}

export interface Album {
	title: string;
	artist: string;
	artist_mbid: string;
	rating: string;
	genre: string;
	year: string | number;
	cover: string;
	tracks: Track[];
}

export default function AlbumPage() {
	const {mbid} = useLocalSearchParams<{ mbid: string }>();
	const [album, setAlbum] = useState<Album | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadAlbum = async () => {
			if (!mbid) return;
			try {
				const data = await fetchAlbumDetails(mbid);
				setAlbum(data.album);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		loadAlbum();
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
						{album && (
							<>
								<AlbumDetails album={album}/>
								<CommentBoxWithTracks album={album}/>
							</>
						)}
					</ScrollView>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	safeArea: {flex: 1, backgroundColor: '#14172B'},
	scroll: {flex: 1, backgroundColor: '#14172B'},
	scrollContent: {flexGrow: 1, backgroundColor: '#14172B'},
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