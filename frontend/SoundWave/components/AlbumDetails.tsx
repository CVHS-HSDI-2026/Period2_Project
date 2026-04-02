import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useRouter} from 'expo-router';
import {Image} from 'expo-image';
import {Album} from "@/services/records";
import {FontAwesome} from "@expo/vector-icons";
import {favoriteAlbum, fetchProfile, unfavoriteAlbum} from "@/services/api";
import {useAuth} from "@/context/context";
import {toast} from "sonner-native";

const AlbumDetails: React.FC<{ album: Album }> = ({album}) => {
	const router = useRouter();
	const { user } = useAuth();

	const [imageFailed, setImageFailed] = useState(false);
	const [isFavorited, setIsFavorited] = useState(false);

	const handleToggleFavorite = async () => {
		try {
			if (isFavorited) {
				await unfavoriteAlbum(album.id, 1);
				setIsFavorited(false);
			} else {
				await favoriteAlbum(album.id, 1);
				setIsFavorited(true);
			}
		} catch (e) {
			toast("Please log in to manage favorites.");
		}
	};

	useEffect(() => {
		if (user && album) {
			fetchProfile(user.username).then(profileData => {
				const alreadyFavorited = profileData.favorite_albums?.some((fav: any) => fav.album_id === album.id);
				setIsFavorited(!!alreadyFavorited);
			}).catch(e => console.error(e));
		}
	}, [user, album]);

	if (!album) return null;

	return (
		<View style={styles.outerContainer}>
			<View style={styles.contentRow}>
				{album.cover && !imageFailed ? (
					<Image
						source={{uri: album.cover}}
						style={styles.cover}
						cachePolicy="memory-disk"
						onError={() => setImageFailed(true)}
					/>
				) : (
					<View style={[styles.cover, styles.coverFallback]}/>
				)}

				<View style={styles.gridContainer}>
					<View style={styles.column}>
						<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
							<Text style={[styles.text, {flex: 1, marginRight: 10}]} numberOfLines={2}>
								<Text style={styles.label}>Title: </Text>{album.title}
							</Text>
						</View>
						<Text style={styles.text}>
							<Text style={styles.label}>Artist: </Text>
							<TouchableOpacity
								onPress={() => router.push({pathname: "/Artist", params: {mbid: album.artist_mbid}})}>
								<Text style={[styles.text, styles.linkText]}>{album.artist}</Text>
							</TouchableOpacity>
						</Text>
						<Text style={styles.text}><Text style={styles.label}>Year Released: </Text>{album.year}</Text>
					</View>

					<View style={styles.column}>
						<Text style={styles.text}><Text style={styles.label}>Rating: </Text>{album.rating || "N/A"}
						</Text>
						<Text style={styles.text}><Text style={styles.label}>Genre: </Text>{album.genre || "N/A"}</Text>
						<TouchableOpacity onPress={handleToggleFavorite} style={{flexDirection: 'row', alignItems: 'center', gap: 8, padding: 4}}>
							<FontAwesome
								name={isFavorited ? "heart" : "heart-o"}
								size={24}
								color={isFavorited ? "#ff3b3b" : "#FFFFFF"}
							/>
							<Text style={styles.text}>
								<Text style={styles.label}>Favorite</Text>
							</Text>
						</TouchableOpacity>
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

export default AlbumDetails;