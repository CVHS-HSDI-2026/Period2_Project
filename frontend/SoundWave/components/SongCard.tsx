import React, { FC } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ImageSourcePropType,
} from "react-native";

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

  // Popular
  rating?: number;
  commentsCount?: number;

  // New Releases
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
        <Image
          source={image}
          style={[styles.image, isPopular && styles.popularImage]}
        />
      ) : (
        <View
          style={[
            styles.image,
            styles.imageFallback,
            isPopular && styles.popularImage,
          ]}
        />
      )}

      {/* Info Row */}
      <View style={styles.infoRow}>
        {/* Left: Title + Artist */}
        <View style={styles.textBlock}>
          <Text
            style={[styles.title, isPopular && styles.popularText]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            style={[styles.artist, isPopular && styles.popularSubText]}
            numberOfLines={1}
          >
            {artist}
          </Text>
        </View>

        {/* Right: Meta */}
        {isPopular ? (
          <View style={styles.metaRight}>
            {rating !== undefined && (
              <Text style={styles.popularText}>{rating}/10</Text>
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
        ) : (
          releaseDate && (
            <Text style={styles.releaseDate}>{releaseDate}</Text>
          )
        )}
      </View>
    </Pressable>
  );
};

export default SongCard;

/* ---------- Styles ---------- */
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

  popularImage: {},

  imageFallback: {
    backgroundColor: "#E0E0E0",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 12,
  },

  textBlock: {
    flex: 1,
    paddingRight: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  artist: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },

  popularText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  popularSubText: {
    color: "#FFFFFF",
    opacity: 0.8,
    fontSize: 13,
    marginTop: 2,
  },

  metaRight: {
    alignItems: "flex-end",
    gap: 6,
  },

  commentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    maxWidth: 56, // prevents overflow
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
    color: "#555",
    fontWeight: "500",
  },
});
