/**
 * Currency formatting composable for dual EUR/BGN display
 * Bulgaria Euro adoption regulation compliance
 *
 * Fixed conversion rate: 1 EUR = 1.95583 BGN
 */

// Fixed conversion rate (official Bulgarian Euro adoption rate)
export const EUR_TO_BGN_RATE = 1.95583;

// Free shipping threshold in BGN
export const FREE_SHIPPING_BGN = 110;
export const FREE_SHIPPING_EUR = FREE_SHIPPING_BGN / EUR_TO_BGN_RATE;

/**
 * Convert BGN to EUR
 */
export const bgnToEur = (bgn: number): number => {
    return bgn / EUR_TO_BGN_RATE;
};

/**
 * Convert EUR to BGN
 */
export const eurToBgn = (eur: number): number => {
    return eur * EUR_TO_BGN_RATE;
};

/**
 * Format a number as EUR currency
 */
export const formatEur = (amount: number): string => {
    return `€${amount.toFixed(2)}`;
};

/**
 * Format a number as BGN currency
 */
export const formatBgn = (amount: number): string => {
    return `${amount.toFixed(2)} лв`;
};

/**
 * Format price in dual currency (EUR primary, BGN secondary)
 * Input is assumed to be in BGN (as stored in DB)
 *
 * @param priceInBgn - The price in BGN
 * @param compact - If true, returns multiline format for compact spaces
 * @returns Formatted dual currency string
 */
export const formatDualPrice = (priceInBgn: number, compact = false): string => {
    if (priceInBgn === null || priceInBgn === undefined || isNaN(priceInBgn)) {
        return '€0.00 (0.00 лв)';
    }

    const eur = bgnToEur(priceInBgn);
    const eurFormatted = formatEur(eur);
    const bgnFormatted = formatBgn(priceInBgn);

    if (compact) {
        return `${eurFormatted}\n(${bgnFormatted})`;
    }

    return `${eurFormatted} (${bgnFormatted})`;
};

/**
 * Format the free shipping threshold in dual currency
 */
export const formatFreeShippingThreshold = (): string => {
    return formatDualPrice(FREE_SHIPPING_BGN);
};

/**
 * Vue composable for currency operations
 */
export const useCurrency = () => {
    return {
        EUR_TO_BGN_RATE,
        FREE_SHIPPING_BGN,
        FREE_SHIPPING_EUR,
        bgnToEur,
        eurToBgn,
        formatEur,
        formatBgn,
        formatDualPrice,
        formatFreeShippingThreshold,
    };
};

export default useCurrency;
