/**
 * Currency formatting composable for dual EUR/BGN display
 * Bulgaria Euro adoption regulation compliance (January 1, 2026)
 *
 * Since Bulgaria adopted EUR, database now stores prices in EUR directly.
 * BGN is shown alongside for the regulatory transition period.
 * Fixed conversion rate: 1 EUR = 1.95583 BGN
 */

// Fixed conversion rate (official Bulgarian Euro adoption rate)
export const EUR_TO_BGN_RATE = 1.95583;

// Free shipping threshold in EUR (was 110 BGN ≈ 56.25 EUR, rounded to 55 EUR)
export const FREE_SHIPPING_EUR = 55;
export const FREE_SHIPPING_BGN = FREE_SHIPPING_EUR * EUR_TO_BGN_RATE;

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
 * Input is now in EUR (as stored in DB since January 1, 2026)
 *
 * @param priceInEur - The price in EUR
 * @param compact - If true, returns multiline format for compact spaces
 * @returns Formatted dual currency string
 */
export const formatDualPrice = (priceInEur: number, compact = false): string => {
    if (priceInEur === null || priceInEur === undefined || isNaN(priceInEur)) {
        return '€0.00 (0.00 лв)';
    }

    const eurFormatted = formatEur(priceInEur);
    const bgnFormatted = formatBgn(eurToBgn(priceInEur));

    if (compact) {
        return `${eurFormatted}\n(${bgnFormatted})`;
    }

    return `${eurFormatted} (${bgnFormatted})`;
};

/**
 * Format the free shipping threshold in dual currency
 */
export const formatFreeShippingThreshold = (): string => {
    return formatDualPrice(FREE_SHIPPING_EUR);
};

/**
 * Vue composable for currency operations
 */
export const useCurrency = () => {
    return {
        EUR_TO_BGN_RATE,
        FREE_SHIPPING_EUR,
        FREE_SHIPPING_BGN,
        eurToBgn,
        formatEur,
        formatBgn,
        formatDualPrice,
        formatFreeShippingThreshold,
    };
};

export default useCurrency;
