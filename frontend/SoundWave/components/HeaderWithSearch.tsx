import { router } from 'expo-router';
import React, { FC, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Image } from 'react-native';
import { Image } from 'react-native';

interface HeaderProps {
  title: string;
}

const HeaderWithSearch: FC<HeaderProps> = ({ title }) => {
  const [searchText, setSearchText] = useState<string>('');
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  const handleLogoPress = () => {
    console.log('Logo pressed!');
    router.push("/");
  }
  const handleSearchPress = () => {
    console.log('Search pressed! Query:', searchText);
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
    router.push('/Settings');
    setIsDropdownVisible(false);
  };

  const handleDarkModePress = () => {
    console.log('Dark Mode pressed');
  };

  const handleLogoutPress = () => {
    console.log('Logout pressed');
    router.push("/Login");
    setIsDropdownVisible(false);
  
  };

  return (
    <View style={styles.headerContainer}>
      
      <View style={styles.logoContainer}>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleLogoPress}>
          <Image
            source= {require('../assets/web-name.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Image
          source= {require('../assets/logo.png')}
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
          source= {require('../assets/Search.png')}
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
          <Text style={styles.profileIcon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg></Text>
          <Text style={styles.profileIcon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg></Text>
        </TouchableOpacity>

        {/* Dropdown Menu */}
        {isDropdownVisible && (
          <View style={styles.dropdown}>
            {/* User info section */}
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg></Text>
                <Text style={styles.userAvatarText}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg></Text>
              </View>
              <View>
                <Text style={styles.username}>Username</Text>
                <Text style={styles.userEmail}>dummy@yy.zxed</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Menu items */}
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleProfileMenuPress}
            >
              <Text style={styles.menuIcon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg></Text>
              <Text style={styles.menuIcon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg></Text>
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleSettingsPress}
            >
              <Text style={styles.menuIcon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg></Text>
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleDarkModePress}
            >
              <Text style={styles.menuIcon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg></Text>
              <Text style={styles.menuIcon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg></Text>
              <Text style={styles.menuText}>Dark Mode</Text>
              <View style={styles.toggle}>
                <View style={styles.toggleThumb} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleLogoutPress}
            >
              <Text style={styles.menuIcon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg></Text>
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownVisible && (
        <TouchableWithoutFeedback onPress={handleCloseDropdown}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      
    </View>
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
    gap: 8
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
    marginLeft: 3,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 15,
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
    padding: 3,
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
    shadowOffset: { width: 0, height: 2 },
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