import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface Song {
  title: string;
  artist: string;
  album: string;
  rating: string;
  genre: string;
  duration: string;
  date: string;
  cover: string;
}

const SongDetails: React.FC = () => {
  const song: Song = {
    title: "IRIS OUT",
    artist: "Kenshi Yonezu",
    album: "IRIS OUT",
    rating: "8.5/10",
    genre: "J-pop",
    duration: "2:31",
    date: "9/15/25",
    cover: "https://picsum.photos/300" 
  };

  return (
    
    <View style={styles.outerContainer}>
      <View style={styles.contentRow}>
        {/* Left Side: Album Cover */}
        <Image source={{ uri: song.cover }} style={styles.cover} />

        {/* Right Side: Two-Column Data Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.column}>
            <Text style={styles.text}><Text style={styles.label}>Title: </Text>{song.title}</Text>
            <Text style={styles.text}><Text style={styles.label}>Artist: </Text>{song.artist}</Text>
            <Text style={styles.text}><Text style={styles.label}>Album: </Text>{song.album}</Text>
            <Text style={styles.text}><Text style={styles.label}>Date: </Text>{song.date}</Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.text}><Text style={styles.label}>Rating: </Text>{song.rating}</Text>
            <Text style={styles.text}><Text style={styles.label}>Min streamed: </Text>unknown</Text>
            <Text style={styles.text}><Text style={styles.label}>Genre: </Text>{song.genre}</Text>
            <Text style={styles.text}><Text style={styles.label}>Duration: </Text>{song.duration}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    padding: 20,
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cover: {
    width: 180,
    height: 180,
    borderRadius: 4, // More square like the mockup
    marginRight: 25,
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
  },
  column: {
    flex: 1,
    gap: 12, // Consistent spacing between rows
  },
  label: {
    fontWeight: '400',
    color: '#000',
  },
  text: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Jost_400Regular',
  },
});

export default SongDetails;
