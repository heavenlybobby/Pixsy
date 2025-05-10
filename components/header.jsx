import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View style={styles.container}>
      <Ionicons name="camera" size={60} color="#00B2CA" />
      <Text style={styles.title}>Pixsy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
  },
});
