import { router } from "expo-router/build/exports";
import React, { FC } from "react";
import {View, Text, Image, StyleSheet, Pressable, ImageSourcePropType, TouchableOpacity,} from "react-native";

/* ---------- Helpers ---------- */
const formatCount = (count: number) => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}m`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return `${count}`;
};

/* ---------- Types ---------- */
interface SongCardProps {
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
const SongCard: FC<SongCardProps> = ({
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

      {/* Info Row */}
      <View style={styles.infoRow}>
        {/* Left */}
        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            <TouchableOpacity onPress={() => router.push("Artist")}>
                        <Text style={styles.artist}>{artist}</Text>
            </TouchableOpacity>
            {}
          </Text>
        </View>

        {/* Right */}
        <View style={styles.metaRight}>
          {rating !== undefined && (
            <Text style={styles.metaText}>{rating}/10</Text>
          )}

          {commentsCount !== undefined && (
            <View style={styles.commentBadge}>
              <Text style={styles.commentIcon}>💬</Text>
              <Text style={styles.commentCount}>
                {formatCount(commentsCount)}
              </Text>
            </View>
          )}

        </View>
      </View>
      {!isPopular && releaseDate && (
        <Text style={styles.releaseDate}>{releaseDate}</Text>
      )}
    </Pressable>
  );
};

export default SongCard;

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  card: {
    width: 220,
    position: "relative",
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
    position: "absolute",
    bottom: 8,
    right: 8,
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
