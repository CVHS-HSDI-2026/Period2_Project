import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PpictureProps {
  imageUrl: string;
}

const Ppicture: FC<PpictureProps> = ({ imageUrl }) => {
  return (
    <View style={styles.container}>
      <img src={imageUrl} style={styles.image} alt="Profile" />
    </View>
  );
}

const styles = StyleSheet.create({
    container : {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
});

export default Ppicture;