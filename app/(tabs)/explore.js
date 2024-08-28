import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  PanResponder,
  ImageBackground,
  StyleSheet,
  ToastAndroid,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CustomText as Text } from "@/components/CustomText";
import { Colors } from "@/constants/Colors";
import { getIDData, getRecommendationData } from "@/firebase/FirestoreService";
const { width, height } = Dimensions.get("window");
import { useUser } from "@/firebase/UserContext";
import { addTowishList, removeFromWishlist } from "@/functions/users";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Loading from "@/components/Loading";

export default function explore() {
  const { user, setUserData } = useUser();
  useEffect(() => {
    if (user) {
      console.log(typeof user.interests);
    }
  }, [user]);

  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [exploreData, setExploreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const INITIAL_BATCH_SIZE = 10;
  const BATCH_SIZE = 5;

  async function fetchInitialData() {
    try {
      console.log(user);
      const data = await getRecommendationData(
        user.interest && user.interest.length > 0 ? user.interest : ["PQR"],
      );
      console.log(data.length);
      if (data && Array.isArray(data)) {
        const initialBatch = data.slice(0, INITIAL_BATCH_SIZE);
        const detailedDataPromises = initialBatch.map(fetchProductData);
        const detailedData = await Promise.all(detailedDataPromises);
        setExploreData(detailedData);

        // Load the rest of the data in the background
        loadRemainingData(data.slice(INITIAL_BATCH_SIZE));
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  }

  async function loadRemainingData(remainingData) {
    try {
      for (let i = 0; i < remainingData.length; i += BATCH_SIZE) {
        const batch = remainingData.slice(i, i + BATCH_SIZE);
        const detailedDataPromises = batch.map(fetchProductData);
        const detailedData = await Promise.all(detailedDataPromises);
        setExploreData((prevData) => [...prevData, ...detailedData]);
      }
      setAllDataLoaded(true);
    } catch (error) {
      console.error("Error loading remaining data:", error);
    }
  }

  useEffect(() => {
    async function init() {
      setLoading(true);

      await fetchInitialData();
      setLoading(false);
    }
    if (user) {
      init();
    }
  }, [user]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -50) {
        // // Swipe right to left
        // flatListRef.current.scrollToIndex({
        //   index: currentIndex,
        //   animated: true,
        // });
        router.push(`/brand/${exploreData[currentIndex].brandId}`);
      }
    },
  });

  const renderItem = ({ item, index }) => {
    console.log(item.price);
    return (
      <View
        style={{
          width: "100%",
          height: height,
          justifyContent: "start",
          alignItems: "center",
          backgroundColor: Colors.bg,
        }}
        key={index}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            router.push(`/product/${item.id}`);
          }}
          style={{
            width: "100%",
            height: "100%",
            // borderRadius: 24,
            backgroundColor: Colors.secondary,
            overflow: "hidden",
          }}
          asChild
        >
          <ImageBackground
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/sahyan-shop.appspot.com/o/images%2Fproducts%2FDj0pDUbrxhFyOhbnb3Jt%2Fimage.jpg?alt=media&token=6bde6a2e-cde3-497e-9836-eac937ad43eb",
            }}
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              justifyContent: "flex-end",
              backgroundColor: Colors.bg,
              // Ensure image doesn't overflow its container
            }}
            resizeMode="contain"
          >
            <View
              style={{
                ...StyleSheet.absoluteFillObject, // Cover the entire parent container
                backgroundColor: "rgba(0, 0, 0, 0.25)", // Semi-transparent grey overlay
              }}
            />
            <View
              style={{
                bottom: 50,
                paddingHorizontal: 20,
                zIndex: 99,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 10,
                width: "100%",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "90%",
                }}
              >
                <Text
                  style={{
                    fontSize: 36,
                    color: Colors.bg,
                    fontFamily: "black",
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  onTouchEnd={() => {
                    router.push(`/brand/${item.brandId}`);
                  }}
                  style={{
                    fontSize: 26,
                    color: Colors.bg,
                    fontFamily: "semi",
                  }}
                >
                  {item.brand}
                </Text>
                <Text
                  style={{
                    fontSize: 26,
                    color: Colors.bg,
                    fontFamily: "bold",
                  }}
                >
                  ${item.price.toFixed(2)}
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.bg,
                    fontFamily: "thin",
                  }}
                  numberOfLines={2}
                >
                  {item.shortDescription} asdsa dasd asd sdas dasd asdasd asdfsf
                  fs dfdf dsf ds fdfdsfdsfsdfdsfd fsdfdsfdsfdsf dsfdss adass
                  dasdasd adsd asdsad asdsas
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "column",

                  gap: 10,
                  alignItems: "center",
                }}
              >
                {user && user.wishlist && user.wishlist.includes(item.id) ? (
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        await removeFromWishlist(user.uid, item.id);

                        setUserData(true);
                        ToastAndroid.show(
                          "Successfully removed to wishlist",
                          ToastAndroid.SHORT,
                        );
                        // You can add some user feedback here, like a toast notification
                        // //  console.log("Product added to cart");
                      } catch (error) {
                        ToastAndroid.show(
                          "Couldnt Add product to wishlist",
                          ToastAndroid.SHORT,
                        );
                        console.error("Error!", error);
                        // Handle the error, maybe show an error message to the user
                      }
                    }}
                  >
                    <MaterialIcons
                      name="bookmark"
                      size={26}
                      color={Colors.bg}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        await addTowishList(user.uid, item.id);

                        setUserData(true);
                        ToastAndroid.show(
                          "Successfully added to wishlist",
                          ToastAndroid.SHORT,
                        );
                        // You can add some user feedback here, like a toast notification
                        // //  console.log("Product added to cart");
                      } catch (error) {
                        ToastAndroid.show(
                          "Couldnt Add product to wishlist",
                          ToastAndroid.SHORT,
                        );
                        console.error("Error!", error);
                        // Handle the error, maybe show an error message to the user
                      }
                    }}
                  >
                    <MaterialIcons
                      name="bookmark-outline"
                      size={26}
                      color={Colors.bg}
                    />
                  </TouchableOpacity>
                )}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="star" size={20} color={Colors.bg} />
                  {item && item.rating && (
                    <Text
                      style={{
                        fontFamily: "regular",
                        size: 12,
                        color: Colors.bg,
                      }}
                    >
                      {item.rating[0].toFixed(1)}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="dollar" size={20} color={Colors.bg} />
                  {item && item.rating && (
                    <Text
                      style={{
                        fontFamily: "regular",
                        size: 12,
                        color: Colors.bg,
                      }}
                    >
                      {item.rating[0].toFixed(1)}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;
  // useEffect(() => {
  // }, [currentIndex]);
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={exploreData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        horizontal={false}
        decelerationRate={1}
        disableIntervalMomentum={true}
        initialNumToRender={INITIAL_BATCH_SIZE}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
      {!allDataLoaded && (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "thin",
            }}
          >
            Loading more...
          </Text>
        </View>
      )}
    </>
  );
}
