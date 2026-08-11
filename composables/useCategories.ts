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

  // Nested category tree (roots with `children`) for the two-level navigation
  const categoryTree = useState<any[]>("categories-tree", () => []);
  const treeLoaded = useState<boolean>("categories-tree-loaded", () => false);
  const treePromise = useState<Promise<any> | null>("categories-tree-promise", () => null);

  const fetchCategoryTree = async () => {
    if (treeLoaded.value && categoryTree.value.length > 0) {
      return categoryTree.value;
    }
    if (treePromise.value) {
      return treePromise.value;
    }

    const api = useApi();
    treePromise.value = (async () => {
      try {
        const response = await api.get<{ success: boolean; data: any[] }>("categories/tree");
        if (response && response.success) {
          categoryTree.value = response.data || [];
          treeLoaded.value = true;
          return categoryTree.value;
        }
        return [];
      } catch (err) {
        console.error("Error fetching category tree:", err);
        return [];
      } finally {
        treePromise.value = null;
      }
    })();

    return treePromise.value;
  };

  return {
    categories: readonly(categories),
    categoryTree: readonly(categoryTree),
    isLoading: readonly(isLoading),
    fetchCategories,
    fetchCategoryTree,
  };
};

