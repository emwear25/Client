import { ref } from "vue";

export interface Discount {
  discountId: string;
  name: string;
  type: "percentage" | "fixed_amount" | "buy_x_get_y" | "free_shipping";
  value: number;
  amount: number;
  scope: string;
  code?: string;
}

export interface DiscountCalculationResult {
  discounts: Discount[];
  discountTotal: number;
  subtotalBeforeDiscount: number;
  subtotal: number;
}

export const useDiscount = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Validate a coupon code
   */
  const validateCoupon = async (
    code: string
  ): Promise<{ valid: boolean; discountPercentage?: number; message?: string }> => {
    loading.value = true;
    error.value = null;

    try {
      const response: any = await $fetch(`/api/coupons/validate/${code}`, {
        method: "GET",
      });

      if (response.success && response.data) {
        return {
          valid: true,
          discountPercentage: response.data.discountPercentage,
        };
      }

      return {
        valid: false,
        message: response.message || "Невалиден код за отстъпка",
      };
    } catch (err: any) {
      // Extract error message from response
      const message = err.data?.message || err.message || "Невалиден код за отстъпка";
      error.value = message;
      return {
        valid: false,
        message,
      };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Calculate cart discounts
   */
  const calculateCartDiscounts = async (
    items: any[],
    couponCode?: string
  ): Promise<DiscountCalculationResult | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch("/api/discounts/calculate", {
        method: "POST",
        body: {
          items,
          couponCode,
        },
      });

      if (response.success) {
        return response.data;
      }

      throw new Error(response.message || "Failed to calculate discounts");
    } catch (err: any) {
      const message = err.data?.message || "Failed to calculate discounts";
      error.value = message;
      console.error("Error calculating discounts:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get active discounts for display
   */
  const getActiveDiscounts = async (scope?: string): Promise<Discount[]> => {
    loading.value = true;
    error.value = null;

    try {
      const params = scope ? { scope } : {};
      const response = await $fetch("/api/discounts/active", {
        params,
      });

      if (response.success) {
        return response.data;
      }

      return [];
    } catch (err: any) {
      error.value = err.data?.message || "Failed to fetch active discounts";
      console.error("Error fetching active discounts:", err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Format discount for display
   */
  const formatDiscount = (discount: Discount): string => {
    switch (discount.type) {
      case "percentage":
        return `${discount.value}% отстъпка`;
      case "fixed_amount":
        return `${discount.value.toFixed(2)} лв. отстъпка`;
      case "free_shipping":
        return "Безплатна доставка";
      case "buy_x_get_y":
        return discount.name;
      default:
        return discount.name;
    }
  };

  /**
   * Calculate discount percentage saved
   */
  const calculateSavingsPercentage = (
    subtotalBeforeDiscount: number,
    discountTotal: number
  ): number => {
    if (subtotalBeforeDiscount === 0) return 0;
    return Math.round((discountTotal / subtotalBeforeDiscount) * 100);
  };

  return {
    loading,
    error,
    validateCoupon,
    calculateCartDiscounts,
    getActiveDiscounts,
    formatDiscount,
    calculateSavingsPercentage,
  };
};
