import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { Platform } from "react-native";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

export const Create = () => {
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useContext(AuthContext);
  const [isShearing, setIsShearing] = useState(false);

  const uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      console.log("Picked image URI: ", uri); // Log here directly
      setSelectedImage(uri);
    }
  };

  const handlePost = async () => {
    setIsShearing(true);
    if (!selectedImage) return;

    const extension = selectedImage.split(".").pop();
    const mimeType =
      extension === "png"
        ? "image/png"
        : extension === "jpg" || extension === "jpeg"
        ? "image/jpeg"
        : "image/jpeg";

    const formData = new FormData();
    formData.append("image", {
      uri: selectedImage,
      name: `upload.${extension}`,
      type: mimeType,
    });
    formData.append("caption", caption);

    try {
      const res = await fetch("http://192.168.56.1:3000/create", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + user.token,
        },
        body: formData,

        // Don't set Content-Type manually for FormData!
      });

      const data = await res.json();
      if (res.status === 201) {
        alert(data.message);
        router.push("/(tabs)");
        setSelectedImage(null);
        setCaption("");
      }
      console.log(data);
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setIsShearing(false);
    }
  };

  if (selectedImage) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        style={styles.container}
      >
        <View style={styles.uploadContainer}>
          <Ionicons
            name="arrow-back"
            size={30}
            onPress={() => setSelectedImage(null)}
          />
          <Text style={styles.titleText}>New Post</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderWidth: 2,
              borderColor: colors.BORDER,
              borderRadius: 5,
            }}
            onPress={handlePost}
          >
            {isShearing && <ActivityIndicator size={"large"} />}
            {!isShearing && (
              <Text
                style={{
                  color: colors.secondary,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Post
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={uploadImage}>
          <Image
            source={{ uri: selectedImage }}
            style={{ width: width, height: 500 }}
          />
        </TouchableOpacity>
        <View style={styles.captionContainer}>
          <Ionicons name="create-outline" size={50} color={colors.PRIMARY} />
          <TextInput
            placeholder="Caption"
            style={styles.captionInput}
            value={caption}
            onChangeText={(text) => setCaption(text)}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.uploadContainer}>
        <View></View>
        <Text style={styles.titleText}>New Post</Text>
        <View></View>
      </View>
      <TouchableOpacity
        style={styles.imageContainer}
        activeOpacity={0.9}
        onPress={uploadImage}
      >
        <Ionicons
          name="image-outline"
          color={colors.PRIMARY}
          size={100}
          style={styles.postIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    backgroundColor: "#000",
    flex: 1,
  },
  uploadContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.BACKGROUND_DARK,
  },
  titleText: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.PRIMARY,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: colors.BORDER,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: "bold",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  captionContainer: {
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    height: 70,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  captionInput: {
    flex: 1,
    textAlignVertical: "top", // or 'center', 'bottom'
    fontSize: 18,
    paddingTop: 20,
    paddingLeft: 10,
    color: "#000",
  },
});

export default Create;
