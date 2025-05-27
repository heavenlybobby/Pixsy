import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Header from "../../components/header";
import { router } from "expo-router";
import { styles } from "@/assets/styles/auth.styles";
import { colors } from "@/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../lib/validators/login-schema";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    setIsLoading(true);
    if (!email) {
      setError({ ...error, email: "Email is required" });
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError({ ...error, password: "Password is required" });
      setIsLoading(false);
      return;
    }

    await login(email, password);
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        contentContainerStyle={{
          marginTop: 50,
          marginTop: 50,
          alignItems: "center",
          paddingBottom: 100,
        }}
      >
        <Text
          style={{
            fontSize: 35,
            fontWeight: "bold",
            color: colors.PRIMARY,
            marginBottom: 20,
          }}
        >
          Login
        </Text>

        <Text style={{ color: colors.ERROR, fontSize: 18 }}>{error.email}</Text>
        <TextInput
          style={[styles.input, error.email && { borderColor: colors.ERROR }]}
          placeholder="Enter email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError({ ...error, email: "" });
          }}
          keyboardType="email-address"
        />
        <Text style={{ color: colors.ERROR, fontSize: 15 }}>
          {error.password}
        </Text>
        <TextInput
          style={[
            styles.input,
            error.password && { borderColor: colors.ERROR },
          ]}
          placeholder="Enter Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError({ ...error, password: "" });
          }}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
            Login
          </Text>
        </TouchableOpacity>
        <Text style={{ color: "#000", fontSize: 20 }}>
          Don't have an Account?
        </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text
            style={{
              color: "#00B2CA",
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
