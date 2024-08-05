import { View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { CustomText } from "./CustomText";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const CategoriesButton = ({ icon, text, name }) => {
  const router = useRouter();
  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          router.replace({ pathname: "search", params: { query: "0" } });
        }}
        style={{
          backgroundColor: Colors.primary,
          padding: 30,
          width: 150,
          height: 150,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <Image
          source={icon}
          style={{
            tintColor: Colors.bg,
            width: 100,
            height: 100,
            resizeMode: "contain",
          }}
        />
      </TouchableOpacity>
      <CustomText style={{ fontFamily: "semi", fontSize: 14 }}>
        {text}
      </CustomText>
    </View>
  );
};

export default CategoriesButton;
