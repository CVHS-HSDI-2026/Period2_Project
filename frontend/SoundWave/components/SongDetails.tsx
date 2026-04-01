import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useRouter} from 'expo-router';
import {Image} from 'expo-image';
import {SongRecord} from "@/services/records";
import {FontAwesome} from "@expo/vector-icons";
import {favoriteSong, unfavoriteSong} from "@/services/api";

const formatTime = (ms: number | string) => {
	const numMs = Number(ms);
	if (!numMs) return "Unknown";
	const minutes = Math.floor(numMs / 60000);
	const seconds = ((numMs % 60000) / 1000).toFixed(0);
	return minutes + ":" + (parseInt(seconds) < 10 ? "0" : "") + seconds;
};

const SongDetails: React.FC<{ song: SongRecord }> = ({song}) => {
	const router = useRouter();
	const [imageFailed, setImageFailed] = useState(false);
	const [isFavorited, setIsFavorited] = useState(false);

	if (!song) return null;

	const handleToggleFavorite = async () => {
		try {
			if (isFavorited) {
				await unfavoriteSong(song.id, 1);
				setIsFavorited(false);
			} else {
				await favoriteSong(song.id, 1);
				setIsFavorited(true);
			}
		} catch (e) {
			alert("Please log in to manage favorites.");
		}
	};

	return (
		<View style={styles.outerContainer}>
			<View style={styles.contentRow}>

				{song.cover && !imageFailed ? (
					<Image
						source={{uri: song.cover}}
						style={styles.cover}
						cachePolicy="memory-disk"
						onError={() => setImageFailed(true)}
					/>
				) : (
					<View style={[styles.cover, styles.coverFallback]}/>
				)}

				<View style={styles.gridContainer}>
					<View style={styles.column}>
						<Text style={styles.text}><Text style={styles.label}>Title: </Text>{song.title}</Text>

						<Text style={styles.text}>
							<Text style={styles.label}>Artist: </Text>
							<TouchableOpacity
								onPress={() => router.push({pathname: "/Artist", params: {mbid: song.artist_mbid}})}>
								<Text style={[styles.text, styles.linkText]}>{song.artist}</Text>
							</TouchableOpacity>
						</Text>

						<Text style={styles.text}>
							<Text style={styles.label}>Album: </Text>
							{song.album_mbid ? (
								<TouchableOpacity
									onPress={() => router.push({pathname: "/Album", params: {mbid: song.album_mbid}})}>
									<Text style={[styles.text, styles.linkText]}>{song.album}</Text>
								</TouchableOpacity>
							) : (
								<Text style={styles.text}>{song.album}</Text>
							)}
						</Text>

						<Text style={styles.text}><Text style={styles.label}>Year: </Text>{song.year}</Text>

						<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
							<Text style={[styles.text, {flex: 1, marginRight: 10}]} numberOfLines={2}>
								<Text style={styles.label}>Title: </Text>{song.title}
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

					<View style={styles.column}>
						<Text style={styles.text}><Text style={styles.label}>Rating: </Text>{song.rating}</Text>
						<Text style={styles.text}><Text style={styles.label}>Genre: </Text>{song.genre}</Text>
						<Text style={styles.text}><Text
							style={styles.label}>Duration: </Text>{formatTime(song.duration)}</Text>
					</View>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	outerContainer: {width: "90%", alignSelf: "center", marginTop: 20},
	contentRow: {flexDirection: 'row', alignItems: 'flex-start'},
	cover: {width: 180, height: 180, borderRadius: 4, marginRight: 25},
	coverFallback: {backgroundColor: '#2A2D43'},
	gridContainer: {flex: 1, flexDirection: 'row', marginTop: 10},
	column: {flex: 1, gap: 12},
	label: {fontWeight: '400', color: '#FFF'},
	text: {fontSize: 20, color: '#FFF', fontFamily: 'Jost_400Regular'},
	linkText: {textDecorationLine: 'underline'}
});

export default SongDetails;