import React, { FC } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ImageSourcePropType,
} from "react-native";

interface SongCardProps {
  title: string;
  artist: string;
  rating?: number;
  image?: ImageSourcePropType;
  onPress?: () => void;
}

const SongCard: FC<SongCardProps> = ({
  title,
  artist,
  rating,
  image,
  onPress,
}) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Album Art (safe) */}
      {image ? (
        <Image source={image} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imageFallback]} />
      )}

      {/* Metadata */}
      <View style={styles.infoRow}>
        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {artist}
          </Text>
        </View>

        {rating !== undefined && (
          <Text style={styles.rating}>{rating}/10</Text>
        )}
      </View>
    </Pressable>
  );
};

export default SongCard;

const styles = StyleSheet.create({
  card: {
    width: 220,        // ↓ was 220
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: 220,       // ↓ was 180
    borderRadius: 8,
  },
  imageFallback: {
    backgroundColor: "#E0E0E0",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 6,
  },
  textBlock: {
    flexShrink: 1,
  },
  title: {
    fontSize: 16,      // ↓ was 18
    fontWeight: "600",
  },
  artist: {
    fontSize: 13,      // ↓ was 14
    color: "#555",
    marginTop: 2,
  },
  rating: {
    fontSize: 14,      // ↓ was 16
    fontWeight: "500",
  },
});
