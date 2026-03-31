import {StyleSheet, Text, View, Pressable, ScrollView, TextInput, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderWithSearch from "../../components/HeaderWithSearch";
import {useRouter, useLocalSearchParams} from "expo-router";
import {useFonts, Jost_400Regular, Jost_500Medium, Jost_700Bold} from '@expo-google-fonts/jost';
import SongCard from "../../components/SongCard";
import ArtistCard from "../../components/ArtistCard";
import {fetchProfile, updateProfileBio} from "@/services/api";

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
			alert("Failed to save bio");
		}
	};

	const handleCancel = () => {
		setBio(profileData?.user?.bio || 'This user does not have a bio yet.');
		setIsEditing(false);
	};

	const toggleFollow = () => {
		// todo: make api handlers for follow/unfollow and wire to backend
		setIsFollowing(!isFollowing);
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
		{columnName: 'Followers:', value: profileData.followers},
	];

	const colTwo = [
		{columnName: 'Following:', value: profileData.following},
		{columnName: 'Joined:', value: new Date(profileData.user.created_at).toLocaleDateString()},
	];

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
			<HeaderWithSearch title="SoundWAVE"/>

			<ScrollView
				style={{width: '100%'}}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>

				<View style={styles.profileSection}>

					<View style={styles.profileLeft}>
						<View style={styles.avatarPlaceholder}>
							<Text style={styles.initialsText}>
								{profileData.user.username.substring(0, 2).toUpperCase()}
							</Text>
						</View>
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

						<Text style={styles.titleBioText}>Bio:</Text>
						{isEditing && isProfileOwner ? (
							<TextInput
								style={[styles.biotext, styles.input, {height: 100}]}
								multiline
								value={bio}
								onChangeText={setBio}
							/>
						) : (
							<Text style={styles.biotext}>{bio}</Text>
						)}

					</View>
				</View>

				<Text style={styles.sectionTitle}>Top Songs:</Text>

				<ScrollView horizontal showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.horizontalContent}>
					{profileData.favorites.length > 0 ? profileData.favorites.map((fav: any, i: number) => (
						<SongCard
							key={`fav-${i}`}
							variant="popular"
							title={`Song ${fav.song_id}`}
							artist="Various"
							rating={8}
							commentsCount={0}
							onPress={() => router.push("./Song")}
						/>
					)) : <Text style={styles.biotext}>No favorites yet.</Text>}
				</ScrollView>

				<Text style={styles.sectionTitle}>Top Albums:</Text>

				<ScrollView horizontal showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.horizontalContent}>
					{/* todo: fix when we have favorite albums */}
					{Array.from({length: 10}).map((_, i) => (
						<SongCard
							key={`album-${i}`}
							variant="popular"
							title="Title"
							artist="Artist"
							rating={8}
							commentsCount={12}
							onPress={() => router.push("./Song")}
						/>
					))}
				</ScrollView>

				<Text style={styles.sectionTitle}>Top Artists:</Text>

				<ScrollView horizontal showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.horizontalContent}>
					{/* todo: fix when we have favorite artists */}
					{Array.from({length: 10}).map((_, i) => (
						<ArtistCard
							key={`artist-${i}`}
							variant="popular"
							title="Username"
							artist="Artist"
							rating={8}
							commentsCount={1278}
							onPress={() => router.push("./Artist")}
						/>
					))}
				</ScrollView>

				<Text style={styles.sectionTitle}>Recommended Users:</Text>

				<ScrollView horizontal showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.horizontalContent}>
					{/* i forgot how this worked...will check back on this */}
					{Array.from({length: 10}).map((_, i) => (
						<ArtistCard
							key={`rec-${i}`}
							variant="popular"
							title="Username"
							artist="Artist"
							rating={8}
							commentsCount={12}
							onPress={() =>
								router.push({
									pathname: "./Profile",
									params: {isOwner: "false"}
								})
							}
						/>
					))}
				</ScrollView>

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
	},
	initialsText: {
		color: '#FFF',
		fontSize: 48,
		fontFamily: 'Jost_700Bold'
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
});