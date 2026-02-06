import React, { FC, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';


interface HeaderProps {
  title: string;
}

const HeaderWithSearch: FC<HeaderProps> = ({ title }) => {
  const [searchText, setSearchText] = useState<string>('');
  const handleSearchPress = () => {
    console.log('Search pressed! Query:', searchText);
  };

  const handleProfilePress = () => {
    console.log('Profile icon pressed!');
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    console.log('User typing:', text);
  };

  return (
    <View style={styles.headerContainer}>
      
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>{title}</Text>
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

      <TouchableOpacity 
        style={styles.profileButton}
        onPress={handleProfilePress}
      >
        <Text style={styles.profileIcon}>👤</Text>
      </TouchableOpacity>
      
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

  profileIcon: {
    fontSize: 24,
    color: '#fff',
  },

  profileButton: {
    padding: 5,
  },
});

export default HeaderWithSearch;

