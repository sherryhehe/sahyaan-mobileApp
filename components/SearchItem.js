import { View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { CustomText as Text } from "@/components/CustomText";
import { useUser } from "@/firebase/UserContext";
import { addTowishList, removeFromWishlist } from "@/functions/users";

const SearchItem = ({ itemData }) => {
  const router = useRouter();
  const { user, setUserData } = useUser();

  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/product/${itemData.id}`);
      }}
      key={itemData.id}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: 2,
        width: 180,
      }}
    >
      <View
        style={{
          width: "100%",
          height: 250,
          backgroundColor: Colors.secondary,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "start",
            padding: 4,
            zIndex: 99,
            right: 0,
            top: 0,
          }}
        >
          {user && user.wishlist && user.wishlist.includes(itemData.id) ? (
            <TouchableOpacity
              style={{
                backgroundColor: Colors.primary,
                borderRadius: 99,
                padding: 8,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                removeFromWishlist(user.uid, itemData.id);
                setUserData(true);
              }}
            >
              <AntDesign name="heart" size={15} color={Colors.bg} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: Colors.primary,
                borderRadius: 99,
                padding: 8,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                addTowishList(user.uid, itemData.id);
                setUserData(true);
              }}
            >
              <AntDesign name="hearto" size={15} color={Colors.bg} />
            </TouchableOpacity>
          )}
        </View>
        {itemData.imageUrls ? (
          <Image
            source={{ uri: itemData.imageUrls[0] }}
            style={{
              resizeMode: "cover",
              width: "100%",
              height: "100%",
              borderRadius: 4,
            }}
          />
        ) : (
          <Image
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/sahyan-shop.appspot.com/o/images%2Fproducts%2FDj0pDUbrxhFyOhbnb3Jt%2Fimage.jpg?alt=media&token=6bde6a2e-cde3-497e-9836-eac937ad43eb",
            }}
            style={{
              resizeMode: "cover",
              width: "100%",
              height: "100%",
              borderRadius: 4,
            }}
          />
        )}
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          padding: 2,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text
            style={{
              fontFamily: "regular",
              fontSize: 12,
              color: Colors.text,
            }}
          >
            {itemData.name}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              alignItems: "start",
            }}
          >
            <AntDesign name="star" size={12} color={Colors.text} />
            {itemData && itemData.rating && (
              <Text
                style={{
                  fontFamily: "regular",
                  fontSize: 12,
                  color: Colors.text,
                }}
              >
                {itemData.rating[0].toFixed(1)}
              </Text>
            )}
          </View>
        </View>
        <Text
          style={{
            fontFamily: "bold",
            fontSize: 16,
            color: Colors.text,
          }}
        >
          $ {itemData.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SearchItem;
