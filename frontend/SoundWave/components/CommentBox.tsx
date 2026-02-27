import SongCard from "../components/SongCard";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native";
import { useFonts, Jost_400Regular } from "@expo-google-fonts/jost";
import { Image } from 'react-native';
import thumbsUp from "../assets/thumbsUp.png";
import replyIcon from "../assets/reply.png";
import RecommendedBox from "../components/RecomendedBox";
import replypoint from "../assets/Vector4.png"; // needs to be placed b4 the profile in reply indent \\
import { router, useRouter } from 'expo-router';
//Idk why they render as errors yet still render on the page
type Tab = "comments" | "recommended";

  type Reply = {
    id: string;
    text: string;
  };

  type CommentType = {
    id: string;
    text: string;
    replies: Reply[];
  };

  export default function CommentBox() {
  const [activeTab, setActiveTab] = useState<Tab>("comments");
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

    {/* Tabs */}
    <View style={styles.tabRow}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "comments" && styles.activeTab]}
        onPress={() => setActiveTab("comments")}
      >
        <Text style={[styles.tabText, activeTab === "comments" && styles.activeTabText]}>
          Comments
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "recommended" && styles.activeTab]}
        onPress={() => setActiveTab("recommended")}
      >
        <Text style={[styles.tabText, activeTab === "recommended" && styles.activeTabText]}>
          Recommended
        </Text>
      </TouchableOpacity>
    </View>

    {/* Content box shared by both tabs */}
    <View style={styles.contentBox}>
      {activeTab === "comments" ? (
        <>
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
            <Text style={{ color: "#9AA2D6", marginTop: 10 }}>
              Add Comment
            </Text>
          </TouchableOpacity>

          {showCommentBox && (
            <View style={{ marginTop: 8 }}>
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Write a comment..."
                placeholderTextColor="#aaa"
                style={{
                  backgroundColor: "#2A2F5A",
                  padding: 10,
                  borderRadius: 6,
                  color: "white",
                }}
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
                <Text style={{ color: "#9AA2D6", marginTop: 4 }}>
                  Post Comment
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <>
          <RecommendedBox />
          
        </>
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
      {/* top row */}
      <View style={styles.commentRow}>
  {/* Reply connector icon */}
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
      

      {/* reply input BELOW the row */}
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
    width: "90%",
    marginTop: 20,
    alignSelf: "center",
  },

  tabRow: {
    flexDirection: 'row',
  },

tab: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  backgroundColor: '#161B36',
  borderTopLeftRadius: 6,
  borderTopRightRadius: 6,
  marginRight: 6,
  borderWidth: 1,
  borderColor: '#FFFFFF',
  borderBottomWidth: 0,   
  zIndex: 2,              
},

activeTab: {
  backgroundColor: '#1E2345',
},

contentBox: {
  backgroundColor: '#1E2345',
  borderRadius: 6,
  padding: 16,
  maxHeight: 350,
  borderWidth: 1,
  borderColor: '#FFFFFF',
  marginTop: -1,          
},

  tabText: {
    fontSize: 16,
    color: '#9AA2D6',
    fontFamily: 'Jost_400Regular',
  },

  activeTabText: {
    color: '#FFFFFF',
  },

  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#3A3F6B',
    marginRight: 12,
  },

  commentText: {
    flex: 1,
    color: '#E6E8F2',
    fontSize: 20,
    fontFamily: 'Jost_400Regular',
    marginRight: 10,
  },

  icon: {
    color: '#9AA2D6',
    marginLeft: 10,
    fontSize: 14,
  },

  replyIndent: {
    marginLeft: 8,
  },

  emptyText: {
    color: '#9AA2D6',
    fontFamily: 'Jost_400Regular',
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
  width: 16,
  height: 16,
  tintColor: "#1e00ff", 
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
});

