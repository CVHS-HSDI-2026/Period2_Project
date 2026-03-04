import React, { FC } from "react";
import {View, Text, Image, StyleSheet, Pressable, ImageSourcePropType,} from "react-native";
import { useRouter } from "expo-router";
/* ---------- Helpers ---------- */
const formatCount = (count: number) => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}m`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return `${count}`;
};

/* ---------- Types ---------- */
interface ArtistCardProps {
  title: string;
  artist: string;
  image?: ImageSourcePropType;
  onPress?: () => void;

  variant?: "popular" | "new";

  rating?: number;
  commentsCount?: number;
  releaseDate?: string;
}

/* ---------- Component ---------- */
const ArtistCard: FC<ArtistCardProps> = ({
  title,
  artist,
  image,
  onPress,
  variant = "new",
  rating,
  commentsCount,
  releaseDate,
}) => {
  const isPopular = variant === "popular";

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, isPopular && styles.popularCard]}
    >
      {/* Album Art */}
      {image ? (
        <Image source={image} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imageFallback]} />
      )}
      <View style={styles.infoRow}>
        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={1}>
          {title}
          </Text>
      </View>
      </View>
    </Pressable>
  );
};

export default ArtistCard;

const styles = StyleSheet.create({
  card: {
    width: 220,
  },

  popularCard: {
    backgroundColor: "#14172B",
    padding: 12,
  },

  image: {
    width: "100%",
    height: 200,
  },

  imageFallback: {
    backgroundColor: "#E0E0E0",
    width: 200,
    height: 200,
    borderRadius: 100,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  textBlock: {
    flex: 1,
    paddingRight: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
    username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  artist: {
    fontSize: 13,
    marginTop: 2,
    color: "#FFFFFF",
  },

  metaRight: {
    alignItems: "flex-end",
    gap: 6,
  },

  metaText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  commentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    maxWidth: 56,
  },

  commentIcon: {
    fontSize: 13,
    color: "#FFFFFF",
  },

  commentCount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  releaseDate: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
