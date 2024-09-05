import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { CustomText as Text } from "@/components/CustomText";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import fetchBrandData from "@/functions/brand";
import Loading from "@/components/Loading";
import fetchProductData from "@/functions/product";
import { Colors } from "@/constants/Colors";

// import Avatar from "boring-avatars";
import { SafeAreaView } from "react-native-safe-area-context";
const Product = () => {
  const { id } = useLocalSearchParams();
  const [sellerData, setSellerData] = useState();
  // const sellerData = await fetchBrandData(id)
  useEffect(() => {
    async function init() {
      await fetchBrandData(id).then(async (data) => {
        // if (data.products && typeof data.products[0] === "string") {
        //   const productPromise = data.products.map(
        //     async (prodId) => await fetchProductData(prodId),
        //   );
        //   const products = await Promise.all(productPromise);
        //   data.products = products;
        // }
        console.log("DATA FINAL:", data);
        setSellerData(data);
      });
    }
    if (id) {
      console.log(id);
      init();
    }
  }, [id]);
  if (!sellerData) {
    return <Loading />;
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flex: 1,
          padding: 6,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            gap: 6,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 500,
              backgroundColor: Colors.secondary,
            }}
          ></View>
          <Text style={{ fontFamily: "semi", fontSize: 16 }}>
            {sellerData.name}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              width: "80%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontFamily: "black", fontSize: 18 }}>300</Text>
              <Text style={{ fontFamily: "semi" }}>Sales</Text>
            </View>
            <View
              style={{
                height: "50%",
                width: 1,
                opacity: 0.2,
                borderRadius: 100,
                backgroundColor: Colors.secondary,
              }}
            />

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontFamily: "black", fontSize: 18 }}>300</Text>
              <Text style={{ fontFamily: "semi" }}>Ratings</Text>
            </View>
            <View
              style={{
                height: "50%",
                width: 1,
                opacity: 0.2,
                borderRadius: 100,
                backgroundColor: Colors.secondary,
              }}
            />

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontFamily: "black", fontSize: 18 }}>300</Text>
              <Text style={{ fontFamily: "semi" }}>Shipping</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            height: "25%",
            maxHeight: 300,
            borderRadius: 6,
            backgroundColor: Colors.secondary,
            justifyContent: "center",
            alignItems: "center",
          }}
        ></View>
        <ScrollView
          style={{
            height: 0,
            marginVertical: 4,
            alignSelf: "flex-start",
            backgroundColor: "#F00",
          }}
          horizontal
        >
          <TouchableOpacity
            style={{
              borderRadius: 99,
              backgroundColor: Colors.secondary + "33",
              height: 25,
              paddingVertical: 4,
              paddingHorizontal: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 40,
            }}
          >
            <Text>aasd</Text>
          </TouchableOpacity>
        </ScrollView>
        <GridView idList={sellerData.products} />
      </View>
    </SafeAreaView>
  );
};

export default Product;

import HomeItemTile from "@/components/HomeItemTile";
import { FlatList, StyleSheet, ActivityIndicator } from "react-native";

const GridView = ({ idList }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadMoreItems = async () => {
    if (loading || currentIndex >= idList.length) return;
    setLoading(true);

    const newItems = [];
    const endIndex = Math.min(currentIndex + 10, idList.length);

    console.log(idList);
    for (let i = currentIndex; i < endIndex; i++) {
      newItems.push(idList[i]);
    }

    setData((prevData) => [...prevData, ...newItems]);
    setCurrentIndex(endIndex);
    setLoading(false);
  };

  useEffect(() => {
    loadMoreItems();
  }, []);

  const renderItem = ({ item }) => <HomeItemTile id={item} />;

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item}
      numColumns={2}
      onEndReached={loadMoreItems}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",

    justifyContent: "space-between",
  },
  item: {
    flex: 1,
    margin: 5,
    height: 100,
    width: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
