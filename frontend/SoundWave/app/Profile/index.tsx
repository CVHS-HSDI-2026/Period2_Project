import {StyleSheet, Text, View, Pressable, ScrollView, TextInput, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderWithSearch from "../../components/HeaderWithSearch";
import {useRouter, useLocalSearchParams} from "expo-router";
import {useFonts, Jost_400Regular, Jost_500Medium, Jost_700Bold} from '@expo-google-fonts/jost';
import SongCard from "../../components/SongCard";
import ArtistCard from "../../components/ArtistCard";
import {fetchProfile, updateProfileBio, followUser, unfollowUser} from "@/services/api";
import {toast} from "sonner-native";
import {Image} from "expo-image";

export default function Profile() {
	const router = useRouter();

	const {isOwner, username} = useLocalSearchParams<{ isOwner: string, username: string }>();
	const isProfileOwner = isOwner === "true";
	const [fontsLoaded] = useFonts({Jost_400Regular, Jost_500Medium, Jost_700Bold});

	const [isEditing, setIsEditing] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);
	const [loading, setLoading] = useState(true);

	const [bio, setBio] = useState('');
	const [profileData, setProfileData] = useState<any>(null);

	useEffect(() => {
		const loadProfile = async () => {
			if (!username) return;
			try {
				const data = await fetchProfile(username);
				setProfileData(data);
				setBio(data.user.bio || 'This user does not have a bio yet.');
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		loadProfile();
	}, [username]);

	const handleSave = async () => {
		try {
			await updateProfileBio(username, bio);
			setIsEditing(false);
			setProfileData((prev: any) => ({...prev, user: {...prev.user, bio}}));
		} catch (e) {
			toast("Failed to save bio");
		}
	};

	const handleCancel = () => {
		setBio(profileData?.user?.bio || 'This user does not have a bio yet.');
		setIsEditing(false);
	};

	const toggleFollow = async () => {
		try {
			if (isFollowing) {
				await unfollowUser(profileData.user.id);
				setIsFollowing(false);
			} else {
				await followUser(profileData.user.id);
				setIsFollowing(true);
			}
		} catch (e) {
			toast("Please log in to follow users.");
		}
	};

	if (!fontsLoaded) return null;
	if (loading) {
		return (
			<View style={[styles.container, {justifyContent: 'center'}]}>
				<ActivityIndicator size="large" color="#C6B3E8"/>
			</View>
		);
	}
	if (!profileData) {
		return <View style={styles.container}><Text style={styles.columnText}>Profile not found</Text></View>;
	}

	const colOne = [
		{columnName: 'Username:', value: profileData.user.username},
		{columnName: 'Joined:', value: new Date(profileData.user.created_at).toLocaleDateString()},
	];

	const colTwo = [
		{columnName: 'Followers:', value: profileData.followers},
		{columnName: 'Following:', value: profileData.following},
	];

	const canViewDetails = profileData.user.privacy === "Public" || isProfileOwner;

	// const colone = isProfileOwner
	// 	? [
	// 		{columnName: 'Username:', value: profileData.username},
	// 		{columnName: '# followers' }, // todo: figure out how to add
	// 		{columnName: '# ratings'}, // todo: figure out how to add
	// 	]
	// 	: [
	// 		{columnName: 'Display Name:', value: displayName},
	// why the fuck are we renaming username to display name? why are we allowing the user to change their username?
	// renaming the username opens up a whole can of worms with regard to checking if the db complains (since username
	// is a UNIQUE column for our Users table). I don't think we should mess with it
	// 		{columnName: '# followers'},
	// 		{columnName: '# ratings'},
	// 	];
	//
	// const coltwo = isProfileOwner
	// 	? [
	// 		{columnName: 'Display Name:', value: displayName},
	// 		{columnName: '# following'},
	// 		{columnName: '# comments'},
	// 	]
	// 	: [
	// 		{columnName: ' ', value: ' '}, // ???
	// 		{columnName: '# following'},
	// 		{columnName: '# comments'},
	// 	];

	return (
		<View style={styles.container}>
			<HeaderWithSearch title="SoundWave"/>

			<ScrollView
				style={{width: '100%'}}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>

				<View style={styles.profileSection}>

					<View style={styles.profileLeft}>
						{profileData.user.profile_pic_url ? (
							<Image
								source={{ uri: profileData.user.profile_pic_url }}
								style={[styles.avatarPlaceholder, { backgroundColor: 'transparent' }]}
								cachePolicy="memory-disk"
							/>
						) : (
							<View style={styles.avatarPlaceholder}>
								<Text style={styles.initialsText}>
									{profileData.user.username.substring(0, 2).toUpperCase()}
								</Text>
							</View>
						)}
					</View>

					<View style={styles.profileRight}>

						{/* Owner Edit Controls */}
						{isProfileOwner ? (
							isEditing ? (
								<View style={{flexDirection: 'row', justifyContent: 'flex-end', gap: 10}}>
									<Pressable onPress={handleSave}>
										<Text style={styles.edit}>Save</Text>
									</Pressable>
									<Pressable onPress={handleCancel}>
										<Text style={styles.edit}>Cancel</Text>
									</Pressable>
								</View>
							) : (
								<Pressable onPress={() => setIsEditing(true)}>
									<Text style={styles.edit}>Edit</Text>
								</Pressable>
							)
						) : (
							<Pressable onPress={toggleFollow}>
								<View style={styles.buttonBack}>
									<Text style={styles.buttonText}>
										{isFollowing ? "Requested" : "Follow"}
									</Text>
								</View>
							</Pressable>
						)}

						{/* Columns */}
						<View style={styles.columnsContainer}>

							<View style={styles.column}>
								{colOne.map((item, idx) => (
									<Text style={styles.columnText} key={`col1-${idx}`}>
										{item.columnName}{item.value !== undefined ? ` ${item.value}` : ''}
									</Text>
								))}
							</View>

							<View style={styles.column}>
								{colTwo.map((item, idx) => (
									<Text style={styles.columnText} key={`col2-${idx}`}>
										{item.columnName}{item.value !== undefined ? ` ${item.value}` : ''}
									</Text>
								))}
							</View>

						</View>

						<View style={styles.bioContainer}>
							<Text style={styles.titleBioText}>Bio:</Text>
							{isEditing && isProfileOwner ? (
								<TextInput
									style={[styles.biotext, styles.input, {height: 80}]}
									multiline
									value={bio}
									onChangeText={setBio}
								/>
							) : (
								<Text style={styles.biotext}>{bio}</Text>
							)}
						</View>

					</View>
				</View>

				{canViewDetails ? (
					<>
						<Text style={styles.sectionTitle}>Recent Activity:</Text>

						<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
							{profileData.activity?.length > 0 ? profileData.activity.map((act: any, i: number) => (
								<View key={`act-${i}`} style={styles.activityCard}>
									<Text style={styles.activityTitle}>
										{act.type === 'review' ? 'Reviewed ' : 'Replied to '}
										{act.song_title || act.album_title || 'Unknown'}
										{act.rating ? `${act.rating}/10` : ''}
									</Text>
									<Text style={styles.activityContent} numberOfLines={3}>{act.content}</Text>
									<Text style={styles.activityDate}>{new Date(act.created_at).toLocaleDateString()}</Text>
								</View>
							)) : <Text style={styles.biotext}>No recent activity.</Text>}
						</ScrollView>

						<Text style={styles.sectionTitle}>Favorite Songs:</Text>

						<ScrollView horizontal showsHorizontalScrollIndicator={false}
									contentContainerStyle={styles.horizontalContent}>
							{profileData.favorite_songs?.length > 0 ? profileData.favorite_songs.map((fav: any, i: number) => (
								<SongCard
									key={`fav-song-${i}`}
									variant="popular"
									title={fav.title}
									artist={fav.artist_name || "Unknown"}
									image={fav.cover_url ? {uri: fav.cover_url} : undefined}
									onPress={() => router.push({pathname: "/Song", params: {mbid: fav.mbid}})}
								/>
							)) : <Text style={styles.biotext}>No favorites yet.</Text>}
						</ScrollView>

						<Text style={styles.sectionTitle}>Favorite Albums:</Text>

						<ScrollView horizontal showsHorizontalScrollIndicator={false}
									contentContainerStyle={styles.horizontalContent}>
							{profileData.favorite_albums?.length > 0 ? profileData.favorite_albums.map((fav: any, i: number) => (
								<SongCard
									key={`fav-alb-${i}`}
									variant="popular"
									title={fav.title}
									artist={fav.artist_name || "Unknown"}
									image={fav.cover_url ? {uri: fav.cover_url} : undefined}
									onPress={() => router.push({pathname: "/Album", params: {mbid: fav.mbid}})}
								/>
							)) : <Text style={styles.biotext}>No favorites yet.</Text>}
						</ScrollView>

						<Text style={styles.sectionTitle}>Favorite Artists:</Text>

						<ScrollView horizontal showsHorizontalScrollIndicator={false}
									contentContainerStyle={styles.horizontalContent}>
							{profileData.favorite_artists?.length > 0 ? profileData.favorite_artists.map((fav: any, i: number) => (
								<ArtistCard
									key={`fav-art-${i}`}
									variant="popular"
									title={fav.name}
									artist="Artist"
									onPress={() => router.push({pathname: "/Artist", params: {mbid: fav.mbid}})}
								/>
							)) : <Text style={styles.biotext}>No favorites yet.</Text>}
						</ScrollView>

						<Text style={styles.sectionTitle}>Recommended Users:</Text>

						<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
							{profileData.recommended_users?.length > 0 ? profileData.recommended_users.map((recUser: any, i: number) => (
								<ArtistCard
									key={`rec-user-${i}`}
									variant="popular"
									title={recUser.display_name || recUser.username}
									artist={`@${recUser.username}`}
									image={recUser.profile_pic_url ? {uri: recUser.profile_pic_url} : undefined}
									onPress={() => router.push({ pathname: "/Profile", params: { username: recUser.username, isOwner: "false" } })}
								/>
							)) : <Text style={styles.biotext}>No recommendations yet.</Text>}
						</ScrollView>
					</>
				) : (
					<View style={{ alignItems: 'center', marginTop: 40 }}>
						<Text style={styles.titleBioText}>This profile is private.</Text>
					</View>
				)}

			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#14172B',
		alignItems: 'center',
	},
	bioContainer: {
		borderWidth: 1,
		borderColor: '#FFFFFF',
		borderRadius: 12,
		padding: 16,
		marginTop: 10
	},
	profileSection: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '90%',
		maxWidth: 1200,
		marginBottom: 40,
	},
	profileLeft: {
		width: '35%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarPlaceholder: {
		width: 200,
		height: 200,
		borderRadius: 100,
		backgroundColor: '#ffffff20',
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
	input: {
		borderWidth: 1,
		borderColor: '#FFFFFF50',
		borderRadius: 8,
		padding: 8,
		color: '#FFFFFF',
		fontFamily: 'Jost_400Regular',
		fontSize: 16,
		marginTop: 4,
	},
	scrollContent: {
		paddingVertical: 40,
		paddingHorizontal: 0,
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
	inlineEditRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 6,
	},
	inputInline: {
		borderBottomWidth: 1,
		borderColor: '#FFFFFF50',
		color: '#FFFFFF',
		fontFamily: 'Jost_400Regular',
		fontSize: 18,
		paddingVertical: 2,
		marginLeft: 4,
	},
	buttonBack: {
		width: 80,
		height: 25,
		borderRadius: 6,
		backgroundColor: '#9AA2D6',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'flex-end',
	},
	buttonText: {
		fontSize: 14,
		color: '#14172B',
		fontFamily: 'Jost_400Regular',
		alignSelf: 'center',
		userSelect: 'none'
	},
	activityCard: {
		backgroundColor: "#2A2F5A",
		padding: 16,
		borderRadius: 8,
		width: 250,
		marginRight: 15,
		borderWidth: 1,
		borderColor: "#FFFFFF30"
	},
	activityTitle: {
		color: "#9AA2D6",
		fontFamily: "Jost_500Medium",
		fontSize: 14,
		marginBottom: 8
	},
	activityContent: {
		color: "#FFFFFF",
		fontFamily: "Jost_400Regular",
		fontSize: 16,
		marginBottom: 8
	},
	activityDate: {
		color: "#FFFFFF50",
		fontFamily: "Jost_400Regular",
		fontSize: 12,
		alignSelf: "flex-end"
	},
});