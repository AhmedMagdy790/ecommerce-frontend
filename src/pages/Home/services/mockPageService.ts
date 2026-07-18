// services/mockPageService.ts
import { homeSections } from "../data/homeSections";

export const fetchMockHomePageData = async () => {
  // Simulate network latency for skeleton testing
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  return {
    id: "home-page",
    slug: "home",
    sections: homeSections, // Directly using your imported array
  };
};