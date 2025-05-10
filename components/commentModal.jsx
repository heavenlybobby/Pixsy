import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants";
import { AuthContext } from "@/context/AuthContext";
import { Image } from "expo-image";

const CommentModal = ({ post, onClose, onUpdateComments }) => {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const { user } = useContext(AuthContext);

  const submitComment = async () => {
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(
        `http://192.168.56.1:3000/feed/${post._id}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          },
          body: JSON.stringify({ comment }),
        }
      );

      const data = await res.json();
      setComments(data.comments); // Assuming server returns updated comments
      onUpdateComments(post._id, data.comments); // update feed state
      setComment("");
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.modal}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Comments</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={30} color={colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* Comments List */}
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Image
              source={
                item.user.profilePictureUrl
                  ? { uri: item.user.profilePictureUrl }
                  : require("@/assets/images/defaultprofile.png")
              }
              style={styles.commentAvatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.commentUser}>{item.user.username}</Text>
              <Text style={styles.commentText}>{item.comment}</Text>
            </View>
          </View>
        )}
      />

      {/* Comment Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity onPress={submitComment} disabled={submitting}>
          <Ionicons
            name="send"
            size={30}
            color={submitting ? "gray" : colors.PRIMARY}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_LIGHT,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.PRIMARY,
  },
  commentUser: {
    fontWeight: "bold",
    fontSize: 20,
    color: colors.PRIMARY,
  },
  commentText: {
    fontSize: 18,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    gap: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.5)",
  },
  commentAvatar: {
    width: 45,
    height: 45,
    borderRadius: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginRight: 10,
    fontSize: 18,
  },
});

export default CommentModal;
