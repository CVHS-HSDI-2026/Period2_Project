import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useFonts, Jost_400Regular } from "@expo-google-fonts/jost";

import thumbsUp from "../assets/thumbsUp.png";
import replyIcon from "../assets/reply.png";
import replypoint from "../assets/Vector4.png";

type Reply = {
  id: string;
  text: string;
  
};

type CommentType = {
  id: string;
  text: string;
  replies: Reply[];
};

export default function Commentsonly() {
  const [fontsLoaded] = useFonts({ Jost_400Regular });

  const [comments, setComments] = useState<CommentType[]>([
    {
      id: "1",
      text: "Wow this is so peak Kenshi really outdid himself...",
      replies: [],
    },
    {
      id: "2",
      text: "Ts so mid how did he even come up with this.",
      replies: [],
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* SAME content area as before but NO border */}
      <View style={styles.contentBox}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {comments.map((c) => (
            <View key={c.id}>
              <Comment
                text={c.text}
                onReply={(replyText) => {
                  setComments((prev) =>
                    prev.map((item) =>
                      item.id === c.id
                        ? {
                            ...item,
                            replies: [
                              ...item.replies,
                              {
                                id: Date.now().toString(),
                                text: replyText,
                              },
                            ],
                          }
                        : item
                    )
                  );
                }}
              />

              {c.replies.map((r) => (
                <View key={r.id} style={styles.replyIndent}>
                  <Comment text={r.text} isReply />
                </View>
              ))}
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity onPress={() => setShowCommentBox(!showCommentBox)}>
          <Text style={styles.addCommentText}>Add Comment</Text>
        </TouchableOpacity>

        {showCommentBox && (
          <View style={{ marginTop: 8 }}>
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Write a comment..."
              placeholderTextColor="#aaa"
              style={styles.input}
            />

            <TouchableOpacity
              onPress={() => {
                if (newComment.trim()) {
                  setComments((prev) => [
                    ...prev,
                    {
                      id: Date.now().toString(),
                      text: newComment,
                      replies: [],
                    },
                  ]);
                  setNewComment("");
                  setShowCommentBox(false);
                }
              }}
            >
              <Text style={styles.addCommentText}>Post Comment</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

/* Individual comment row */
function Comment({
  text,
  onReply,
  isReply = false,
}: {
  text: string;
  onReply?: (text: string) => void;
  isReply?: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  return (
    <View style={{ marginBottom: 14 }}>
      <View style={styles.commentRow}>
        {isReply && (
          <Image source={replypoint} style={styles.replyVector} />
        )}

        <View style={styles.avatar} />

        <Text style={styles.commentText}>{text}</Text>

        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => setLiked(!liked)}>
            <Image
              source={thumbsUp}
              style={[styles.iconImage, liked && styles.isliked]}
            />
          </TouchableOpacity>

          {!isReply && (
            <TouchableOpacity onPress={() => setReplyOpen(!replyOpen)}>
              <Image source={replyIcon} style={styles.iconImage} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {replyOpen && (
        <View style={styles.replyBox}>
          <TextInput
            value={replyText}
            onChangeText={setReplyText}
            placeholder="Write a reply..."
            placeholderTextColor="#aaa"
            style={styles.replyInput}
          />

          <TouchableOpacity
            onPress={() => {
              if (replyText.trim() && onReply) {
                onReply(replyText);
                setReplyText("");
                setReplyOpen(false);
              }
            }}
          >
            <Text style={styles.postReply}>Post Reply</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 0,
    alignSelf: "center",
  },

  /* SAME as before but NO border */
  contentBox: {
    backgroundColor: "#1E2345",
    borderRadius: 6,
    padding: 16,
    maxHeight: 350,
  },

  commentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#3A3F6B",
    marginRight: 12,
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

  isliked: {
    tintColor: "#1e00ff",
  },

  replyIndent: {
    marginLeft: 8,
  },

  replyBox: {
    marginLeft: 38,
    marginTop: 6,
    width: "90%",
  },

  replyInput: {
    backgroundColor: "#2A2F5A",
    padding: 8,
    borderRadius: 6,
    color: "white",
  },

  postReply: {
    color: "#9AA2D6",
    marginTop: 4,
  },

  replyVector: {
    width: 14,
    height: 14,
    marginRight: 6,
    tintColor: "#9AA2D6",
    alignSelf: "center",
  },

  input: {
    backgroundColor: "#2A2F5A",
    padding: 10,
    borderRadius: 6,
    color: "white",
  },

  addCommentText: {
    color: "#9AA2D6",
    marginTop: 10,
    fontFamily: "Jost_400Regular",
  },
});