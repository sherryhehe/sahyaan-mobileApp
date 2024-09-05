import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { CustomText as Text } from "@/components/CustomText";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import fetchProductData from "@/functions/product";
import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useUser } from "@/firebase/UserContext";
import {
  addTowishList,
  removeFromWishlist,
  addToCart,
  addToInterest,
} from "@/functions/users";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
import Loading from "@/components/Loading";

const Product = () => {
  const { user, setUserData } = useUser();
  const { id } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const [variant, setvariant] = useState({});
  const router = useRouter();
  // FETCH DATA
  async function fetchData() {
    try {
      const prodData = await fetchProductData(id);
      setData(prodData);
      let isUpdated;

      await addToInterest(user.id, prodData.name).then((update) => {
        isUpdated = update;
      });
      await addToInterest(user.id, prodData.keywords).then((update) => {
        if (!isUpdated) {
          isUpdated = update;
        }
      });
      setUserData(isUpdated);

      const initialvariants = {};
      prodData.variants.forEach((v) => {
        initialvariants[v.name] = v.vals[0];
      });
      setvariant(initialvariants);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }

  // INIT
  useEffect(() => {
    async function init() {
      setLoading(true);
      if (user) {
        await fetchData();
        setLoading(false);
      }
    }
    init();
  }, [id, user]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(user.uid, data.id, 1, variant);
      setUserData(true);
      ToastAndroid.show("Successfully added to cart", ToastAndroid.SHORT);
      // You can add some user feedback here, like a toast notification
      // //  console.log("Product added to cart");
    } catch (error) {
      // console.error("Failed to add product to cart", error);
      ToastAndroid.show("Couldnt Add product to cart", ToastAndroid.SHORT);
      // Handle the error, maybe show an error message to the user
    }
    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.bg,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          paddingHorizontal: 6,
          paddingVertical: 5,
          backgroundColor: Colors.bg,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          style={{ padding: 4, borderRadius: 99 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 6, paddingBottom: 80 }}
      >
        <View style={{ marginBottom: 20 }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {data.imageUrls.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={{
                  width: SCREEN_WIDTH - 30, // Adjust based on your padding
                  height: 400,
                  resizeMode: "cover",
                  // backgroundColor: Colors.primary,
                }}
                resizeMode="contain"
              />
            ))}
          </ScrollView>
        </View>

        <View
          style={{
            backgroundColor: Colors.bg,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "heavy",
                fontSize: 30,
              }}
            >
              {data.name}
            </Text>

            {user && user.wishlist && user.wishlist.includes(data.id) ? (
              <TouchableOpacity
                style={{
                  borderRadius: 99,
                  padding: 8,
                }}
                onPress={() => {
                  // // //  console.log(item.id);
                  removeFromWishlist(user.uid, data.id);
                  setUserData(true);
                }}
              >
                <AntDesign name="heart" size={24} color={Colors.primary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  borderRadius: 99,
                  padding: 8,
                }}
                onPress={() => {
                  // // //  console.log(item.id);
                  addTowishList(user.uid, data.id);
                  setUserData(true);
                }}
              >
                <AntDesign name="hearto" size={24} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={{
              fontFamily: "regular",
              fontSize: 20,
            }}
          >
            {data.brand}
          </Text>
          <Text
            style={{
              fontFamily: "black",
              fontSize: 20,
            }}
          >
            $ {data.price}
          </Text>
          <Text
            style={{
              color: Colors.secondary,
              fontFamily: "black",
              fontSize: 18,
              marginTop: 30,
              opacity: 0.5,
            }}
          >
            Description
          </Text>
          <Text
            style={{
              color: Colors.secondary,
              fontFamily: "light",
              fontSize: 18,
              marginTop: 5,
              opacity: 0.5,
            }}
          >
            {data.shortDescription}
          </Text>

          {/* <variant
            variant={{ name: "size", val: ["small", "large"] }}
            setvariant={setvariant}
            variants={variant}
          /> */}
          {data.variants.map((item, index) => {
            return (
              <Variant
                key={index}
                variant={item}
                setvariant={setvariant}
                variants={variant}
              />
            );
          })}
          <Shipping
            shippingType={data.deliveryTime}
            cost={data.deliveryCost}
            cur={data.currency}
          />
        </View>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          paddingVertical: 5,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 6,
          paddingBottom: 10,
          backgroundColor: Colors.bg,
        }}
      >
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: Colors.primary,
            paddingHorizontal: 6,
            paddingVertical: 10,
            borderRadius: 8,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "49%",
            alignItems: "center",
          }}
          onPress={handleAddToCart}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "semi",
              fontSize: 18,
              color: Colors.primary,
            }}
          >
            Add to Cart
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            paddingHorizontal: 6,
            paddingVertical: 10,
            width: "49%",
            borderRadius: 8,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "semi",
              fontSize: 18,
              color: Colors.bg,
            }}
          >
            CheckOut
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Product;

const Shipping = ({ shippingType, cost, cur }) => {
  const [state, setState] = useState(false);
  return (
    <View
      style={{
        width: "100%",
        borderWidth: 0.5,
        borderColor: Colors.primary,
        minHeight: 50,
        borderRadius: 20,
        paddingHorizontal: 20,
        marginTop: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setState((prev) => !prev);
        }}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 50,
        }}
      >
        <Text
          style={{
            fontFamily: "light",
            fontSize: 18,
          }}
        >
          Shipping
        </Text>

        <MaterialIcons
          name={state ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      {state && (
        <View class="flex flex-col gap-2">
          <Text
            style={{
              fontFamily: "light",
              fontSize: 18,
            }}
          >
            Shipping Time: {shippingType}
          </Text>

          <Text
            style={{
              fontFamily: "light",
              fontSize: 18,
            }}
          >
            Shipping Cost: {cur} {cost}
          </Text>
        </View>
      )}
    </View>
  );
};
const Variant = ({ variant, setvariant, variants }) => {
  const updateVar = (varVal) => {
    setvariant((prev) => ({
      ...prev,
      [variant.name]: varVal,
    }));
  };

  const [state, setState] = useState(false);

  return (
    <View
      style={{
        width: "100%",
        borderWidth: 0.5,
        borderColor: Colors.primary,
        minHeight: 50,
        borderRadius: 20,
        paddingHorizontal: 20,
        marginTop: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => setState((prev) => !prev)}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 50,
        }}
      >
        <Text
          style={{
            fontFamily: "light",
            fontSize: 18,
          }}
        >
          {variant.name}{" "}
          {variants[variant.name] && `: ${variants[variant.name]}`}
        </Text>
        <MaterialIcons
          name={state ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      {state && (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {variant.vals.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                paddingVertical: 15,
                borderTopColor: Colors.secondary + "4d",
                borderBottomColor: Colors.secondary + "4d",
                borderTopWidth: 1,
                width: "100%",
              }}
              onPress={() => {
                updateVar(item);
                setState(false);
              }}
            >
              <Text
                style={{
                  fontFamily:
                    variants[variant.name] === item ? "semi" : "light",
                  fontSize: 18,
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
