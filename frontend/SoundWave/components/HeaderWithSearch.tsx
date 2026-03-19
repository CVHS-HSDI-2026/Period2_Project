import {Platform} from 'react-native';
import {router} from 'expo-router';
import React, {FC, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Image} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchSearchResults } from '@/services/api';

interface HeaderProps {
    title: string;
}

const HeaderWithSearch: FC<HeaderProps> = ({title}) => {
    const [searchText, setSearchText] = useState<string>('');
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

    const handleLogoPress = () => {
        console.log('Logo pressed!');
        router.push("/");
    }

    const handleSearchPress = () => {
        if (searchText.trim()) {
            router.push({pathname: "/Search", params: {q: searchText}});
        }
        fetchSearchResults(searchText)
    };

    const handleProfilePress = () => {
        console.log('Profile icon pressed!');
        setIsDropdownVisible(!isDropdownVisible);
    };

    const handleCloseDropdown = () => {
        setIsDropdownVisible(false);
    };

    const handleSearchChange = (text: string) => {
        setSearchText(text);
        console.log('User typing:', text);
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
            {isDropdownVisible && (
                <TouchableWithoutFeedback onPress={handleCloseDropdown}>
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
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        value={searchText}
                        onChangeText={handleSearchChange}
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={handleSearchPress}

                    >
                        <Image
                            source={require('../assets/Search.png')}
                            style={styles.searchImg}
                            resizeMode="contain"
                        />
                        {/* <Text style={styles.searchIcon}>🔍︎</Text> */}
                    </TouchableOpacity>
                </View>

                {/* Profile button with dropdown */}
                <View>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={handleProfilePress}
                    >
                        <Text style={styles.profileIcon}>
                            <MaterialIcons name="person" size={24} color="#1f1f1f" />
                        </Text>
                    </TouchableOpacity>

                    {/* Dropdown Menu */}
                    {isDropdownVisible && (
                        <View style={styles.dropdown}>
                            {/* User info section */}
                            <View style={styles.userInfo}>
                                <View style={styles.userAvatar}>
                                    <Text style={styles.userAvatarText}>
                                        <MaterialIcons name="person" size={24} color="#1f1f1f" />
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
                                    <MaterialIcons name="person" size={24} color="#1f1f1f" />
                                </Text>
                                <Text style={styles.menuText}>Profile</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={handleSettingsPress}
                            >
                                <Text style={styles.menuIcon}>
                                    <MaterialIcons name="settings" size={24} color="#1f1f1f" />
                                </Text>
                                <Text style={styles.menuText}>Settings</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={handleLogoutPress}
                            >
                                <Text style={styles.menuIcon}>
                                    <MaterialIcons name="logout" size={24} color="#1f1f1f" />
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
        flex: 1,
        marginLeft: "2%",
        marginRight: "1%",
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
