import { View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import fetchProductData from "@/functions/product";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useUser } from "@/firebase/UserContext";
import { addTowishList, removeFromWishlist } from "@/functions/users";
import { CustomText as Text } from "@/components/CustomText";
const HomeItemTile = ({ id }) => {
  const { user, setUserData } = useUser();
  const [loading, setLoading] = useState(true);
  const [itemData, setItemData] = useState({});
  const router = useRouter();
  async function fetchData() {
    setLoading(true);
    fetchProductData(id).then((data) => {
      setItemData(data);

      if (itemData) {
        setLoading(false);
      }
    });
  }

  // INIT
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/product/${id}`);
      }}
      key={id}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: 2,
        opacity: loading ? 0.4 : 1,
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
                // // //  console.log(item.id);
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
                // // //  console.log(item.id);
                addTowishList(user.uid, itemData.id);
                setUserData(true);
              }}
            >
              <AntDesign name="hearto" size={15} color={Colors.bg} />
            </TouchableOpacity>
          )}
        </View>
        {!loading && itemData.imageUrls ? (
          <Image
            source={{ uri: itemData.imageUrls[0] }}
            style={{
              resizeMode: "cover",
              width: "100%",
              height: "100%",
              // aspectRatio: 1,
              borderRadius: 4,
            }}
          />
        ) : (
          !loading && (
            <Image
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/sahyan-shop.appspot.com/o/images%2Fproducts%2FDj0pDUbrxhFyOhbnb3Jt%2Fimage.jpg?alt=media&token=6bde6a2e-cde3-497e-9836-eac937ad43eb",
              }}
              style={{
                resizeMode: "cover",
                width: "100%",
                height: "100%",
                // aspectRatio: 1,
                borderRadius: 4,
              }}
            />
          )
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
        {loading ? (
          <View
            style={{
              backgroundColor: Colors.secondary,
              width: 40,
              marginTop: 2,
            }}
          >
            <Text
              style={{
                fontFamily: "regular",
                size: 12,
                color: Colors.text,
              }}
            >
              {" "}
            </Text>
          </View>
        ) : (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                fontFamily: "regular",
                size: 12,
                color: Colors.text,
              }}
            >
              {itemData.name}
            </Text>
          </View>
        )}
        {loading ? (
          <View
            style={{
              backgroundColor: Colors.secondary,
              width: 40,
              marginTop: 2,
            }}
          >
            <Text
              style={{
                fontFamily: "regular",
                size: 12,
                color: Colors.text,
              }}
            >
              {" "}
            </Text>
          </View>
        ) : (
          <Text
            style={{
              fontFamily: "bold",
              fontSize: 16,
              color: Colors.text,
            }}
          >
            $ {itemData.price}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default HomeItemTile;

// <View
//   style={{
//     display: "flex",
//     flexDirection: "row",
//     gap: 2,
//     alignItems: "start",
//   }}
// >
//   <AntDesign name="star" size={12} color={Colors.text} />
//   {!loading && itemData && itemData.rating && (
//     <Text
//       style={{
//         fontFamily: "regular",
//         size: 12,
//         color: Colors.text,
//       }}
//     >
//       {itemData.rating[0].toFixed(1)}
//     </Text>
//   )}
// </View>;
