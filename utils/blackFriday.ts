/**
 * Single on/off switch for all Black Friday UI (the homepage banner and the
 * top-bar promo text). Set to `false` to remove the Black Friday look from the
 * whole site in one line.
 *
 * NOTE: the actual price discount + the free-keychain gift live in the backend:
 *   - Prices: run `node scripts/revertBlackFriday2026.js` in the server repo to
 *     restore the original prices (clears the strikethrough everywhere).
 *   - Gift: turns itself off automatically once prices are reverted.
 * So to fully end Black Friday: set BLACK_FRIDAY_ACTIVE = false AND run the
 * revert script.
 */
export const BLACK_FRIDAY_ACTIVE = true;
