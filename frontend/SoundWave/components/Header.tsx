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
    backgroundColor: '#D2D5EF',
    padding: 10,
    width: '100%',
    
  },
  headerText: {
    color: '#000000',
    fontSize: 60,
    fontWeight: 'bold',
  },
});

export default Header;
