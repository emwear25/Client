/**
 * Shared composable for fetching categories with products
 * Prevents duplicate API calls by caching the request
 * Uses useState to ensure singleton behavior across components
 */
export const useCategories = () => {
  // Use useState to create shared state across all component instances
  const categories = useState<any[]>("categories-with-products", () => []);
  const isLoading = useState<boolean>("categories-loading", () => false);
  const isLoaded = useState<boolean>("categories-loaded", () => false);
  const loadPromise = useState<Promise<any> | null>("categories-promise", () => null);

  const fetchCategories = async (withProductsOnly = true) => {
    // If already loaded, return cached data
    if (isLoaded.value && categories.value.length > 0) {
      return categories.value;
    }

    // If already loading, return the existing promise
    if (loadPromise.value) {
      return loadPromise.value;
    }

    // Start loading
    isLoading.value = true;
    const api = useApi();

    loadPromise.value = (async () => {
      try {
        const endpoint = withProductsOnly
          ? "categories?withProductsOnly=true"
          : "categories?active=true";
        const response = await api.get<{ success: boolean; data: any[] }>(endpoint);

        if (response && response.success) {
          categories.value = response.data || [];
          isLoaded.value = true;
          return categories.value;
        }
        return [];
      } catch (err) {
        console.error("Error fetching categories:", err);
        categories.value = [];
        return [];
      } finally {
        isLoading.value = false;
        loadPromise.value = null;
      }
    })();

    return loadPromise.value;
  };

  return {
    categories: readonly(categories),
    isLoading: readonly(isLoading),
    fetchCategories,
  };
};
