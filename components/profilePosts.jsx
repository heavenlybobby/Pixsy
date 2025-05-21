import { FlatList, StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { colors } from "@/constants";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

export default function ProfilePosts({ profile }) {
  return (
    <FlatList
      data={profile.post}
      numColumns={3}
      ListEmptyComponent={
        <Text
          style={{
            fontSize: RFPercentage(3),
            textAlign: "center",
            marginTop: 20,
            color: colors.secondary,
          }}
        >
          No post yet
        </Text>
      }
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.profilePostContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: width * 0.33, height: 200 }}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  profilePostContainer: {
    flexDirection: "row",
    marginHorizontal: width * 0.01,
    marginTop: 10,
  },
});
