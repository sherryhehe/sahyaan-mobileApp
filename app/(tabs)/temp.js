import React from "react";
import { View, Button, Image } from "react-native";
import { db } from "@/firebase/firebase";
import { uploadFile } from "@/firebase/StorageService";
import { CustomText as Text } from "@/components/CustomText";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { logout } from "../../firebase/auth/AuthService";
import { useRouter } from "expo-router";
import { useUser } from "../../firebase/UserContext";
import Loading from "../../components/Loading";
import { Colors } from "@/constants/Colors";
import TempImage from "@/image.jpg";
// import { Image } from "expo-image";
const AddDummyData = () => {
  const { user, loading } = useUser();
  const router = useRouter();

  console.log(Image.resolveAssetSource(TempImage).uri);
  const addData = async () => {
    try {
      // Add a dummy brand
      /* const brandRef1 = await addDoc(collection(db, "brands"), {
        name: "Brand ABC",
        category: "Electronics",
        products: [],
      });
      const brandRef2 = await addDoc(collection(db, "brands"), {
        name: "Brand XYZ",
        category: "Electronics",
        products: [],
      }); */

      // Add a dummy product
      for (let index = 2; index < 20; index++) {
        const productRef = await addDoc(collection(db, "products"), {
          name: `Item ${index}`,
          category: ["Electronics", index % 2 == 0 ? "PQR" : "ABC"],
          productType: "Gadget",
          price: 299.99,
          shortDescription: "A short description of Product ABC.",
          deliveryTime: "3-5 business days",
          returns: "30 days return policy",
          rating: [4.1, 300],
          sold: 500,
          sale: 0,
          seller: "njtG0KF7uEhrpMn8crNqbzjgKmj1",
          brand: index % 2 == 0 ? "Bonanza" : "Outfitters",
          keywords: [`keyword ${index}`],
          variants: [
            { name: "size", vals: ["small", "large", "x-large"] },
            {
              name: "color",
              vals: ["red", "blue", "green"],
            },
          ],
          specs: [{ name: "material", value: "cotton" }],
          // variants: {
          //   size: ["small", "large", "x-large"],
          //   color: ["red", "blue", "green"],
          // },
        });

        const imageFiles = [TempImage, TempImage, TempImage];
        // const imageFiles = [
        //   require("@/image.jpg"),
        //   require("@/image.jpg"),
        //   require("@/image.jpg"),
        // ];
        const imageUrls = await Promise.all(
          imageFiles.map(async (image, i) => {
            const filePath = `images/products/${productRef.id}/${i}.jpg`;
            const imageData = await fetch(Image.resolveAssetSource(image).uri);
            //console.log(imageData.blob());
            await uploadFile(await imageData.blob(), filePath);
            return filePath;
          }),
        );
        await updateDoc(productRef, {
          images: imageUrls,
          /* images: [
            "https://firebasestorage.googleapis.com/v0/b/sahyan-shop.appspot.com/o/images%2Fproducts%2FDj0pDUbrxhFyOhbnb3Jt%2Fimage.jpg?alt=media&token=6bde6a2e-cde3-497e-9836-eac937ad43eb",
            "https://firebasestorage.googleapis.com/v0/b/sahyan-shop.appspot.com/o/images%2Fproducts%2FDj0pDUbrxhFyOhbnb3Jt%2Fimage.jpg?alt=media&token=6bde6a2e-cde3-497e-9836-eac937ad43eb",
            "https://firebasestorage.googleapis.com/v0/b/sahyan-shop.appspot.com/o/images%2Fproducts%2FDj0pDUbrxhFyOhbnb3Jt%2Fimage.jpg?alt=media&token=6bde6a2e-cde3-497e-9836-eac937ad43eb",
          ], */
        });

        // Update the brand with the product ID
        await updateDoc(doc(db, "seller", "njtG0KF7uEhrpMn8crNqbzjgKmj1"), {
          products: arrayUnion(productRef.id),
        });
        if (index % 2 == 0) {
          await updateDoc(doc(db, "promotions", "products"), {
            bottom: arrayUnion(productRef.id),
          });
        } else {
          // await updateDoc(brandRef2, {
          //   products: arrayUnion(productRef.id),
          // });

          await updateDoc(doc(db, "promotions", "products"), {
            top: arrayUnion(productRef.id),
            bottom: arrayUnion(productRef.id),
          });
        }
      }

      // //  console.log("Dummy data added successfully");
    } catch (error) {
      console.error("Error adding dummy data:", error);
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: Colors.bg }}>
      <Button title="Add Dummy Data" onPress={addData} />
      <Button
        title="Logut"
        onPress={async () => {
          await logout();
          router.replace("/login");
        }}
      />
      <Text>{user && user.displayName}</Text>
      <Image source={TempImage} />
      {user &&
        user.wishlist &&
        user.wishlist.map((item) => <Text key={item}>{item}</Text>)}
      <Loading />
    </View>
  );
};

export default AddDummyData;
