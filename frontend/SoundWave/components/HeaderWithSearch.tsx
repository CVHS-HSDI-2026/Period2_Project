import {router} from 'expo-router';
import React, {FC, useState, useEffect} from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	TouchableWithoutFeedback,
	Image,
	ScrollView
} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {fetchSearchResults} from '@/services/api';

interface HeaderProps {
	title: string;
}

const HeaderWithSearch: FC<HeaderProps> = ({title}) => {
	const [searchText, setSearchText] = useState<string>('');
	const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

	const [showLiveSearch, setShowLiveSearch] = useState<boolean>(false);
	const [liveResults, setLiveResults] = useState({artists: [], albums: [], songs: []});

	const debounceTimer = React.useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (searchText.trim().length < 2) {
			setShowLiveSearch(false);
			setLiveResults({artists: [], albums: [], songs: []});
			return;
		}

		if (debounceTimer.current) clearTimeout(debounceTimer.current);

		debounceTimer.current = setTimeout(async () => {
			try {
				const data = await fetchSearchResults(searchText, 'all', 3);
				if (data && data.results) {
					setLiveResults({
						artists: data.results.artists || [],
						albums: data.results.albums || [],
						songs: data.results.songs || [],
					});
					setShowLiveSearch(true);
				}
			} catch (error) {
				console.error("Live search failed", error);
			}
		}, 300);

		return () => {
			if (debounceTimer.current) clearTimeout(debounceTimer.current);
		};
	}, [searchText]);

	const handleLogoPress = () => {
		console.log('Logo pressed!');
		router.push("/");
	}

	const handleSearchPress = () => {
		if (searchText.trim()) {
			if (debounceTimer.current) clearTimeout(debounceTimer.current);

			setShowLiveSearch(false);
			setIsDropdownVisible(false);
			router.push({pathname: "/Search", params: {q: searchText}});
		}
	};

	const handleProfilePress = () => {
		console.log('Profile icon pressed!');
		setIsDropdownVisible(!isDropdownVisible);
	};

	const handleCloseDropdown = () => {
		setIsDropdownVisible(false);
	};

	const handleProfileMenuPress = () => {
		console.log('Profile menu item pressed');
		router.push("/Profile");
		setIsDropdownVisible(false);
	};

	const handleSettingsPress = () => {
		console.log('Settings pressed');
		router.push("/Settings");
		setIsDropdownVisible(false);
	};

	const handleLogoutPress = () => {
		console.log('Logout pressed');
		router.push("/Login");
		setIsDropdownVisible(false);

	};

	return (
		<>
			{(isDropdownVisible || showLiveSearch) && (
				<TouchableWithoutFeedback onPress={() => {
					setIsDropdownVisible(false);
					setShowLiveSearch(false);
				}}>
					<View style={styles.overlay}/>
				</TouchableWithoutFeedback>
			)}

			<View style={styles.headerContainer}>

				<View style={styles.logoContainer}>
					<TouchableOpacity
						style={styles.searchButton}
						onPress={handleLogoPress}>
						<Image
							source={require('../assets/web-name.png')}
							style={styles.logoImage}
							resizeMode="contain"
						/>
					</TouchableOpacity>
					<Image
						source={require('../assets/logo.png')}
						style={styles.infoImage}
						resizeMode="contain"
					/>
				</View>

				<View style={styles.searchWrapper}>
					<View style={styles.searchContainer}>
						<TextInput
							style={styles.searchInput}
							placeholder="Search"
							value={searchText}
							onChangeText={setSearchText}
							onSubmitEditing={handleSearchPress}
							placeholderTextColor="#999"
						/>
						<TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
							<Image source={require('../assets/Search.png')} style={styles.searchImg}
								   resizeMode="contain"/>
						</TouchableOpacity>
					</View>

					{showLiveSearch && (
						<View style={styles.liveSearchDropdown}>
							<ScrollView keyboardShouldPersistTaps="handled">
								{liveResults.artists.length > 0 && (
									<View style={styles.liveSection}>
										<Text style={styles.liveSectionTitle}>Artists</Text>
										{liveResults.artists.map((a: any) => (
											<TouchableOpacity
												key={`live-art-${a.mbid}`}
												style={styles.liveItem}
												onPress={() => {
													setShowLiveSearch(false);
													router.push({pathname: "/Artist", params: {mbid: a.mbid}});
												}}
											>
												<Text style={styles.liveItemText} numberOfLines={1}>{a.name}</Text>
											</TouchableOpacity>
										))}
									</View>
								)}

								{liveResults.albums.length > 0 && (
									<View style={styles.liveSection}>
										<Text style={styles.liveSectionTitle}>Albums</Text>
										{liveResults.albums.map((a: any) => (
											<TouchableOpacity
												key={`live-alb-${a.mbid}`}
												style={styles.liveItem}
												onPress={() => {
													setShowLiveSearch(false);
													router.push({pathname: "/Album", params: {mbid: a.mbid}});
												}}
											>
												<Text style={styles.liveItemText} numberOfLines={1}>{a.title}</Text>
											</TouchableOpacity>
										))}
									</View>
								)}

								{liveResults.songs.length > 0 && (
									<View style={styles.liveSection}>
										<Text style={styles.liveSectionTitle}>Songs</Text>
										{liveResults.songs.map((a: any) => (
											<TouchableOpacity
												key={`live-alb-${a.mbid}`}
												style={styles.liveItem}
												onPress={() => {
													setShowLiveSearch(false);
													router.push({pathname: "/Song", params: {mbid: a.mbid}});
												}}
											>
												<Text style={styles.liveItemText} numberOfLines={1}>{a.title}</Text>
											</TouchableOpacity>
										))}
									</View>
								)}

								<TouchableOpacity style={styles.seeAllButton} onPress={handleSearchPress}>
									<Text style={styles.seeAllText}>See all results for "{searchText}"</Text>
								</TouchableOpacity>
							</ScrollView>
						</View>
					)}
				</View>

				{/* Profile button with dropdown */}
				<View>
					<TouchableOpacity
						style={styles.profileButton}
						onPress={handleProfilePress}
					>
						<Text style={styles.profileIcon}>
							<MaterialIcons name="person" size={24} color="#1f1f1f"/>
						</Text>
					</TouchableOpacity>

					{/* Dropdown Menu */}
					{isDropdownVisible && (
						<View style={styles.dropdown}>
							{/* User info section */}
							<View style={styles.userInfo}>
								<View style={styles.userAvatar}>
									<Text style={styles.userAvatarText}>
										<MaterialIcons name="person" size={24} color="#1f1f1f"/>
									</Text>
								</View>
								<View>
									<Text style={styles.username}>Username</Text>
									<Text style={styles.userEmail}>dummy@yy.zxed</Text>
								</View>
							</View>

							{/* Divider */}
							<View style={styles.divider}/>

							{/* Menu items */}
							<TouchableOpacity
								style={styles.menuItem}
								onPress={handleProfileMenuPress}
							>
								<Text style={styles.menuIcon}>
									<MaterialIcons name="person" size={24} color="#1f1f1f"/>
								</Text>
								<Text style={styles.menuText}>Profile</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.menuItem}
								onPress={handleSettingsPress}
							>
								<Text style={styles.menuIcon}>
									<MaterialIcons name="settings" size={24} color="#1f1f1f"/>
								</Text>
								<Text style={styles.menuText}>Settings</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.menuItem}
								onPress={handleLogoutPress}
							>
								<Text style={styles.menuIcon}>
									<MaterialIcons name="logout" size={24} color="#1f1f1f"/>
								</Text>
								<Text style={styles.menuText}>Logout</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
				{isDropdownVisible && (
					<TouchableWithoutFeedback onPress={handleCloseDropdown}>
						<View style={styles.overlay}/>
					</TouchableWithoutFeedback>
				)}
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		backgroundColor: '#E4E0F5',
		padding: 10,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		zIndex: 1000,
	},

	logoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	logoText: {
		color: '#fff',
		fontSize: 24,
		fontWeight: 'bold',
	},

	logoImage: {
		height: 45,
		width: 140,
	},

	searchWrapper: {
		flex: 1,
		marginLeft: '2%',
		marginRight: '1%',
		position: 'relative',
		zIndex: 1003,
	},

	liveSearchDropdown: {
		position: 'absolute',
		top: 45,
		left: 0,
		right: 0,
		backgroundColor: '#f5f5f5',
		borderRadius: 8,
		maxHeight: 300,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		zIndex: 1004,
		overflow: 'hidden',
	},

	liveSection: {
		paddingTop: 8,
	},

	liveSectionTitle: {
		fontSize: 12,
		fontWeight: 'bold',
		color: '#888',
		paddingHorizontal: 12,
		marginBottom: 4,
		textTransform: 'uppercase',
	},

	liveItem: {
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},

	liveItemText: {
		fontSize: 14,
		color: '#333',
		fontWeight: '500',
	},

	seeAllButton: {
		padding: 12,
		backgroundColor: '#e9e9e9',
		alignItems: 'center',
	},

	seeAllText: {
		color: '#666',
		fontWeight: 'bold',
		fontSize: 14,
	},

	infoIcon: {
		color: '#ccc',
		fontSize: 18,
	},

	infoImage: {
		width: 45,
		height: 45,
	},

	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 8,
		paddingHorizontal: 10,
	},

	searchInput: {
		flex: 1,
		height: 40,
		fontSize: 14,
		color: '#333',
	},

	searchButton: {
		padding: 5,
	},

	searchIcon: {
		fontSize: 20,
	},

	searchImg: {
		width: 20,
		height: 20,
	},

	profileButton: {
		padding: 10,
		zIndex: 1001,
	},

	profileIcon: {
		fontSize: 30,
		color: '#fff',
	},

	dropdown: {
		position: 'absolute',
		top: 45,
		right: 0,
		backgroundColor: '#f5f5f5',
		borderRadius: 8,
		width: 220,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		zIndex: 1002,
	},

	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		gap: 10,
	},

	userAvatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#C6B3E8',
		justifyContent: 'center',
		alignItems: 'center',
	},

	userAvatarText: {
		fontSize: 30,
		color: '#fff',
	},

	username: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#333',
	},

	userEmail: {
		fontSize: 12,
		color: '#666',
	},

	divider: {
		height: 1,
		backgroundColor: '#ddd',
		marginVertical: 4,
	},

	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		gap: 10,
	},

	menuIcon: {
		fontSize: 18,
		width: 24,
	},

	menuText: {
		fontSize: 14,
		color: '#333',
		flex: 1,
		paddingBottom: 6.5,
	},

	toggle: {
		width: 40,
		height: 20,
		borderRadius: 10,
		backgroundColor: '#C6B3E8',
		padding: 2,
		justifyContent: 'center',

	},

	toggleThumb: {
		width: 16,
		height: 16,
		borderRadius: 8,
		backgroundColor: '#fff',
		alignSelf: 'flex-end',
	},

	overlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 999,
	},
});

export default HeaderWithSearch;
