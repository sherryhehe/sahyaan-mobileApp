import { db } from "@/firebase/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";

export async function addTowishList(userId, productId) {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    wishlist: arrayUnion(productId),
  });
}
export async function removeFromWishlist(userId, productId) {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    wishlist: arrayRemove(productId),
  });
}
export async function addToCart(userId, productId, amount = 1, variants) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  const cart = docSnap.data().cart;

  const existingItem = cart.find(
    (item) =>
      item.id === productId &&
      JSON.stringify(item.variants) === JSON.stringify(variants),
  );

  if (existingItem) {
    throw new Error("Item with same variants already added to cart");
  } else {
    await updateDoc(docRef, {
      cart: arrayUnion({ id: productId, count: amount, variants: variants }),
    });
  }
}

export async function addToInterest(userId, interest) {
  const docRef = doc(db, "users", userId);

  let interestsToAdd = Array.isArray(interest)
    ? interest.flatMap((item) =>
        typeof item === "string" ? item.split(/\s+/) : item,
      )
    : typeof interest === "string"
      ? interest.split(/\s+/)
      : [interest];

  interestsToAdd = [...new Set(interestsToAdd)].filter(Boolean);

  // Get the current interests
  const docSnap = await getDoc(docRef);
  const currentInterests = docSnap.data()?.interest || [];

  // Filter out interests that already exist
  const newInterests = interestsToAdd.filter(
    (item) => !currentInterests.includes(item),
  );

  if (newInterests.length > 0) {
    await updateDoc(docRef, {
      interest: arrayUnion(...newInterests),
    });
    console.log("ADDED NEW INTERESTS", newInterests);
    return true;
  } else {
    console.log("NO NEW INTERESTS ADDED");
    return false;
  }
}

export function removeToCart(userId, productId, amount = 0) {}
