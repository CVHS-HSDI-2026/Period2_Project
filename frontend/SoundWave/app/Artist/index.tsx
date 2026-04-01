import {StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderWithSearch from "../../components/HeaderWithSearch";
import {useRouter, useLocalSearchParams} from "expo-router";
import {useFonts, Jost_400Regular, Jost_500Medium, Jost_700Bold} from '@expo-google-fonts/jost';
import SongCard from "../../components/SongCard";
import {favoriteArtist, fetchArtistDetails, unfavoriteArtist} from "@/services/api";
import ArtistCard, {stringToColor} from "@components/ArtistCard";
import {FontAwesome} from "@expo/vector-icons";

export default function Artist() {
	const router = useRouter();
	const {mbid} = useLocalSearchParams<{ mbid: string }>();
	const [isFavorited, setIsFavorited] = useState(false);

	const [fontsLoaded] = useFonts({Jost_400Regular, Jost_500Medium, Jost_700Bold});
	const [artistData, setArtistData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadArtist = async () => {
			if (!mbid) return;
			try {
				const data = await fetchArtistDetails(mbid);
				setArtistData(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		loadArtist();
	}, [mbid]);

	if (!fontsLoaded) return null;

	const handleToggleFavorite = async () => {
		try {
			if (isFavorited) {
				await unfavoriteArtist(artist.id, 1);
				setIsFavorited(false);
			} else {
				await favoriteArtist(artist.id, 1);
				setIsFavorited(true);
			}
		} catch (e) {
			alert("Please log in to manage favorites.");
		}
	};

	if (loading) {
		return (
			<View style={[styles.container, {justifyContent: 'center'}]}>
				<ActivityIndicator size="large" color="#C6B3E8"/>
			</View>
		);
	}

	if (!artistData || !artistData.artist) {
		return (
			<View style={[styles.container, {justifyContent: 'center'}]}>
				<Text style={styles.columnText}>Artist not found.</Text>
			</View>
		);
	}

	const {artist, albums} = artistData;

	// idk what colone is supposed to mean but i'll keep it
	const colone = [
		{columnName: 'Artist:', value: artist.name},
		{columnName: 'Born/Formed:', value: artist.born ? new Date(artist.born).getFullYear() : 'Unknown'},
		{columnName: 'Type:', value: artist.disambiguation || 'Musician'},
		{columnName: '# Followers:', value: '0'}, // todo: wire to user db
	];

	return (
		<View style={styles.container}>
			<HeaderWithSearch title="SoundWave"/>
			<ScrollView style={{width: '100%'}} contentContainerStyle={styles.scrollContent}>

				{/* profile stats */}
				<View style={styles.profileSection}>
					<View style={styles.profileLeft}>
						<View style={[styles.avatarPlaceholder, {backgroundColor: stringToColor(artist.name)}]}>
							<Text style={styles.initialsText}>
								{artist.name.substring(0, 2).toUpperCase()}
							</Text>
						</View>
					</View>

					<View style={styles.profileRight}>
						<View style={styles.columnsContainer}>
							<View style={styles.column}>
								{colone.map((item, idx) => (
									<Text style={styles.columnText} key={`col1-${idx}`}>
										{item.columnName}{item.value ? ` ${item.value}` : ''}
									</Text>
								))}
							</View>
							<View style={styles.column}>
							</View>
						</View>
						<Text style={styles.titleBioText}>Bio:</Text>
						<Text style={styles.biotext}>
							{artist.disambiguation ? `Known for: ${artist.disambiguation}. ` : ''}
							For more info, check out their profile on MusicBrainz: {artist.mbid}.
						</Text>
						<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
							<Text style={[styles.titleBioText, {flex: 1, marginRight: 10}]} numberOfLines={2}>
								<Text style={styles.titleBioText}>Bio:</Text>
								<Text style={styles.biotext}>
									{artist.disambiguation ? `Known for: ${artist.disambiguation}. ` : ''}
									For more info, check out their profile on MusicBrainz: {artist.mbid}.
								</Text>
							</Text>

							<TouchableOpacity onPress={handleToggleFavorite} style={{padding: 4}}>
								<FontAwesome
									name={isFavorited ? "heart" : "heart-o"}
									size={24}
									color={isFavorited ? "#ff3b3b" : "#FFFFFF"}
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>

				{/* top songs */}
				<Text style={styles.sectionTitle}>Top Songs:</Text>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.horizontalContent}>
					<View style={styles.horizontalContent}>
						<Text style={styles.biotext}>Feature coming soon.</Text>
					</View>
				</ScrollView>
				{/* top albums */}
				<Text style={styles.sectionTitle}>Top Albums:</Text>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.horizontalContent}>
					{albums && albums.length > 0 ? (
						albums.map((album: any, i: number) => (
							<SongCard
								key={`album-${i}`}
								variant="popular"
								title={album.title}
								artist={artist.name}
								image={{uri: album.cover_url}}
								rating={album.rating}
								commentsCount={0}
								onPress={() => router.push({pathname: "/Album", params: {mbid: album.mbid}})}
							/>
						))
					) : (
						<Text style={styles.biotext}>No albums found.</Text>
					)}
				</ScrollView>
				{/* top artists */}
				<Text style={styles.sectionTitle}>Related Artists:</Text>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.horizontalContent}>
					<View style={styles.horizontalContent}>
						<Text style={styles.biotext}>Feature coming soon.</Text>
					</View>
				</ScrollView>
				{/* recommended users */}
				<Text style={styles.sectionTitle}>Recommended Users:</Text>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.horizontalContent}>
					<View style={styles.horizontalContent}>
						<Text style={styles.biotext}>Feature coming soon.</Text>
					</View>
				</ScrollView>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#181B33',
		alignItems: 'center',
	},
	scrollContent: {
		paddingVertical: 40,
	},
	profileSection: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '90%',
		maxWidth: 1200,
		marginBottom: 40,
	},
	profileLeft: {
		width: '20%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarPlaceholder: {
		width: 200,
		height: 200,
		borderRadius: 100,
		backgroundColor: '#ffffff20',
		marginLeft: 150,
		justifyContent: "center",
		alignItems: "center",
	},
	initialsText: {
		color: '#FFF',
		fontSize: 48,
		fontFamily: 'Jost_700Bold',
	},
	profileRight: {
		width: '65%',
	},
	edit: {
		fontSize: 14,
		color: '#FFFFFF',
		fontFamily: 'Jost_400Regular',
		alignSelf: 'flex-end',
		marginBottom: 10,
	},
	columnsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	column: {
		width: '48%',
	},
	columnText: {
		fontSize: 18,
		color: '#FFFFFF',
		fontFamily: 'Jost_400Regular',
		paddingVertical: 6,
	},
	titleBioText: {
		fontSize: 20,
		color: '#FFFFFF',
		fontFamily: 'Jost_500Medium',
		marginBottom: 8,
	},
	biotext: {
		fontSize: 16,
		color: '#FFFFFF',
		fontFamily: 'Jost_400Regular',
		lineHeight: 22,
	},
	sectionTitle: {
		fontSize: 20,
		color: '#FFFFFF',
		fontFamily: 'Jost_500Medium',
		alignSelf: 'flex-start',
		marginLeft: 40,
		marginBottom: 16,
		marginTop: 30,
	},
	horizontalContent: {
		flexDirection: 'row',
		gap: 24,
		paddingLeft: 40,
		paddingRight: 20,
		width: '100%',
	},
});