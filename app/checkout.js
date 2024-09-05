import React from "react";
import { View } from "react-native";
import { Colors } from "@/constants/Colors";
import { CustomText as Text } from "@/components/CustomText";
import { SafeAreaView } from "react-native-safe-area-context";
export default CheckoutPage = ({ data }) => {
  if (data === "cart")
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.bg,
          paddingHorizontal: 6,
          paddingTop: 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Text>Checkout</Text>
      </SafeAreaView>
    );
};
