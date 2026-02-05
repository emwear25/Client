/**
 * Shipping Calculation Composable
 *
 * Handles shipping weight and dimension calculations for Econt and Speedy
 * with proper volumetric weight, dimension limits, and carrier-specific rules.
 */

export interface CartItemForShipping {
  quantity: number;
  weight?: number;
  category?: {
    defaultWeight?: number;
    defaultDimensions?: {
      length: number;
      width: number;
      height: number;
    };
  };
}

export interface ShippingDimensions {
  length: number;
  width: number;
  height: number;
}

export interface ShippingCalculationResult {
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  dimensions: ShippingDimensions;
  warnings: string[];
  isValid: boolean;
  exceedsLimits: boolean;
}

// Carrier dimension limits (in cm)
export const CARRIER_LIMITS = {
  econt: {
    standard: { maxLength: 90, maxWidth: 90, maxHeight: 90, maxWeight: 50 },
    nonStandard: { maxLength: 200, maxWidth: 200, maxHeight: 200, maxWeight: 100 },
  },
  speedy: {
    standard: { maxLength: 120, maxWidth: 80, maxHeight: 80, maxWeight: 50 },
    apt: { maxLength: 60, maxWidth: 35, maxHeight: 37, maxWeight: 20 }, // Automat limits
  },
} as const;

// Default dimensions and weight when category data is missing
const DEFAULTS = {
  weight: 0.5, // kg
  dimensions: { length: 40, width: 30, height: 15 }, // cm
  minWeight: 0.5, // Minimum chargeable weight
};

// Maximum stacking height before splitting into multiple parcels
const MAX_SINGLE_PARCEL_HEIGHT = 60; // cm - fits all delivery methods

/**
 * Calculate volumetric weight using carrier formulas
 * Econt: L × W × H / 6000 (standard divisor)
 * Speedy: L × W × H / 5000 (equivalent to m³ × 200)
 */
function calculateVolumetricWeight(
  dimensions: ShippingDimensions,
  carrier: 'econt' | 'speedy'
): number {
  const { length, width, height } = dimensions;
  const volumeCm3 = length * width * height;

  // Speedy: 1 m³ = 200 kg → divisor = 5000
  // Econt: Standard divisor = 6000
  const divisor = carrier === 'speedy' ? 5000 : 6000;

  return volumeCm3 / divisor;
}

/**
 * Get dimension limits based on carrier and delivery method
 */
function getDimensionLimits(
  carrier: 'econt' | 'speedy',
  deliveryMethod: string
): { maxLength: number; maxWidth: number; maxHeight: number; maxWeight: number } {
  if (carrier === 'speedy' && deliveryMethod === 'speedy_apt') {
    return CARRIER_LIMITS.speedy.apt;
  }
  if (carrier === 'speedy') {
    return CARRIER_LIMITS.speedy.standard;
  }
  return CARRIER_LIMITS.econt.standard;
}

/**
 * Calculate stacked dimensions from cart items
 * Items are stacked height-wise in a single box
 */
function calculateStackedDimensions(items: CartItemForShipping[]): ShippingDimensions {
  let maxLength = 0;
  let maxWidth = 0;
  let totalHeight = 0;

  items.forEach((item) => {
    const dims = item.category?.defaultDimensions || DEFAULTS.dimensions;
    const quantity = item.quantity || 1;

    // Track the largest length and width (box footprint)
    maxLength = Math.max(maxLength, dims.length);
    maxWidth = Math.max(maxWidth, dims.width);

    // Stack heights
    totalHeight += dims.height * quantity;
  });

  // Ensure minimum dimensions
  return {
    length: Math.max(maxLength, DEFAULTS.dimensions.length),
    width: Math.max(maxWidth, DEFAULTS.dimensions.width),
    height: Math.max(totalHeight, DEFAULTS.dimensions.height),
  };
}

/**
 * Calculate total actual weight from cart items
 */
function calculateActualWeight(items: CartItemForShipping[]): number {
  return items.reduce((total, item) => {
    const itemWeight = item.category?.defaultWeight || item.weight || DEFAULTS.weight;
    return total + itemWeight * (item.quantity || 1);
  }, 0);
}

/**
 * Apply dimension caps to prevent exceeding carrier limits
 */
function applyDimensionCaps(
  dimensions: ShippingDimensions,
  limits: { maxLength: number; maxWidth: number; maxHeight: number }
): { capped: ShippingDimensions; wasCapped: boolean } {
  const wasCapped =
    dimensions.length > limits.maxLength ||
    dimensions.width > limits.maxWidth ||
    dimensions.height > limits.maxHeight;

  return {
    capped: {
      length: Math.min(dimensions.length, limits.maxLength),
      width: Math.min(dimensions.width, limits.maxWidth),
      height: Math.min(dimensions.height, limits.maxHeight),
    },
    wasCapped,
  };
}

/**
 * Main shipping calculation function
 */
export function useShippingCalculation() {
  /**
   * Calculate shipping parameters for given cart items and delivery method
   */
  const calculateShipping = (
    items: CartItemForShipping[],
    carrier: 'econt' | 'speedy',
    deliveryMethod: string
  ): ShippingCalculationResult => {
    const warnings: string[] = [];

    if (!items || items.length === 0) {
      return {
        actualWeight: 0,
        volumetricWeight: 0,
        chargeableWeight: 0,
        dimensions: DEFAULTS.dimensions,
        warnings: ['Количката е празна'],
        isValid: false,
        exceedsLimits: false,
      };
    }

    // Get limits for this delivery method
    const limits = getDimensionLimits(carrier, deliveryMethod);

    // Calculate actual weight
    const actualWeight = calculateActualWeight(items);

    // Calculate stacked dimensions
    let dimensions = calculateStackedDimensions(items);

    // Check if dimensions exceed limits
    let exceedsLimits = false;

    // Check height against single parcel limit
    if (dimensions.height > MAX_SINGLE_PARCEL_HEIGHT) {
      warnings.push(
        `Височината (${dimensions.height}cm) надвишава препоръчителния лимит (${MAX_SINGLE_PARCEL_HEIGHT}cm). ` +
        `Може да се наложи изпращане в няколко пакета.`
      );
    }

    // Check against carrier limits
    if (dimensions.length > limits.maxLength) {
      warnings.push(`Дължината (${dimensions.length}cm) надвишава лимита на куриера (${limits.maxLength}cm)`);
      exceedsLimits = true;
    }
    if (dimensions.width > limits.maxWidth) {
      warnings.push(`Ширината (${dimensions.width}cm) надвишава лимита на куриера (${limits.maxWidth}cm)`);
      exceedsLimits = true;
    }
    if (dimensions.height > limits.maxHeight) {
      warnings.push(`Височината (${dimensions.height}cm) надвишава лимита на куриера (${limits.maxHeight}cm)`);
      exceedsLimits = true;
    }
    if (actualWeight > limits.maxWeight) {
      warnings.push(`Теглото (${actualWeight.toFixed(2)}kg) надвишава лимита на куриера (${limits.maxWeight}kg)`);
      exceedsLimits = true;
    }

    // Apply dimension caps for API request (to avoid API errors)
    const { capped: cappedDimensions } = applyDimensionCaps(dimensions, limits);

    // Use capped dimensions for calculation but keep original for warnings
    const dimsForCalculation = exceedsLimits ? cappedDimensions : dimensions;

    // Calculate volumetric weight
    const volumetricWeight = calculateVolumetricWeight(dimsForCalculation, carrier);

    // Determine chargeable weight
    // Speedy: Uses actual weight if ≤7kg (exemption), otherwise max(actual, volumetric)
    // Econt: Always uses max(actual, volumetric)
    let chargeableWeight: number;

    if (carrier === 'speedy' && actualWeight <= 7) {
      // Speedy exemption: parcels ≤7kg are charged by actual weight
      chargeableWeight = actualWeight;
    } else {
      // Standard rule: charge the higher of actual vs volumetric
      chargeableWeight = Math.max(actualWeight, volumetricWeight);
    }

    // Enforce minimum weight
    chargeableWeight = Math.max(chargeableWeight, DEFAULTS.minWeight);

    // Special validation for Speedy APT
    if (deliveryMethod === 'speedy_apt') {
      const aptLimits = CARRIER_LIMITS.speedy.apt;
      if (
        dimensions.length > aptLimits.maxLength ||
        dimensions.width > aptLimits.maxWidth ||
        dimensions.height > aptLimits.maxHeight
      ) {
        warnings.push(
          `Пратката е твърде голяма за автомат (макс. ${aptLimits.maxLength}×${aptLimits.maxWidth}×${aptLimits.maxHeight}cm). ` +
          `Моля, изберете офис или доставка до адрес.`
        );
        exceedsLimits = true;
      }
    }

    return {
      actualWeight: Math.round(actualWeight * 100) / 100,
      volumetricWeight: Math.round(volumetricWeight * 100) / 100,
      chargeableWeight: Math.round(chargeableWeight * 100) / 100,
      dimensions: dimsForCalculation,
      warnings,
      isValid: !exceedsLimits || warnings.length === 0,
      exceedsLimits,
    };
  };

  /**
   * Format dimensions for display
   */
  const formatDimensions = (dims: ShippingDimensions): string => {
    return `${dims.length} × ${dims.width} × ${dims.height} cm`;
  };

  /**
   * Get a human-readable summary of the shipping calculation
   */
  const getShippingSummary = (result: ShippingCalculationResult, carrier: 'econt' | 'speedy'): string => {
    const lines = [
      `Размери: ${formatDimensions(result.dimensions)}`,
      `Реално тегло: ${result.actualWeight.toFixed(2)} kg`,
      `Обемно тегло: ${result.volumetricWeight.toFixed(2)} kg`,
    ];

    if (carrier === 'speedy' && result.actualWeight <= 7) {
      lines.push(`Таксувано тегло: ${result.chargeableWeight.toFixed(2)} kg (по реално тегло ≤7kg)`);
    } else if (result.volumetricWeight > result.actualWeight) {
      lines.push(`Таксувано тегло: ${result.chargeableWeight.toFixed(2)} kg (по обемно тегло)`);
    } else {
      lines.push(`Таксувано тегло: ${result.chargeableWeight.toFixed(2)} kg`);
    }

    return lines.join('\n');
  };

  return {
    calculateShipping,
    formatDimensions,
    getShippingSummary,
    CARRIER_LIMITS,
    DEFAULTS,
  };
}
