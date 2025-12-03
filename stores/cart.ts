import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
  weight?: number; // Weight in kg for shipping calculation (fallback)
  category?: {
    _id: string;
    name: string;
    defaultWeight: number;
    defaultDimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
}

export interface AppliedDiscount {
  discountId: string;
  name: string;
  type: "percentage" | "fixed_amount" | "buy_x_get_y" | "free_shipping";
  value: number;
  amount: number;
  code?: string;
}

const CART_STORAGE_KEY = "emwear-cart";

export const useCartStore = defineStore("cart", () => {
  // State
  const items = ref<CartItem[]>([]);
  const isOpen = ref(false);
  const appliedCoupon = ref<string | null>(null);
  const couponDiscountPercentage = ref(0);
  const appliedDiscounts = ref<AppliedDiscount[]>([]);
  const isCalculatingDiscounts = ref(false);

  // Load cart from localStorage
  const load = () => {
    // Only access localStorage on client side
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          items.value = parsed;
        }
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }
    return items.value;
  };

  // Persist cart to localStorage
  const persist = () => {
    // Only access localStorage on client side
    if (import.meta.client) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value));
      } catch (error) {
        console.error("Failed to persist cart to localStorage:", error);
      }
    }
  };

  // Getters
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const subtotalBeforeDiscount = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0);
  });

  const discountTotal = computed(() => {
    if (couponDiscountPercentage.value > 0) {
      return (subtotalBeforeDiscount.value * couponDiscountPercentage.value) / 100;
    }
    return appliedDiscounts.value.reduce((sum, d) => sum + d.amount, 0);
  });

  const totalPrice = computed(() => {
    return Math.max(0, subtotalBeforeDiscount.value - discountTotal.value);
  });

  const isEmpty = computed(() => items.value.length === 0);

  const hasCoupon = computed(() => appliedCoupon.value !== null);

  const savingsPercentage = computed(() => {
    if (subtotalBeforeDiscount.value === 0) return 0;
    return Math.round((discountTotal.value / subtotalBeforeDiscount.value) * 100);
  });

  // Actions
  const addItem = (product: Omit<CartItem, "quantity">, quantity = 1) => {
    const existingItem = items.value.find(
      (item) => item.id === product.id && item.size === product.size && item.color === product.color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({
        ...product,
        quantity,
      });
    }
    persist();
  };

  const removeItem = (id: string, size?: string, color?: string) => {
    const index = items.value.findIndex(
      (item) => item.id === id && item.size === size && item.color === color
    );

    if (index > -1) {
      items.value.splice(index, 1);
      persist();
    }
  };

  const updateQuantity = (id: string, quantity: number, size?: string, color?: string) => {
    const item = items.value.find(
      (item) => item.id === id && item.size === size && item.color === color
    );

    if (item) {
      if (quantity <= 0) {
        removeItem(id, size, color);
      } else {
        item.quantity = quantity;
        persist();
      }
    }
  };

  const clearCart = () => {
    items.value = [];
    persist();
  };

  const toggleCart = () => {
    isOpen.value = !isOpen.value;
  };

  const openCart = () => {
    isOpen.value = true;
  };

  const closeCart = () => {
    isOpen.value = false;
  };

  /**
   * Apply a coupon code
   */
  const applyCoupon = async (code: string) => {
    if (!code || !code.trim()) {
      throw new Error("Please enter a coupon code");
    }

    if (items.value.length === 0) {
      throw new Error("Your cart is empty");
    }

    try {
      const { useDiscount } = await import("../composables/useDiscount");
      const { validateCoupon } = useDiscount();

      const result = await validateCoupon(code.trim());

      if (!result.valid) {
        throw new Error(result.message || "Invalid coupon code");
      }

      // Apply the coupon
      appliedCoupon.value = code.toUpperCase();
      couponDiscountPercentage.value = result.discountPercentage || 0;

      persist();
      return { success: true, message: "Coupon applied successfully!" };
    } catch (error: any) {
      console.error("Error applying coupon:", error);
      throw error;
    }
  };

  /**
   * Remove applied coupon
   */
  const removeCoupon = () => {
    appliedCoupon.value = null;
    couponDiscountPercentage.value = 0;
    persist();
  };

  /**
   * Calculate discounts for current cart
   */
  const calculateDiscounts = async () => {
    if (items.value.length === 0) {
      appliedDiscounts.value = [];
      return;
    }

    isCalculatingDiscounts.value = true;

    try {
      const { useDiscount } = await import("../composables/useDiscount");
      const { calculateCartDiscounts } = useDiscount();

      // Prepare cart items for API
      const cartItems = items.value.map((item) => ({
        productId: item.id,
        product: item.id,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      const result = await calculateCartDiscounts(cartItems, appliedCoupon.value || undefined);

      if (result) {
        appliedDiscounts.value = result.discounts || [];
      } else {
        appliedDiscounts.value = [];
      }
    } catch (error) {
      console.error("Error calculating discounts:", error);
      appliedDiscounts.value = [];
    } finally {
      isCalculatingDiscounts.value = false;
    }
  };

  return {
    // State
    items,
    isOpen,
    appliedCoupon,
    appliedDiscounts,
    isCalculatingDiscounts,

    // Getters
    itemCount,
    subtotalBeforeDiscount,
    discountTotal,
    totalPrice,
    isEmpty,
    hasCoupon,
    savingsPercentage,

    // Actions
    load,
    persist,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    applyCoupon,
    removeCoupon,
    calculateDiscounts,
  };
});
