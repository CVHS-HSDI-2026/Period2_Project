import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { fetchAlbumDetails } from '@/services/api';

interface Album {
	title: string;
	artist: string;
	artist_mbid: string;
	rating: string;
	genre: string;
	year: string | number;
	cover: string;
}

const AlbumDetails: React.FC = () => {
	const router = useRouter();
	const { mbid } = useLocalSearchParams<{ mbid: string }>();

	const [album, setAlbum] = useState<Album | null>(null);
	const [loading, setLoading] = useState(true);
	const [imageFailed, setImageFailed] = useState(false);

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

	if (loading) {
		return (
			<View style={styles.centerContainer}>
				<ActivityIndicator size="large" color="#C6B3E8" />
			</View>
		);
	}

	if (!album) {
		return (
			<View style={styles.centerContainer}>
				<Text style={styles.text}>Album not found.</Text>
			</View>
		);
	}

	return (
		<View style={styles.outerContainer}>
			<View style={styles.contentRow}>
				{album.cover && !imageFailed ? (
					<Image
						source={{ uri: album.cover }}
						style={styles.cover}
						cachePolicy="memory-disk"
						onError={() => setImageFailed(true)}
					/>
				) : (
					<View style={[styles.cover, styles.coverFallback]} />
				)}

				<View style={styles.gridContainer}>
					<View style={styles.column}>
						<Text style={styles.text}><Text style={styles.label}>Title: </Text>{album.title}</Text>
						<Text style={styles.text}>
							<Text style={styles.label}>Artist: </Text>
							<TouchableOpacity onPress={() => router.push({ pathname: "/Artist", params: { mbid: album.artist_mbid }})}>
								<Text style={[styles.text, styles.linkText]}>{album.artist}</Text>
							</TouchableOpacity>
						</Text>
						<Text style={styles.text}><Text style={styles.label}>Year Released: </Text>{album.year}</Text>
					</View>

					<View style={styles.column}>
						<Text style={styles.text}><Text style={styles.label}>Rating: </Text>{album.rating}</Text>
						<Text style={styles.text}><Text style={styles.label}>Genre: </Text>{album.genre}</Text>
					</View>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#14172B',
	},
	outerContainer: {
		width: "90%",
		alignSelf: "center",
		marginTop: 20,
	},
	contentRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	cover: {
		width: 180,
		height: 180,
		borderRadius: 4,
		marginRight: 25,
	},
	coverFallback: {
		backgroundColor: '#2A2D43',
	},
	gridContainer: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 10,
	},
	column: {
		flex: 1,
		gap: 12,
	},
	label: {
		fontWeight: '400',
		color: '#FFF',
	},
	text: {
		fontSize: 20,
		color: '#FFF',
		fontFamily: 'Jost_400Regular',
	},
	linkText: {
		textDecorationLine: 'underline',
	}
});

export default AlbumDetails;