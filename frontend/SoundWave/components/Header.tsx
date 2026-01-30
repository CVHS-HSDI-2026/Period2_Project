import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
  title: string;
}

const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{title}</Text>
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
