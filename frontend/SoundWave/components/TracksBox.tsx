import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";
import {Album, Track} from "@/services/records";

const formatTime = (ms: number) => {
	if (!ms) return "--:--";
	const minutes = Math.floor(ms / 60000);
	const seconds = ((ms % 60000) / 1000).toFixed(0);
	return minutes + ":" + (parseInt(seconds) < 10 ? "0" : "") + seconds;
};

export default function TracksBox({album}: { album: Album }) {
	const router = useRouter();
	const tracks = album?.tracks || [];

	return (
		<View style={styles.container}>
			{tracks.length === 0 ? (
				<Text style={styles.emptyText}>Tracks unavailable.</Text>
			) : (
				tracks.map((track: Track, index: number) => (
					<View key={track.mbid || index} style={styles.trackRow}>
						<TouchableOpacity
							style={styles.titleCol}
							onPress={() => router.push({pathname: "/Song", params: {mbid: track.mbid}})}
						>
							<Text style={styles.commentText} numberOfLines={1}>
								{track.number}. {track.title}
							</Text>
						</TouchableOpacity>

						<View style={styles.timeCol}>
							<Text style={styles.commentText}>{formatTime(track.duration)}</Text>
						</View>

						<View style={styles.ratingCol}>
							<Text style={styles.commentText}>--/10</Text>
						</View>
					</View>
				))
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	trackRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	titleCol: {
		flex: 0.7,
		paddingLeft: 10,
	},
	timeCol: {
		flex: 0.15,
		alignItems: "center",
	},
	ratingCol: {
		flex: 0.15,
		alignItems: "flex-end",
		paddingRight: 10,
	},
	commentText: {
		color: "#E6E8F2",
		fontSize: 18,
		fontFamily: "Jost_400Regular",
	},
	emptyText: {
		color: "#9AA2D6",
		fontFamily: "Jost_400Regular",
		textAlign: "center",
		marginTop: 10,
	},
});