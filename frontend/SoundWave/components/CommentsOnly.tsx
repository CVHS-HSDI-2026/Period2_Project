import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator} from "react-native";
import {useFonts, Jost_400Regular} from "@expo-google-fonts/jost";
import {FontAwesome} from "@expo/vector-icons";
import {router} from "expo-router";
import {fetchSongReviews, postReview} from "@/services/api";
import {CommentType, Reply} from "@/services/records";

const replyIcon = require("../assets/reply.png");
const replypoint = require("../assets/Vector4.png");
const send = require("../assets/send.png");
const upArrow = require("../assets/up-arrow.png");
const downArrow = require("../assets/down-arrow.png");
const plus = require("../assets/plus.png");

export default function CommentsOnly({songId}: { songId: number }) {
	const [fontsLoaded] = useFonts({Jost_400Regular});
	const [comments, setComments] = useState<any[]>([]);
	const [newComment, setNewComment] = useState("");
	const [rating, setRating] = useState<number>(10);
	const [showCommentBox, setShowCommentBox] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadReviews = async () => {
			if (!songId) {
				setLoading(false);
				return;
			}
			try {
				const data = await fetchSongReviews(songId);
				setComments(data || []);
			} catch (error) {
				console.error("Error loading reviews:", error);
			} finally {
				setLoading(false);
			}
		};
		loadReviews();
	}, [songId]);

	const handlePostComment = async () => {
		if (!newComment.trim()) return;
		try {
			await postReview(songId, newComment, rating);

			setComments((prev) => [
				...prev,
				{id: Date.now(), review_text: newComment, username: "You", rating: rating, replies: []},
			]);
			setNewComment("");
			setRating(10);
			setShowCommentBox(false);
		} catch (e) {
			alert("You must be logged in to post a comment!");
		}
	};

	if (!fontsLoaded) return null;

	return (
		<View style={styles.container}>
			<View style={styles.contentBox}>
				{loading ? (
					<ActivityIndicator size="small" color="#C6B3E8"/>
				) : (
					<ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}
								contentContainerStyle={{paddingBottom: 20}}>
						{comments.length > 0 ? (
							comments.map((c, index) => (
								<Comment key={c.id || index} text={c.review_text} username={c.username}/>
							))
						) : (
							<Text style={styles.addCommentText}>No comments yet. Be the first!</Text>
						)}
					</ScrollView>
				)}

				<TouchableOpacity onPress={() => setShowCommentBox(!showCommentBox)}>
					<View style={styles.userRow}>
						<Image source={plus} style={styles.plusIcon}/>
						<Text style={styles.addCommentText}>Add Comment</Text>
					</View>
				</TouchableOpacity>

				{showCommentBox && (
					<View style={{marginTop: 8}}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
							<Text style={{ color: '#FFF' }}>Rating: {rating}/10</Text>
							<View style={{ flexDirection: 'row', gap: 5 }}>
								{[...Array(10)].map((_, i) => (
									<TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
										<FontAwesome name={rating >= i + 1 ? "star" : "star-o"} size={20} color="#ff3b3b" />
									</TouchableOpacity>
								))}
							</View>
						</View>

						<View style={styles.inputWrapper}>
							<TextInput
								value={newComment}
								onChangeText={setNewComment}
								placeholder="Write a comment..."
								placeholderTextColor="#aaa"
								style={styles.input}
							/>
							<TouchableOpacity style={styles.sendButton2} onPress={handlePostComment}>
								<Image source={send} style={styles.sendIcon}/>
							</TouchableOpacity>
						</View>
					</View>
				)}
			</View>
		</View>
	);
}

/* ---------- Individual comment ---------- */

function Comment({
					 text,
					 username,
					 replies = [],
					 onReply,
					 isReply = false,
				 }: {
	text: string;
	username: string;
	replies?: Reply[];
	onReply?: (text: string) => void;
	isReply?: boolean;
}) {
	const [liked, setLiked] = useState(false);
	const [replyOpen, setReplyOpen] = useState(false);
	const [replyText, setReplyText] = useState("");
	const [showReplies, setShowReplies] = useState(false);

	return (
		<View style={{marginBottom: 3}}>
			<TouchableOpacity onPress={() => router.push("/Artist")}>
				<View style={styles.userRow}>
					<View style={styles.avatar}/>
					<Text style={styles.usernameText}>Username</Text>
				</View>
			</TouchableOpacity>
			<View style={styles.commentRow}>
				<Text style={styles.commentText}>{text}</Text>
				<View style={styles.iconRow}>
					<TouchableOpacity onPress={() => setLiked(!liked)}>
						<FontAwesome
							name={liked ? "thumbs-up" : "thumbs-o-up"}
							size={18}
							color="#FFFFFF"
						/>
					</TouchableOpacity>
					{!isReply && (
						<TouchableOpacity onPress={() => setReplyOpen(!replyOpen)}>
							<Image source={replyIcon} style={styles.iconImage}/>
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* Toggle replies */}
			{!isReply && replies.length > 0 && (
				<TouchableOpacity
					style={styles.replyToggle}
					onPress={() => setShowReplies(!showReplies)}
				>
					<View style={styles.replyToggleRow}>
						<Text style={styles.replyToggleText}>
							{showReplies
								? `Hide ${replies.length} repl${replies.length > 1 ? "ies" : "y"}`
								: `View ${replies.length} repl${replies.length > 1 ? "ies" : "y"}`}
						</Text>
						<Image
							source={showReplies ? upArrow : downArrow}
							style={styles.arrowIcon}
						/>
					</View>
				</TouchableOpacity>
			)}

			{/* Replies */}
			{showReplies &&
				replies.map((r) => (
					<View key={r.id} style={styles.replyIndent}>
						<Comment text={r.text} username={r.username} isReply/>
					</View>
				))}

			{replyOpen && (
				<View style={styles.replyBox}>
					<View style={styles.inputWrapper}>
						<TextInput
							value={replyText}
							onChangeText={setReplyText}
							placeholder="Write a reply..."
							placeholderTextColor="#aaa"
							style={styles.replyInput}
						/>
						<TouchableOpacity
							style={styles.sendButton}
							onPress={() => {
								if (replyText.trim() && onReply) {
									onReply(replyText);
									setReplyText("");
									setReplyOpen(false);
								}
							}}
						>
							<Image source={send} style={styles.sendIcon}/>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</View>
	);
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
	container: {
		width: "100%",
		alignSelf: "center",
	},


	contentBox: {
		backgroundColor: "#14172B",
		borderRadius: 6,
		padding: 16,
		maxHeight: 350,
	},
	commentRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
		marginLeft: 42
	},
	avatar: {
		width: 26,
		height: 26,
		borderRadius: 13,
		backgroundColor: "#3A3F6B",
		marginRight: 10,
	},
	plusIcon: {
		width: 12,
		height: 12,
		marginRight: 10,
		marginTop: 6,
	},
	addCommentAvatar: {
		width: 20,
		height: 20,
		borderRadius: 13,
		backgroundColor: "#3A3F6B",
		marginRight: 10,
	},
	usernameText: {
		color: "#9AA2D6",
		fontSize: 14,
		fontFamily: "Jost_400Regular",
		marginBottom: 4,
	},
	userRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		marginBottom: 4,
	},
	commentText: {
		flex: 1,
		color: "#E6E8F2",
		fontSize: 20,
		fontFamily: "Jost_400Regular",
		marginRight: 10,
	},
	iconRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	iconImage: {
		width: 16,
		height: 16,
		tintColor: "#ffffff",
	},
	replyIndent: {
		marginLeft: 38,
	},
	replyBox: {
		marginLeft: 38,
		marginTop: 10,
		width: "90%",
	},
	replyVector: {
		width: 14,
		height: 14,
		marginRight: 6,
		tintColor: "#9AA2D6",
	},

	inputWrapper: {
		position: "relative",
		justifyContent: "center",
	},
	replyInput: {
		backgroundColor: "#2A2F5A",
		padding: 10,
		paddingRight: 40,
		borderRadius: 6,
		color: "white",
		marginBottom: 10,
	},
	input: {
		backgroundColor: "#2A2F5A",
		padding: 10,
		paddingRight: 40,
		borderRadius: 6,
		color: "white",
	},
	sendButton: {
		position: "absolute",
		right: 10,
		top: "50%",
		transform: [{translateY: -14}],
	},
	sendButton2: {
		position: "absolute",
		right: 10,
		top: "50%",
		transform: [{translateY: -8}],
	},
	sendIcon: {
		width: 18,
		height: 18,
		tintColor: "#9AA2D6",
	},
	replyToggle: {
		marginLeft: 38,
		marginBottom: 6,
	},
	replyToggleText: {
		color: "#9AA2D6",
		fontSize: 14,
		marginLeft: 5,
		fontFamily: "Jost_400Regular",
	},
	addCommentText: {
		color: "#9AA2D6",
		marginTop: 10,
		fontFamily: "Jost_400Regular",
	},
	replyToggleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	arrowIcon: {
		width: 12,
		height: 12,
		tintColor: "#9AA2D6",
	},
});