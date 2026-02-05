import React, { FC } from 'react';
import { View, Text, TextInput, TouhableOpacity, StyleSheet } from 'react-native';


interface HeaderProps {
  title: string;
}

const Header: FC<HeaderProps> = ({ title }) => {
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
      <Text style={styles.headerText}>{title}</Text>
    </View>
    <View style = {styles.logoContainer}
    <Text style = {styles.logoText}>{title}</Text>
    <Text style = {styles.infoIcon}>ⓘ</Text>
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
    
  },
  headerText: {
    color: '#fff',
    fontSize: 60,
    fontWeight: 'bold',
  },
});

export default Header;

