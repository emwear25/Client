# Facebook Pixel Usage Examples

## 1. Product Detail Page (ViewContent)

```vue
<!-- pages/products/[id].vue -->
<script setup lang="ts">
const route = useRoute();
const { trackViewContent } = useFacebookPixel();

// Fetch product data
const { data: product } = await useFetch(`/api/products/${route.params.id}`);

// Track ViewContent when product loads
onMounted(() => {
  if (product.value) {
    trackViewContent({
      id: product.value._id,
      name: product.value.name,
      price: product.value.price,
      category: product.value.category?.name,
    });
  }
});
</script>
```

## 2. Add to Cart Button (AddToCart)

```vue
<!-- components/ProductCard.vue -->
<script setup lang="ts">
const { trackAddToCart } = useFacebookPixel();
const cartStore = useCartStore();

const props = defineProps<{
  product: {
    _id: string;
    name: string;
    price: number;
  };
}>();

const addToCart = () => {
  // Add to cart
  cartStore.addItem(props.product);
  
  // Track Facebook Pixel event
  trackAddToCart({
    id: props.product._id,
    name: props.product.name,
    price: props.product.price,
    quantity: 1,
  });
};
</script>

<template>
  <button @click="addToCart">Add to Cart</button>
</template>
```

## 3. Checkout Page (InitiateCheckout)

```vue
<!-- pages/checkout.vue -->
<script setup lang="ts">
const { trackInitiateCheckout } = useFacebookPixel();
const cartStore = useCartStore();

onMounted(() => {
  // Track when user reaches checkout
  trackInitiateCheckout({
    value: cartStore.total,
    items: cartStore.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    })),
  });
});
</script>
```

## 4. Order Success Page (Purchase)

```vue
<!-- pages/checkout/success.vue -->
<script setup lang="ts">
const route = useRoute();
const { trackPurchase } = useFacebookPixel();

// Get order data from query params or API
const orderId = route.query.orderId as string;

const { data: order } = await useFetch(`/api/orders/${orderId}`);

onMounted(() => {
  if (order.value) {
    trackPurchase({
      orderId: order.value._id,
      total: order.value.total,
      items: order.value.items.map((item: any) => ({
        id: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }
});
</script>
```

## 5. Search Functionality (Search)

```vue
<!-- components/SearchBar.vue -->
<script setup lang="ts">
const { trackSearch } = useFacebookPixel();
const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Track search
    trackSearch(searchQuery.value);
    
    // Navigate to search results
    navigateTo(`/products?search=${searchQuery.value}`);
  }
};
</script>
```

## 6. Add to Wishlist (AddToWishlist)

```vue
<!-- components/WishlistButton.vue -->
<script setup lang="ts">
const { trackAddToWishlist } = useFacebookPixel();
const wishlistStore = useWishlist();

const props = defineProps<{
  product: {
    _id: string;
    name: string;
    price: number;
  };
}>();

const addToWishlist = () => {
  wishlistStore.toggle(props.product._id);
  
  trackAddToWishlist({
    id: props.product._id,
    name: props.product.name,
    price: props.product.price,
  });
};
</script>
```

## 7. Custom Events

```vue
<script setup lang="ts">
const { trackCustomEvent } = useFacebookPixel();

// Track newsletter signup
const subscribeNewsletter = (email: string) => {
  trackCustomEvent('NewsletterSignup', {
    email: email,
  });
};

// Track product review
const submitReview = (productId: string, rating: number) => {
  trackCustomEvent('ProductReview', {
    product_id: productId,
    rating: rating,
  });
};
</script>
```

## Nuxt Config Setup

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        // Facebook domain verification
        {
          name: 'facebook-domain-verification',
          content: 'YOUR_VERIFICATION_CODE_HERE',
        },
      ],
      noscript: [
        // Fallback pixel for users with JavaScript disabled
        {
          innerHTML: '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1363872864704654&ev=PageView&noscript=1" />',
        },
      ],
    },
  },
});
```

## Testing

1. **Check if pixel is loaded:**
   - Open DevTools → Console
   - Type: `window.fbq`
   - Should return a function

2. **Use Facebook Pixel Helper:**
   - Install Chrome extension: "Meta Pixel Helper"
   - Visit your site
   - Check if events are firing correctly

3. **Test in Events Manager:**
   - Go to Facebook Events Manager
   - Check "Test Events" tab
   - Verify events are being received
