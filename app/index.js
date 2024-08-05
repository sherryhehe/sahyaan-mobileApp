import React, { useEffect, useState } from "react";
import {  View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "@/firebase/firebase";
import { useUser } from "@/firebase/UserContext";

export default function Index() {
  // const [user, setUser] = useState(null);
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    // //  console.log(loading);
    if (!loading) {
      // //  console.log(user);
      if (user) {
        router.replace("/explore");
      } else {
        router.replace("/login");
      }
      // router.push("/cart");

      // router.replace({ pathname: "search", params: { query: "0" } });
    }
  }, [user, loading]);

  return <View />;
}
