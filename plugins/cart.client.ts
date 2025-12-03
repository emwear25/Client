import { useCartStore } from "~/stores/cart";
import { useWishlist } from "~/stores/useWishlist";

export default defineNuxtPlugin(() => {
  const cartStore = useCartStore();
  const wishlistStore = useWishlist();

  // Load cart and wishlist from localStorage
  cartStore.load();
  wishlistStore.load();

  console.log("[Cart Plugin] Cart items loaded:", cartStore.items.length);
  console.log("[Wishlist Plugin] Wishlist items loaded:", wishlistStore.ids.length);
});
