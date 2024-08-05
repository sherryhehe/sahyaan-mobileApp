import { UserProvider } from "@/firebase/UserContext";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as Font from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Loading from "@/components/Loading";

const loadFonts = async () => {
  await Font.loadAsync({
    regular: require("@/assets/fonts/Aileron-Regular.otf"),
    thin: require("@/assets/fonts/Aileron-Thin.otf"),
    black: require("@/assets/fonts/Aileron-Black.otf"),
    heavy: require("@/assets/fonts/Aileron-Heavy.otf"),
    bold: require("@/assets/fonts/Aileron-Bold.otf"),
    light: require("@/assets/fonts/Aileron-Light.otf"),
    semi: require("@/assets/fonts/Aileron-SemiBold.otf"),
  });
};

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    const load = async () => {
      await loadFonts();
      setFontsLoaded(true);
    };
    load();
  }, []);

  if (!fontsLoaded) {
    return <Loading />;
  }
  return (
    <SafeAreaProvider>
      <UserProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="product/[id]" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="search" />
          <Stack.Screen name="index" />
        </Stack>
      </UserProvider>
    </SafeAreaProvider>
  );
}
