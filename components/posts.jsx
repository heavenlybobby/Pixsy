import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants";
import { RFPercentage } from "react-native-responsive-fontsize";
import { formatDistanceToNow } from "date-fns";

const { width, height } = Dimensions.get("window");

export default function Posts({
  posts,
  user,
  toggleLikePost,
  setSelectedPost,
  setShowComments,
}) {
  return (
    <FlatList
      data={posts}
      ListEmptyComponent={
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
      }
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
                      item.likes.includes(user._id) ? "heart" : "heart-outline"
                    }
                    size={35}
                    color={colors.PRIMARY}
                  />
                </TouchableOpacity>
                <Text style={{ fontSize: RFPercentage(1.5), fontWeight: 500 }}>
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

                <Text style={{ fontSize: RFPercentage(1.5), fontWeight: 500 }}>
                  {item.comments.length > 0
                    ? `${item.comments.length} comments`
                    : "No comments yet"}
                </Text>
              </View>
            </View>
            <View style={styles.caption}>
              <Text style={styles.captionUsername}>{item.userId.username}</Text>
              {item.caption.length > 0 && (
                <Text style={styles.captionText}>{item.caption}</Text>
              )}
            </View>
            <Text>{formatDistanceToNow(new Date(item.createdAt))} ago</Text>
          </View>
        </View>
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
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
    gap: 10,
  },
  captionUsername: {
    fontWeight: "bold",
    fontSize: RFPercentage(2),
    color: colors.PRIMARY,
  },
  captionText: {
    fontSize: RFPercentage(1.6),
    width: "98%",
  },
  creator: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.PRIMARY,
  },
  postDetailsContainer: {
    marginLeft: 20,
    gap: 10,
  },
});
