import { UserProvider } from "@/firebase/UserContext";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as Font from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Loading from "@/components/Loading";

import { StripeProvider } from "@stripe/stripe-react-native";
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
} from "@expo-google-fonts/montserrat";

export default function RootLayout() {
  console.log("sada");
  // const [fontsLoaded, setFontsLoaded] = useState(false);

  //   useEffect(() => {
  //   const load = async () => {
  //     await loadFonts();
  //     setFontsLoaded(true);
  //   };
  //   load();
  // }, []);
  let [fontsLoaded] = useFonts({
    thin: Montserrat_100Thin,
    extraLight: Montserrat_200ExtraLight,
    light: Montserrat_300Light,
    regular: Montserrat_400Regular,
    medium: Montserrat_500Medium,
    semibold: Montserrat_600SemiBold,
    bold: Montserrat_700Bold,
    extrabold: Montserrat_800ExtraBold,
    black: Montserrat_900Black,
  });

  if (!fontsLoaded) {
    return <Loading />;
  }
  return (
    <StripeProvider publishableKey="pk_test_51NZzZSA3OkimDdmQF6wEI6eTNe5uhEnI53L4H0woL00OhkCH7cbLS7YYYpmsK0V7yUXhHp5QhWVAe3rTWNUAmKjR00kY8Pt28u">
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
    </StripeProvider>
  );
}
