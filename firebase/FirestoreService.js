// FirestoreService.js
import { db } from "@/firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  query,
  where,
} from "firebase/firestore";

export const addData = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    // //  console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};
export const addDataByID = async (
  collectionName,
  docId,
  data,
  update = true
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    // //  console.log(update);
    if (!update && docSnap.exists()) {
      // //  console.log("Exists");
      return null;
    }
    await setDoc(docRef, data, { merge: true });
    // await db.collection(collectionName).doc(docId).set(data);
    // //  console.log("Document successfully written/updated with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding/updating document: ", error);
  }
};

export const getData = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const dataArray = [];

    querySnapshot.forEach((doc) => {
      dataArray.push({ id: doc.id, ...doc.data() });
    });

    return dataArray;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
};

export const getRecommendationData = async (userInterests) => {
  const queries = [];
  console.log(userInterests);
  // Search in name field
  for (const interest of userInterests) {
    const q = query(
      collection(db, "products"),
      where("name", ">=", interest),
      where("name", "<=", interest + "\uf8ff")
    );
    queries.push(await getDocs(q));
  }

  // Search in categories field
  const categoriesQuery = query(
    collection(db, "products"),
    where("category", "array-contains-any", userInterests)
  );
  queries.push(await getDocs(categoriesQuery));

  // Search in keywords field
  const keywordsQuery = query(
    collection(db, "products"),
    where("keywords", "array-contains-any", userInterests)
  );
  queries.push(await getDocs(keywordsQuery));

  // Search in description field
  for (const interest of userInterests) {
    const q = query(
      collection(db, "products"),
      where("shortDescription", ">=", interest),
      where("shortDescription", "<=", interest + "\uf8ff")
    );
    queries.push(await getDocs(q));
  }

  // Execute all queries
  const results = await Promise.all(queries);

  // Combine and deduplicate results
  const productSet = new Set();
  results.forEach((result) => {
    result.docs.forEach((doc) => {
      productSet.add(doc.id);
    });
  });

  return Array.from(productSet);
};

export const getIDData = async (collectionName, queryParams = []) => {
  try {
    let q;

    // If queryParams are provided, build the query
    if (queryParams.length > 0) {
      const conditions = queryParams.map((param) => {
        const { field, operator, value } = param;
        return where(field, operator, value);
      });
      q = query(collection(db, collectionName), ...conditions);
    } else {
      // If no queryParams, get all documents in the collection
      q = collection(db, collectionName);
    }

    const querySnapshot = await getDocs(q);
    const dataArray = [];

    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    return dataArray;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
};

export const queryDoc = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // //  console.log({ id: docSnap.id, ...docSnap.data() });
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // //  console.log("No such document!");
      return null;
    }
  } catch (error) {
    // //  console.log({ collectionName, docId });
    console.error("Error getting document:", error);
    return null;
  }
};

export const deleteData = async (collection, id) => {
  try {
    await deleteDoc(doc(db, collection, id));
    // //  console.log("Document successfully deleted!");
  } catch (error) {
    console.error("Error removing document: ", error);
  }
};
