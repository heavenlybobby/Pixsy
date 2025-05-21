import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";

import { AuthContext } from "@/context/AuthContext";
import { Redirect, router } from "expo-router";
import { Image } from "expo-image";
import { colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import CommentModal from "@/components/commentModal";
import Posts from "../../components/posts";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      const loadPost = async () => {
        try {
          const res = await fetch("http://192.168.56.1:3000/feed", {
            method: "GET",
            headers: {
              Authorization: "Bearer " + user.token,
            },
          });
          const data = await res.json();
          if (res.status === 401) {
            console.log(data.message);
            handleLogout();
          }
          setPosts(data);
          console.log(data);
        } catch (error) {
          console.error("Error loading posts:", error);
        }
      };

      loadPost();
      setLoading(false);
    }, [])
  );

  const toggleLikePost = async (postId) => {
    try {
      const res = await fetch(`http://192.168.56.1:3000/feed/${postId}/like`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + user.token,
        },
      });

      const data = await res.json();

      console.log(data.message);

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            const isLiked = post.likes.includes(user._id);
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter((id) => id !== user._id)
                : [...post.likes, user._id],
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const updatePostComments = (postId, updatedComments) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, comments: updatedComments } : post
      )
    );
  };

  if (loading) return <ActivityIndicator size={"large"} />;

  if (showComments && selectedPost) {
    return (
      <CommentModal
        post={selectedPost}
        onClose={() => {
          setShowComments(false);
          setSelectedPost(null);
        }}
        onUpdateComments={updatePostComments}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleText}>Pixsy</Text>
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={40} color={colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      <Posts posts={posts} user={user} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BACKGROUND_LIGHT,
    flex: 1,
    gap: 20,
  },
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.BACKGROUND_DARK,
  },
  titleText: {
    fontSize: 40,
    fontWeight: "bold",
    color: colors.PRIMARY,
  },
});
