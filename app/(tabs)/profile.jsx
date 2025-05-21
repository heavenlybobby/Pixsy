import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { colors } from "@/constants";
import { Image } from "expo-image";
import { FlatList } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import EditProfileModal from "@/components/editProfile";
import Modal from "react-native-modal"; // if not already installed: `npm i react-native-modal`
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import ProfilePosts from "../../components/profilePosts";

const { width, height } = Dimensions.get("window");

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const res = await fetch("http://192.168.56.1:3000/profile", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + user.token,
          },
        });

        const data = await res.json();

        console.log(data);
        setProfile(data);
      };
      loadUser();
    }, [])
  );

  const handleSaveProfile = (updatedProfile) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedProfile,
    }));
  };

  if (!profile) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size={"large"} color={colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleText}>{profile.username}</Text>
      </View>
      <View style={styles.profileDetails}>
        <View style={styles.profileTopDetail}>
          <Image
            source={
              profile.profilePictureUrl
                ? { uri: profile.profilePictureUrl }
                : require("@/assets/images/defaultprofile.png")
            }
            style={{
              width: width * 0.2,
              height: width * 0.2,
              borderRadius: 100,
            }}
          />
          <View style={styles.followContainer}>
            <Text style={styles.fullName}>{profile.fullName}</Text>
            <View style={styles.followDetails}>
              <Text style={styles.followText}>{profile.post.length} Posts</Text>
              <TouchableOpacity>
                <Text style={styles.followText}>
                  {profile.followers.length} Followers
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.followText}>
                  {profile.following.length} Following
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View>
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
          <TouchableOpacity
            style={styles.editProfileButton}
            activeOpacity={0.8}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editProfile}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.profilePostSection}>
        <Text style={styles.postTextStyle}>Posts</Text>

        <ProfilePosts profile={profile} />
      </View>

      <Modal isVisible={isEditing} onBackdropPress={() => setIsEditing(false)}>
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveProfile}
        />
      </Modal>
    </View>
  );
};

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
    fontSize: RFPercentage(4),
    fontWeight: "bold",
    color: colors.PRIMARY,
  },
  profileTopDetail: {
    flexDirection: "row",
    marginLeft: 20,
  },
  followContainer: {
    marginLeft: 30,
    gap: 15,
    paddingTop: 20,
  },
  fullName: {
    fontSize: RFPercentage(2.8),
    color: colors.PRIMARY,
    fontWeight: "bold",
  },
  followDetails: {
    flexDirection: "row",
    gap: 20,
  },
  followText: {
    fontWeight: "bold",
    fontSize: RFPercentage(1.7),
  },
  editProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginHorizontal: "auto",
    marginTop: 20,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: width * 0.5,
    height: 50,
  },
  bio: {
    marginTop: 20,
    marginLeft: 30,
    fontSize: RFPercentage(1.5),
    fontWeight: "bold",
    width: width * 0.7,
    letterSpacing: 1,
  },
  editProfile: {
    color: "#fff",
    fontSize: RFPercentage(2),
    fontWeight: "bold",
  },
  profilePostSection: {
    marginTop: 50,
  },
  postTextStyle: {
    fontSize: RFPercentage(3),
    color: colors.PRIMARY,
    fontWeight: "bold",
    marginLeft: 20,
  },
});

export default Profile;
