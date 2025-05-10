import { Redirect, router } from "expo-router";
import { useState, useContext } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/constants";
import { AuthContext } from "@/context/AuthContext";

export default function Index() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (user) return <Redirect href="/(tabs)" />;

  const handleAuth = () => {
    router.replace("/(auth)/login");
  };

  return (
    <ImageBackground
      source={require("@/assets/images/welcome-bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome to Pixsy </Text>
        <Text style={styles.subtitle}>
          A social media app for sharing photos and connecting with friends.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  titleContainer: {
    paddingLeft: 40,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: colors.TEXT_PRIMARY,
    marginTop: 50,
  },
  subtitle: {
    fontSize: 20,
    color: colors.TEXT_PRIMARY,
    marginTop: 10,
    width: "90%",
  },
  button: {
    backgroundColor: colors.PRIMARY,
    padding: 15,
    borderRadius: 5,
    width: "60%",
    marginHorizontal: "auto",
    marginBottom: 50,
    borderRadius: 50,
  },
  buttonText: {
    color: colors.BACKGROUND_LIGHT,
    fontSize: 18,
    textAlign: "center",
  },
});
