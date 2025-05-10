// components/EditProfileModal.js

import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { colors } from "@/constants";
import { AuthContext } from "@/context/AuthContext";

const { width } = Dimensions.get("window");

const EditProfileModal = ({ profile, onClose, onSave }) => {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState(profile.username || "");
  const [fullName, setFullName] = useState(profile.fullName || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [image, setImage] = useState(profile.profilePictureUrl || null);
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setSubmitting(true);
    const formData = new FormData();

    formData.append("username", username);
    formData.append("fullName", fullName);
    formData.append("bio", bio);

    if (image && image !== profile.profilePictureUrl) {
      const filename = image.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("profilePicture", {
        uri: image,
        name: filename,
        type,
      });
    }

    try {
      const res = await fetch("http://192.168.56.1:3000/profile/edit", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + user.token,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        onSave(data); // update profile in parent
        onClose();
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.modal}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Edit Profile</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={28} color={colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* Profile Picture */}
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        <Image
          source={
            image
              ? { uri: image }
              : require("@/assets/images/defaultprofile.png")
          }
          style={styles.profileImage}
        />
        <Text style={styles.changePhotoText}>Change Photo</Text>
      </TouchableOpacity>

      {/* Username */}
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      {/* Full Name */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      {/* Bio */}
      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
      />

      <TouchableOpacity
        onPress={handleSave}
        disabled={submitting}
        style={styles.saveButton}
      >
        <Text style={styles.saveText}>
          {submitting ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
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
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changePhotoText: {
    marginTop: 10,
    color: colors.PRIMARY,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.PRIMARY,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    marginTop: 10,
    color: colors.PRIMARY,
  },
});

export default EditProfileModal;
