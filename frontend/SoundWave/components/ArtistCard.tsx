import React, {FC} from "react";
import {View, Text, Image, StyleSheet, Pressable, ImageSourcePropType,} from "react-native";

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

const getInitials = (name: string) => {
	if (!name) return "";
	return name
		.split(" ")
		.map((word) => word.charAt(0))
		.join("")
		.toUpperCase()
		.substring(0, 3);
};

export const stringToColor = (str: string) => {
	if (!str) return "#3A3F6B";
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	let color = '#';
	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xFF;
		const mutedValue = Math.floor(value * 0.7);
		color += ('00' + mutedValue.toString(16)).substring(-2);
	}
	return color;
};

/* ---------- Component ---------- */
const ArtistCard: FC<ArtistCardProps> = ({
											 title,
											 artist,
											 image,
											 onPress,
											 variant = "new",
										 }) => {
	const isPopular = variant === "popular";

	return (
		<Pressable
			onPress={onPress}
			style={[styles.card, isPopular && styles.popularCard]}
		>
			{image ? (
				<Image source={image} style={styles.image}/>
			) : (
				<View style={[styles.image, styles.imageFallback, { backgroundColor: stringToColor(title) }]}>
					<Text style={styles.initialsText}>{getInitials(title)}</Text>
				</View>
			)}

			<View style={styles.infoRow}>
				<View style={styles.textBlock}>
					<Text style={styles.title} numberOfLines={1}>
						{title}
					</Text>
					<Text style={styles.artist} numberOfLines={1}>
						{artist}
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
		width: 200,
		height: 200,
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center",
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

	initialsText: {
		color: "#FFFFFF",
		fontSize: 48,
		fontWeight: "bold",
		letterSpacing: 2,
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
