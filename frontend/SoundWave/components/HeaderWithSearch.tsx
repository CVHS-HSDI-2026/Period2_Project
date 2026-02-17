import { router } from 'expo-router/build/exports';
import React, { FC, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';

interface HeaderProps {
  title: string;
}

const HeaderWithSearch: FC<HeaderProps> = ({ title }) => {
  const [searchText, setSearchText] = useState<string>('');
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  const handleLogoPress = () => {
    console.log('Logo pressed!');
    router.push("/Homepage");
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
    setIsDropdownVisible(false);
  };

  const handleDarkModePress = () => {
    console.log('Dark Mode pressed');
  };

  const handleLogoutPress = () => {
    console.log('Logout pressed');
    setIsDropdownVisible(false);
  
  };

  return (
    <View style={styles.headerContainer}>
      
      <View style={styles.logoContainer}>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleLogoPress}

        ><Text style={styles.logoText}>{title}</Text></TouchableOpacity>
        <Text style={styles.infoIcon}>ⓘ</Text>
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
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Profile button with dropdown */}
      <View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={handleProfilePress}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>

        {/* Dropdown Menu */}
        {isDropdownVisible && (
          <View style={styles.dropdown}>
            {/* User info section */}
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>👤</Text>
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
              <Text style={styles.menuIcon}>👤</Text>
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleSettingsPress}
            >
              <Text style={styles.menuIcon}>⚙️</Text>
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleDarkModePress}
            >
              <Text style={styles.menuIcon}>🌙</Text>
              <Text style={styles.menuText}>Dark Mode</Text>
              <View style={styles.toggle}>
                <View style={styles.toggleThumb} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleLogoutPress}
            >
              <Text style={styles.menuIcon}>🚪</Text>
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
    backgroundColor: '#304792ff',
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

  infoIcon: {
    color: '#ccc',
    fontSize: 18,
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

  profileButton: {
    padding: 5,
    zIndex: 1001,
  },

  profileIcon: {
    fontSize: 24,
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
    backgroundColor: '#304792ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  userAvatarText: {
    fontSize: 20,
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
  },

  toggle: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#304792ff',
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
