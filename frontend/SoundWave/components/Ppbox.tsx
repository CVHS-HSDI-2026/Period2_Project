//This is the profile picutre boxes ie: for things like top artists, or reccomended users
import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
interface PpboxProps {
  title: string;
}

const Ppbox: FC<PpboxProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container : {
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 150,
        backgroundColor: '#d3d3d3',
        borderRadius: 10,
        margin: 10,
    },
    title: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Ppbox;