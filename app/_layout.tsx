import { Stack } from "expo-router";
import { ActivityIndicator, SafeAreaView } from "react-native";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "@/context/AuthContext";
import colors from "@/constants";

// This component will consume the AuthContext *inside* the provider
function RootLayoutContent() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        color={colors.PRIMARY}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
