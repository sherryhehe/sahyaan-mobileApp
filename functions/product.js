// DataService.js
import { queryDoc, getIDData } from "@/firebase/FirestoreService";
import { getFileUrl } from "@/firebase/StorageService";
import fetchBrandData from "./brand";
import { cacheService } from "@/CacheService";

import { db } from "@/firebase/firebase";
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  orderBy,
} from "firebase/firestore";

export default fetchProductData = async (productId) => {
  try {
    const cachedProduct = await cacheService.get(productId, "products");
    // // //  console.log(`Cache ${cachedProduct}`);
    if (cachedProduct) {
      // // //  console.log("return cache");
      return cachedProduct;
    }

    const productData = await queryDoc("products", productId);
    if (!productData) {
      // //  console.log("Product not found");
      return null;
    }

    // Fetch brand data
    if (productData.brand) {
      productData.brandId = productData.brand;
      const brandData = await fetchBrandData(productData.brand);
      productData.brand = brandData ? brandData.name : "Unknown Brand";
    }

    // Fetch image URLs
    if (productData.images && Array.isArray(productData.images)) {
      const imagePromises = productData.images.map(
        (imagePath) =>
          // getFileUrl(imagePath)
          "https://firebasestorage.googleapis.com/v0/b/sahyan-shop.appspot.com/o/images%2Fproducts%2FDj0pDUbrxhFyOhbnb3Jt%2Fimage.jpg?alt=media&token=6bde6a2e-cde3-497e-9836-eac937ad43eb"
      );
      productData.imageUrls = await Promise.all(imagePromises);
    }
    await cacheService.set(productId, productData, "products");
    // // //  console.log(productData);
    return productData;
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
};

export const getDataPaginated = async (
  collectionName,
  pageSize = 20,
  lastDoc = null
) => {
  try {
    const baseQuery = collection(db, collectionName);
    const orderedQuery = query(baseQuery, orderBy("name"));

    let pageQuery;
    if (lastDoc) {
      pageQuery = query(orderedQuery, startAfter(lastDoc), limit(pageSize));
    } else {
      pageQuery = query(orderedQuery, limit(pageSize));
    }

    const snapshot = await getDocs(pageQuery);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1];
    const hasMore = data.length === pageSize;

    return {
      data,
      lastDoc: newLastDoc,
      hasMore,
    };
  } catch (error) {
    console.error("Error getting documents: ", error);
    return { data: [], lastDoc: null, hasMore: false };
  }
};
// export const getDataPaginatedParallel = async (
//   collectionName,
//   pageSize = 20,
//   lastDoc = null,
//   parallelQueries = 3
// ) => {
//   try {
//     const baseQuery = collection(db, collectionName);
//     const orderedQuery = query(baseQuery, orderBy("name")); // Assuming 'createdAt' field exists

//     const createPageQuery = (startDoc) => {
//       return startDoc
//         ? query(orderedQuery, startAfter(startDoc), limit(pageSize))
//         : query(orderedQuery, limit(pageSize));
//     };

//     const fetchPage = async (startDoc) => {
//       const pageQuery = createPageQuery(startDoc);
//       const snapshot = await getDocs(pageQuery);
//       return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     };

//     let allData = [];
//     let lastDocument = lastDoc;

//     for (let i = 0; i < parallelQueries; i++) {
//       // //  console.log(i);
//       const pageData = await fetchPage(lastDocument);
//       // //  console.log(pageData);
//       allData = [...allData, ...pageData];

//       if (pageData.length < pageSize) {
//         break; // No more data to fetch
//       }

//       lastDocument = pageData[pageData.length - 1];
//     }

//     // Fetch additional data for each product

//     const productPromises = allData.map((product) => fetchProductData(product));
//     allData = await Promise.all(productPromises);

//     return {
//       data: allData,
//       lastDoc: lastDocument,
//       hasMore: allData.length === pageSize * parallelQueries,
//     };
//   } catch (error) {
//     console.error("Error getting documents: ", error);
//     return { data: [], lastDoc: null, hasMore: false };
//   }
// };
