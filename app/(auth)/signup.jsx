import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import { router } from "expo-router";
import { styles } from "@/assets/styles/auth.styles";
import { colors } from "@/constants";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const HandleSignUp = async () => {
    setIsLoading(true);
    setError({
      email: "",
      password: "",
      confirmPassword: "",
    });
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
    if (!confirmPassword) {
      setError({ ...error, confirmPassword: "Enter password again" });
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("http://192.168.56.1:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
        }),
      });
      const data = await res.json();
      if (res.status === 422) {
        if (data.errors && Array.isArray(data.errors)) {
          const emailError = data.errors
            .filter((err) => err.path === "email")
            .map((err) => err.msg);

          const passwordError = data.errors
            .filter((err) => err.path === "password")
            .map((err) => err.msg);
          const confirmPasswordError = data.errors
            .filter((err) => err.path === "confirmPassword")
            .map((err) => err.msg);

          setError((prevError) => ({
            email: emailError.length > 0 ? emailError[0] : "",
            password: passwordError.length > 0 ? passwordError[0] : "",
            confirmPassword:
              confirmPasswordError.length > 0 ? confirmPasswordError[0] : "",
          }));
        }
        return;
      } else if (res.status === 201) {
        alert("Account created successfully");
        router.push("/login");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      {isLoading && (
        <ActivityIndicator
          size="large"
          style={{ flex: 1, alignItems: "center" }}
          color={colors.PRIMARY}
        />
      )}
      {!isLoading && (
        <ScrollView
          contentContainerStyle={{
            marginTop: 50,
            alignItems: "center",
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 35,
              fontWeight: "bold",
              color: colors.PRIMARY,
              marginBottom: 20,
            }}
          >
            Sign Up
          </Text>
          {error.email ? (
            <Text style={{ color: colors.ERROR, fontSize: 18 }}>
              {error.email}
            </Text>
          ) : null}
          <TextInput
            style={[
              styles.input,
              error.email
                ? { borderColor: colors.ERROR }
                : { borderColor: colors.PRIMARY },
            ]}
            placeholder="Enter email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError({ ...error, email: "" });
            }}
            keyboardType="email-address"
          />

          {error.password ? (
            <Text style={{ color: colors.ERROR, fontSize: 18 }}>
              {error.password}
            </Text>
          ) : null}
          <TextInput
            style={[
              styles.input,
              error.password
                ? { borderColor: colors.ERROR }
                : { borderColor: colors.PRIMARY },
            ]}
            placeholder="Enter Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError({ ...error, password: "" });
            }}
          />
          {error.confirmPassword ? (
            <Text style={{ color: colors.ERROR, fontSize: 18 }}>
              {error.confirmPassword}
            </Text>
          ) : null}
          <TextInput
            style={[
              styles.input,
              error.confirmPassword
                ? { borderColor: colors.ERROR }
                : { borderColor: colors.PRIMARY },
            ]}
            placeholder="Confirm Password"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError({ ...error, confirmPassword: "" });
            }}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => HandleSignUp()}
          >
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
              Sign up
            </Text>
          </TouchableOpacity>
          <Text style={{ color: "#000", fontSize: 20 }}>
            Already have an Account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text
              style={{
                color: "#00B2CA",
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 10,
              }}
            >
              Log in
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
