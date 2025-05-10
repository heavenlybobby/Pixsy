import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";

import { AuthContext } from "@/context/AuthContext";
import { Redirect, router } from "expo-router";
import { Image } from "expo-image";
import { colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { formatDistanceToNow } from "date-fns";
import CommentModal from "@/components/commentModal";

const { width, height } = Dimensions.get("window");

const Feed = () => {
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
            Redirect("../index");
          }
          setPosts(data);
          console.log(data);
        } catch (error) {
          console.error("Error loading posts:", error);
        }
      };

      loadPost();
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

  // const handleShowCommentScreen = () => {
  //   router.push("/comment");
  // };

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

      {posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id} // assuming MongoDB _id
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <Image
                  source={
                    item.userId.profilePictureUrl
                      ? { uri: item.userId.profilePictureUrl }
                      : require("@/assets/images/defaultprofile.png")
                  }
                  style={{ width: 50, height: 50, borderRadius: 50 }}
                />
                <TouchableOpacity>
                  <Text style={styles.creator}>{item.userId.fullName}</Text>
                </TouchableOpacity>
              </View>
              <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
              <View style={styles.postDetailsContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 20,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <TouchableOpacity onPress={() => toggleLikePost(item._id)}>
                      <Ionicons
                        name={
                          item.likes.includes(user._id)
                            ? "heart"
                            : "heart-outline"
                        }
                        size={35}
                        color={colors.PRIMARY}
                      />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontWeight: 500 }}>
                      {item.likes.length} likes
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedPost(item);
                        setShowComments(true);
                      }}
                    >
                      <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={30}
                        color={colors.PRIMARY}
                      />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 16, fontWeight: 500 }}>
                      {item.comments.length > 0
                        ? `${item.comments.length} comments`
                        : "No comments yet"}
                    </Text>
                  </View>
                </View>
                <View style={styles.caption}>
                  <Text style={styles.captionUsername}>
                    {item.userId.username}
                  </Text>
                  <Text style={styles.captionText}>{item.caption}</Text>
                </View>
                <Text>{formatDistanceToNow(new Date(item.createdAt))} ago</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text
          style={{
            color: colors.PRIMARY,
            fontSize: 25,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          No post yet
        </Text>
      )}
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BACKGROUND_LIGHT,
    flex: 1,
    gap: 20,
  },
  postContainer: {
    width: width * 0.9,
    marginHorizontal: "auto",
    marginBottom: 50,
    marginTop: 20,
    padding: 10,
    paddingBottom: 20,
    backgroundColor: colors.BACKGROUND_DARK,
    borderRadius: 20,
    boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.5)",
    gap: 20,
  },
  postImage: {
    width: "100%",
    height: 500,
    borderRadius: 10,
  },
  caption: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  captionUsername: {
    fontWeight: "bold",
    fontSize: 18,
    color: colors.PRIMARY,
  },
  captionText: {
    fontSize: 16,
    width: 300,
  },
  creator: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.PRIMARY,
  },
  listContainer: {},
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
  postDetailsContainer: {
    marginLeft: 20,
    gap: 10,
  },
});
