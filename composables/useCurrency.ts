/**
 * Currency formatting composable.
 *
 * Bulgaria uses the euro since January 1, 2026: prices are stored and shown
 * in EUR only.
 */

// Free shipping threshold in EUR
export const FREE_SHIPPING_EUR = 60;

/**
 * Format a number as EUR currency
 */
export const formatEur = (amount: number): string => {
    return `€${amount.toFixed(2)}`;
};

/**
 * Format a price in EUR, tolerating missing values
 */
export const formatMoney = (priceInEur: number): string => {
    if (priceInEur === null || priceInEur === undefined || isNaN(priceInEur)) {
        return formatEur(0);
    }
    return formatEur(priceInEur);
};

/**
 * Vue composable for currency operations
 */
export const useCurrency = () => {
    return {
        FREE_SHIPPING_EUR,
        formatEur,
        formatMoney,
    };
};

export default useCurrency;
