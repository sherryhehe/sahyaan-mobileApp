import { queryDoc } from "@/firebase/FirestoreService";
import { cacheService } from "@/CacheService";
export default fetchBrandData = async (brandId) => {
  try {
    const cachedBrand = await cacheService.get(brandId, "brands");
    // // //  console.log(`Cache brand ${cachedProduct}`);
    if (cachedBrand) {
      // // //  console.log("return cache");
      return cachedBrand;
    }
    const brandData = await queryDoc("brands", brandId);
    if (!brandData) {
      // // //  console.log("Brand not found");
      return null;
    }
    return brandData;
  } catch (error) {
    console.error("Error fetching brand data:", error);
    return null;
  }
};
