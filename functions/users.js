import { db } from "@/firebase/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

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
  await updateDoc(docRef, {
    cart: arrayUnion({ id: productId, count: amount, variants: variants }),
  });
}

export async function addToInterest(userId, interest) {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    interest: arrayUnion(interest),
  });
  console.log("ADDED INTEREST", interest);
}

export function editToCart(userId, productId, amount = 1) {}

export function removeToCart(userId, productId, amount = 0) {}
