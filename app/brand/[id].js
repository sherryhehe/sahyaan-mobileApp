import { View } from "react-native";
import { CustomText as Text } from "@/components/CustomText";
import React from "react";
import { useLocalSearchParams } from "expo-router";
const Product = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Brand {id}</Text>
    </View>
  );
};

export default Product;
