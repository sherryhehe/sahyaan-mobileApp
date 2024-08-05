import {
  View,
  TextInput,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  ImageBackground,
} from "react-native";
import { Colors } from "@/constants/Colors";
import React, { useEffect, useState, lazy } from "react";
import { Feather } from "@expo/vector-icons";
import { CustomText as Text } from "@/components/CustomText";
import { queryDoc } from "@/firebase/FirestoreService";
import HomeItemTile from "@/components/HomeItemTile";
import { useRouter } from "expo-router";
import CategoriesButton from "@/components/CategoryTile";
import Loading from "@/components/Loading";

const HEADERAD1 = require("@/assets/images/ad3.jpg");
const { height } = Dimensions.get("window");
const elec = require("@/assets/images/icons/elec.png");

const index = () => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState();
  const [productPromotionsTop, setProductPromotionsTop] = useState();
  const [productPromotionsMid, setProductPromotionsMid] = useState();
  const [productPromotionsBottom, setProductPromotionsBottom] = useState();
  const [loading, setLoading] = useState(true);
  // INIT EFFECT
  useEffect(() => {
    async function init() {
      setLoading(true);
      await fetchProductPromotions();
      setLoading(false);
    }
    init();
  }, []);
  async function fetchProductPromotions() {
    const data = await queryDoc("promotions", "products");
    setProductPromotionsTop(data["top"]);
    setProductPromotionsBottom(data["bottom"]);
    setProductPromotionsMid(data["middle"]);
  }

  const handleSearch = () => {
    router.push({ pathname: "search", params: { query: searchQuery } });
    ToastAndroid.show(`Searched: ${searchQuery}`, ToastAndroid.SHORT);
  };

  const renderColumns = () => {
    const columns = [];
    const itemsPerColumn = 2; // Number of items per column

    for (let i = 0; i < productPromotionsBottom.length; i += itemsPerColumn) {
      const columnItems = productPromotionsBottom.slice(i, i + itemsPerColumn);
      columns.push(
        <View
          key={i}
          style={{
            flexDirection: "column",
          }}
        >
          {columnItems.map((item, index) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
              key={`${item}${index}`}
            >
              <HomeItemTile id={item} />
            </View>
            // <CategoriesButton
            //   name="Electronics"
            //   icon={elec}
            //   text={"Electronics"}
            // />
          ))}
        </View>
      );
    }

    return columns;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView
      style={{
        backgroundColor: Colors.bg,
        flex: 1,
        height: "100%",
        width: "100%",
      }}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        paddingBottom: 120,
      }}
    >
      <ImageBackground
        source={HEADERAD1} // Replace with your image path
        style={{
          width: "100%",
          height: height * 0.3,
          backgroundColor: Colors.secondary,
        }}
        imageStyle={{
          opacity: 0.5, // Adjust for desired intensity
          mixBlendMode: "luminosity", // This creates the black and white effect
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",

            backgroundColor: "rgba(0,0,0,0.3)", // Adds a slight dark overlay
          }}
        >
          <View
            style={{
              width: "60%",
              marginTop: 60,
              borderRadius: 999,
              backgroundColor: Colors.bg,
              paddingVertical: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              borderColor: "black",
              borderWidth: 2,
              overflow: "hidden",
            }}
          >
            <TextInput
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={{
                fontSize: 14,
                color: Colors.text,
                width: "86%",
              }}
              cursorColor={Colors.secondary}
              selectionColor={Colors.secondary}
              placeholder="Search..."
              placeholderTextColor={Colors.text}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={handleSearch}>
              <Feather name="search" size={24} color={Colors.secondary} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <View
        style={{
          marginTop: 20,
          backgroundColor: Colors.secondary,
          paddingVertical: 8,
          // paddingHorizontal: 10,
          minWidth: 150,
          maxWidth: 150,
          borderRadius: 7,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "regular",
            color: Colors.bg,
            fontSize: 18,
            fontFamily: "regular",
          }}
        >
          Sponsored
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          paddingHorizontal: 6,
          marginRight: 20,
          paddingRight: 80,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {productPromotionsTop &&
            productPromotionsTop.map((item, index) => (
              // <View key={item}>
              <HomeItemTile key={index} id={item} />
              // </View>
            ))}
        </View>
      </ScrollView>

      <View
        style={{
          marginTop: 20,
          backgroundColor: Colors.secondary,
          paddingVertical: 8,
          // paddingHorizontal: 10,
          minWidth: 150,
          maxWidth: 150,
          borderRadius: 7,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "regular",
            color: Colors.bg,
            fontSize: 18,
            fontFamily: "regular",
          }}
        >
          Picked For you
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          paddingHorizontal: 6,
          marginRight: 20,
          paddingRight: 80,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {productPromotionsBottom && renderColumns()}
        </View>
      </ScrollView>

      <View
        style={{
          marginTop: 20,
          backgroundColor: Colors.secondary,
          paddingVertical: 8,
          // paddingHorizontal: 10,
          minWidth: 150,
          maxWidth: 150,
          borderRadius: 7,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "regular",
            color: Colors.bg,
            fontSize: 18,
            fontFamily: "regular",
          }}
        >
          Sponsored
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          paddingHorizontal: 6,
          marginRight: 20,
          paddingRight: 80,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {productPromotionsMid &&
            productPromotionsMid.map((item, index) => (
              // <View key={item}>
              <HomeItemTile key={index} id={item} />
              // </View>
            ))}
        </View>
      </ScrollView>

      <View
        style={{
          marginTop: 20,
          backgroundColor: Colors.secondary,
          paddingVertical: 8,
          // paddingHorizontal: 10,
          minWidth: 150,
          maxWidth: 150,
          borderRadius: 7,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "regular",
            color: Colors.bg,
            fontSize: 18,
            fontFamily: "regular",
          }}
        >
          Sponsored
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          paddingHorizontal: 6,
          marginRight: 20,
          paddingRight: 80,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {productPromotionsBottom &&
            productPromotionsBottom.map((item, index) => (
              // <View key={item}>
              <HomeItemTile key={index} id={item} />
              // </View>
            ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

export default index;
