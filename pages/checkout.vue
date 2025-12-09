<template>
  <div class="checkout">
    <div class="checkout__container">
      <!-- Header -->
      <div class="checkout__header">
        <h1 class="checkout__title">Завършване на поръчка</h1>
        <NuxtLink to="/cart" class="checkout__back-link"> ← Назад към количката </NuxtLink>
      </div>

      <div class="checkout__content">
        <!-- Left Column - Forms -->
        <div class="checkout__forms">
          <!-- Delivery Method Component -->
          <CheckoutDeliveryMethod
            v-model="deliveryValue"
            :selected-office="selectedOffice"
            :selected-speedy-office="selectedSpeedyOffice"
            :selected-city="selectedCity"
            :econt-shipping-cost="econtShippingCost"
            :speedy-shipping-cost="speedyShippingCost"
            :show-econt-iframe="showEcontIframe"
            :show-speedy-iframe="showSpeedyIframe"
            :econt-customer-info-id="econtCustomerInfoId || ''"
            :shipping-city="shippingForm.city"
            :shipping-postal-code="shippingForm.postalCode"
            @update:show-econt-iframe="showEcontIframe = $event"
            @update:show-speedy-iframe="showSpeedyIframe = $event"
            @update:econt-customer-info-id="econtCustomerInfoId = $event"
            @show-econt-iframe="handleShowEcontIframe"
            @show-speedy-iframe="handleShowSpeedyIframe"
          />

          <!-- Client Information -->
          <div class="checkout__section">
            <h2 class="checkout__section-title">Информация за клиента</h2>

            <!-- Guest/Login Toggle (only show if not authenticated) -->
            <div v-if="!authStore.isAuthenticated" class="checkout__auth-toggle">
              <button
                type="button"
                class="auth-toggle__btn"
                :class="{ 'auth-toggle__btn--active': isGuest }"
                @click="isGuest = true"
              >
                <svg
                  class="auth-toggle__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Поръчка като гост
              </button>
              <button
                type="button"
                class="auth-toggle__btn"
                :class="{ 'auth-toggle__btn--active': !isGuest }"
                @click="router.push(`/login?redirect=/checkout`)"
              >
                <svg
                  class="auth-toggle__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Вход
              </button>
            </div>

            <!-- Saved Addresses Component (for authenticated users) -->
            <!-- Only show address selection when courier delivery is selected, not for office/automat -->
            <CheckoutSavedAddresses
              v-if="
                !isGuest &&
                deliveryMethod === 'courier_address' &&
                authStore.user?.addresses?.length
              "
              :displayed-addresses="displayedAddresses"
              :selected-address-id="selectedAddressId"
              :has-more-addresses="hasMoreAddresses"
              :total-addresses="authStore.user.addresses.length"
              @select-address="selectAddress"
              @load-more="showAllAddresses = true"
              @new-address="selectNewAddress"
            />

            <!-- Guest Form Component -->
            <CheckoutGuestForm
              v-if="isGuest && !authStore.isAuthenticated"
              v-model:guest-form="guestForm"
              v-model:shipping-form="shippingForm"
              :delivery-method="deliveryMethod"
              :validation-errors="validationErrors"
              @validate-field="handleBlur"
              @clear-error="handleInput"
            />

            <!-- Old dropdown selector (hidden) -->
            <div v-if="false" class="checkout__econt-selector">
              <!-- City Selection -->
              <div class="form-group">
                <label class="checkout__label">
                  Изберете град
                  <span v-if="loadingCities" style="color: #666; font-size: 0.8rem"
                    >(Зареждане...)</span
                  >
                  <span v-else-if="econtCities.length > 0" style="color: #666; font-size: 0.8rem"
                    >({{ econtCities.length }} градове)</span
                  >
                </label>
                <select
                  v-model="selectedCity"
                  class="checkout__input"
                  :disabled="loadingCities || econtCities.length === 0"
                  required
                  @change="loadOfficesForCity"
                >
                  <option :value="null">
                    {{
                      loadingCities
                        ? "Зареждане..."
                        : econtCities.length === 0
                          ? "Няма налични градове"
                          : "-- Изберете град --"
                    }}
                  </option>
                  <option v-for="city in econtCities" :key="city.id" :value="city">
                    {{ city.name }}
                  </option>
                </select>
              </div>

              <!-- Office Selection -->
              <div v-if="selectedCity" class="form-group">
                <label class="checkout__label">
                  Изберете
                  {{ deliveryMethod === "econt_office" ? "офис" : "eконтомат" }}
                  <span v-if="loadingOffices" style="color: #666; font-size: 0.8rem"
                    >(Зареждане...)</span
                  >
                  <span
                    v-else-if="filteredOffices.length > 0"
                    style="color: #666; font-size: 0.8rem"
                  >
                    ({{ filteredOffices.length }}
                    {{ deliveryMethod === "econt_office" ? "офиса" : "eконтомата" }})
                  </span>
                </label>
                <div v-if="loadingOffices" class="checkout__loading">Зареждане...</div>
                <select
                  v-else
                  v-model="selectedOffice"
                  class="checkout__input"
                  required
                  @change="calculateEcontShipping"
                >
                  <option :value="null">-- Изберете офис --</option>
                  <option v-for="office in filteredOffices" :key="office.code" :value="office">
                    {{ office.name }}
                  </option>
                </select>
              </div>

              <!-- Shipping Cost Display -->
              <div v-if="calculatingShipping" class="checkout__shipping-info">
                Изчисляване на цена за доставка...
              </div>
              <div v-else-if="econtShippingCost > 0" class="checkout__shipping-info">
                💰 Цена за доставка:
                <strong>{{ econtShippingCost.toFixed(2) }} лв</strong>
                <span style="display: block; font-size: 0.8125rem; margin-top: 0.5rem; color: #666">
                  * Окончателната цена може да бъде по-ниска при потвърждаване
                </span>
              </div>
            </div>

            <!-- Shipping Address Component (for authenticated users) -->
            <CheckoutShippingAddress
              v-if="!isGuest"
              v-model:shipping-form="shippingForm"
              v-model:save-new-address="saveNewAddress"
              :delivery-method="deliveryMethod"
              :validation-errors="validationErrors"
              :selected-address-id="selectedAddressId"
              @validate-field="handleBlur"
            />
          </div>
        </div>

        <!-- Right Column - Payment Method & Order Summary -->
        <div class="checkout__summary">
          <!-- Payment Method Component -->
          <CheckoutPaymentMethod v-model="selectedPaymentMethod" />

          <!-- Order Summary Component -->
          <CheckoutOrderSummary
            :items="cartItems"
            :is-empty="cartStore.isEmpty"
            :subtotal-before-discount="cartStore.subtotalBeforeDiscount || 0"
            :has-coupon="!!cartStore.hasCoupon"
            :applied-coupon="cartStore.appliedCoupon || undefined"
            :discount-total="cartStore.discountTotal || 0"
            :total-price="cartStore.totalPrice || 0"
            :shipping-cost="shippingCost"
            :is-submitting="isSubmitting"
            :error-message="errorMessage || undefined"
            @submit="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/auth";
import { useToast } from "~/composables/useToast";
import { useApi } from "~/composables/useApi";
import { useCheckoutValidation } from "~/composables/useCheckoutValidation";
import { useDebounce } from "~/composables/useDebounce";
import { nextTick, computed, watch, onUnmounted } from "vue";
import CheckoutDeliveryMethod from "~/components/checkout/CheckoutDeliveryMethod.vue";
import CheckoutGuestForm from "~/components/checkout/CheckoutGuestForm.vue";
import CheckoutShippingAddress from "~/components/checkout/CheckoutShippingAddress.vue";
import CheckoutSavedAddresses from "~/components/checkout/CheckoutSavedAddresses.vue";
import CheckoutPaymentMethod from "~/components/checkout/CheckoutPaymentMethod.vue";
import CheckoutOrderSummary from "~/components/checkout/CheckoutOrderSummary.vue";

// No middleware - checkout supports both guest and authenticated users

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const api = useApi();

// Use validation composable
const { validationErrors, handleBlur, handleInput } = useCheckoutValidation();

// Use debounce composable
const { debounceAsync } = useDebounce();

// State
const isGuest = ref(!authStore.isAuthenticated); // Start in guest mode if not authenticated
const guestForm = ref({
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
});

const shippingForm = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  postalCode: "",
  country: "България",
  notes: "",
});

const isSubmitting = ref(false);
const errorMessage = ref("");
const selectedAddressId = ref<string | null>(null);
const saveNewAddress = ref(false);
const showAllAddresses = ref(false);

// Validation is now handled by useCheckoutValidation composable

// Payment method selection
const selectedPaymentMethod = ref<"cod" | "stripe_card">("cod");
const isProcessingPayment = ref(false);

// Computed property to show only default and last created addresses initially
// Filter out office/automat addresses when office delivery is selected to avoid duplication
const displayedAddresses = computed(() => {
  if (!authStore.user?.addresses || authStore.user.addresses.length === 0) {
    return [];
  }

  // Filter out office/automat addresses when office delivery is selected
  let addresses = [...authStore.user.addresses];
  if (
    deliveryMethod.value === "econt_office" ||
    deliveryMethod.value === "econt_automat" ||
    deliveryMethod.value === "speedy_office" ||
    deliveryMethod.value === "speedy_apt"
  ) {
    // Only show regular addresses, not office/automat addresses
    addresses = addresses.filter(
      (addr) =>
        addr.type !== "econt_office" &&
        addr.type !== "econt_automat" &&
        addr.type !== "speedy_office" &&
        addr.type !== "speedy_apt"
    );
  }

  if (showAllAddresses.value || addresses.length <= 2) {
    return addresses;
  }

  // Show default address and last created address
  const defaultAddr = addresses.find((addr) => addr.isDefault);
  const lastCreated = addresses[addresses.length - 1];

  const displayed = [];
  if (defaultAddr) displayed.push(defaultAddr);
  if (lastCreated && lastCreated._id !== defaultAddr?._id) {
    displayed.push(lastCreated);
  }

  return displayed;
});

const hasMoreAddresses = computed(() => {
  return !!(
    authStore.user?.addresses &&
    authStore.user.addresses.length > 2 &&
    !showAllAddresses.value
  );
});

// Delivery provider selection (Econt or Speedy)
const deliveryProvider = ref<"econt" | "speedy">("econt");

const deliveryMethod = ref<
  "courier_address" | "econt_office" | "econt_automat" | "speedy_office" | "speedy_apt"
>("courier_address");

// Computed deliveryValue for v-model binding with CheckoutDeliveryMethod component
const deliveryValue = computed({
  get: () => ({
    provider: deliveryProvider.value,
    method: deliveryMethod.value,
  }),
  set: (value: { provider: "econt" | "speedy"; method: string }) => {
    deliveryProvider.value = value.provider;
    deliveryMethod.value = value.method as typeof deliveryMethod.value;

    // Reset office selections when switching providers
    if (value.provider === "econt") {
      selectedSpeedyOffice.value = null;
      speedyShippingCost.value = 0;
      showSpeedyIframe.value = true;
    } else {
      selectedOffice.value = null;
      econtShippingCost.value = 0;
      showEcontIframe.value = true;
    }
  },
});

// Handlers for delivery method component events
const handleShowEcontIframe = () => {
  showEcontIframe.value = true;
  lastSelectedOfficeCode = "";
};

const handleShowSpeedyIframe = () => {
  showSpeedyIframe.value = true;
  lastSelectedSpeedyOfficeId = "";
};
const selectedCity = ref<any>(null);
const selectedOffice = ref<any>(null);
const econtCities = ref<any[]>([]);
const econtOffices = ref<any[]>([]);
const loadingCities = ref(false);
const loadingOffices = ref(false);
const calculatingShipping = ref(false);
const econtShippingCost = ref(0);
const econtCustomerInfoId = ref("");
const showEcontIframe = ref(true); // Show/hide iframe
let lastSelectedOfficeCode = ""; // Track last selection to prevent duplicates
let isProcessingOfficeSelection = false; // Prevent multiple simultaneous processing

// Speedy state
const speedyShippingCost = ref(0);
const selectedSpeedyOffice = ref<any>(null);
const showSpeedyIframe = ref(true);
let lastSelectedSpeedyOfficeId = "";
let isProcessingSpeedySelection = false;

// Iframe URLs are now computed inside CheckoutDeliveryMethod component

// Computed
const cartItems = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.totalPrice || 0);
const shippingCost = computed(() => {
  // Use appropriate shipping cost based on delivery provider
  if (deliveryProvider.value === "speedy") {
    return speedyShippingCost.value;
  }
  return econtShippingCost.value;
});
// Total: prices already include VAT, so just add subtotal + shipping
const _total = computed(() => subtotal.value + shippingCost.value);

// Load Econt cities
const loadEcontCities = async () => {
  loadingCities.value = true;
  console.log("[Checkout] Starting to load Econt cities...");
  try {
    const response = await api.get("econt/cities");
    console.log("[Checkout] Cities response:", response);
    console.log("[Checkout] Response.success:", response.success);
    console.log("[Checkout] Response.data length:", response.data?.length);

    if (response.success) {
      econtCities.value = response.data;
      console.log("[Checkout] Cities loaded successfully:", econtCities.value.length);
      console.log("[Checkout] First 3 cities:", econtCities.value.slice(0, 3));
    } else {
      console.error("[Checkout] Response not successful");
      toast.error("Грешка при зареждане на градовете");
    }
  } catch (error) {
    console.error("[Checkout] Failed to load cities:", error);
    toast.error("Грешка при зареждане на градовете");
  } finally {
    loadingCities.value = false;
    console.log("[Checkout] Cities loading finished. Total cities:", econtCities.value.length);
  }
};

// Load offices for selected city
const loadOfficesForCity = async () => {
  if (!selectedCity.value) return;

  loadingOffices.value = true;
  selectedOffice.value = null;

  try {
    const response = await api.get(`econt/offices/${selectedCity.value.id}`);
    if (response.success) {
      econtOffices.value = response.data;
      console.log(
        "[Checkout] Loaded",
        econtOffices.value.length,
        "offices for",
        selectedCity.value.name
      );
    }
  } catch (error) {
    console.error("[Checkout] Failed to load offices:", error);
    toast.error("Грешка при зареждане на офисите");
  } finally {
    loadingOffices.value = false;
  }
};

// Calculate Econt shipping cost
const calculateEcontShipping = async () => {
  // Check if we have a city (either selected or typed)
  const cityName = selectedCity.value?.name || shippingForm.value.city;
  const postCode = selectedCity.value?.postCode || shippingForm.value.postalCode;

  if (!cityName) {
    econtShippingCost.value = 0;
    return;
  }

  // For address delivery, we need a street
  if (deliveryMethod.value === "courier_address" && !shippingForm.value.street) {
    console.log("[Checkout] Address delivery requires street, skipping calculation");
    return;
  }

  // For office/automat delivery, we need an office selected
  if (
    (deliveryMethod.value === "econt_office" || deliveryMethod.value === "econt_automat") &&
    !selectedOffice.value
  ) {
    console.log(
      "[Checkout] Office/Automat delivery requires office selection, skipping calculation"
    );
    econtShippingCost.value = 0;
    return;
  }

  calculatingShipping.value = true;
  console.log("[Checkout] Calculating Econt shipping...");

  try {
    // Calculate total weight from cart using actual product weights
    const totalWeight = cartItems.value.reduce((total, item) => {
      // Use category default weight if available, otherwise fallback to 0.5kg
      const itemWeight = item.category?.defaultWeight || item.weight || 0.5;
      return total + itemWeight * item.quantity;
    }, 0);

    // Calculate stacked dimensions
    // We stack boxes height-wise, so height = sum of all heights
    let maxLength = 0;
    let maxWidth = 0;
    let totalHeight = 0;

    cartItems.value.forEach((item) => {
      const dims = item.category?.defaultDimensions;
      if (dims) {
        // Track the largest length and width
        if (dims.length > maxLength) maxLength = dims.length;
        if (dims.width > maxWidth) maxWidth = dims.width;
        // Stack heights
        totalHeight += dims.height * item.quantity;
      } else {
        // Fallback dimensions if category doesn't have them
        if (40 > maxLength) maxLength = 40;
        if (30 > maxWidth) maxWidth = 30;
        totalHeight += 20 * item.quantity;
      }
    });

    // Ensure minimum dimensions
    if (maxLength === 0) maxLength = 40;
    if (maxWidth === 0) maxWidth = 30;
    if (totalHeight === 0) totalHeight = 20;

    console.log("[Checkout] Total cart weight:", totalWeight, "kg");
    console.log("[Checkout] Stacked dimensions:", `${maxLength}×${maxWidth}×${totalHeight} cm`);
    console.log(
      "[Checkout] Cart items:",
      cartItems.value.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        categoryWeight: item.category?.defaultWeight,
        categoryDimensions: item.category?.defaultDimensions,
        usedWeight: item.category?.defaultWeight || item.weight || 0.5,
        totalWeight: (item.category?.defaultWeight || item.weight || 0.5) * item.quantity,
        totalHeight: (item.category?.defaultDimensions?.height || 20) * item.quantity,
      }))
    );

    const requestData: any = {
      weight: Math.max(totalWeight, 0.5), // Minimum 0.5kg
      dimensions: {
        length: maxLength,
        width: maxWidth,
        height: totalHeight,
      },
      receiverCityName: cityName,
      receiverPostCode: postCode || "1000",
      receiverName: `${shippingForm.value.firstName} ${shippingForm.value.lastName}`,
      receiverPhone: shippingForm.value.phone || "0888000000",
      paymentSide: "RECEIVER", // Receiver pays shipping
      services: [
        {
          type: "CD",
          amount: cartStore.totalPrice, // Cash on delivery amount
          currency: "BGN",
        },
      ],
    };

    console.log("[Checkout] Delivery method:", deliveryMethod.value);
    console.log("[Checkout] Request data:", {
      hasOfficeCode: !!requestData.officeCode,
      hasStreet: !!requestData.receiverStreet,
      officeCode: requestData.officeCode,
      street: requestData.receiverStreet,
    });

    // If office/eконтомат selected, add office code
    if (
      selectedOffice.value &&
      (deliveryMethod.value === "econt_office" || deliveryMethod.value === "econt_automat")
    ) {
      requestData.officeCode = selectedOffice.value.code;
      console.log("[Checkout] Office delivery - Office code:", requestData.officeCode);
    } else if (deliveryMethod.value === "courier_address") {
      // For address delivery, add street
      requestData.receiverStreet = shippingForm.value.street;
      // Ensure no office code is sent for address delivery
      delete requestData.officeCode;
      console.log("[Checkout] Address delivery - Street:", requestData.receiverStreet);
    } else {
      // User must select office first for Econt delivery
      console.warn("[Checkout] No office selected for office/automat delivery");
      econtShippingCost.value = 0;
      calculatingShipping.value = false;
      return;
    }

    const response = await api.post("econt/calculate-price", requestData);

    console.log("[Checkout] Shipping calculation response:", response);

    if (response.success && response.data && response.data.totalPrice) {
      // Show Econt API price directly - no discount factors
      econtShippingCost.value = parseFloat(response.data.totalPrice);

      console.log("[Checkout] Econt shipping price:", econtShippingCost.value, "BGN");
    } else {
      // API failed to return price
      econtShippingCost.value = 0;
      console.error("[Checkout] No price returned from Econt API");
      toast.error("Не можахме да изчислим цената за доставка. Моля, опитайте отново.");
    }
  } catch (error) {
    console.error("[Checkout] Failed to calculate shipping:", error);
    econtShippingCost.value = 0;
    toast.error("Грешка при изчисляване на доставката. Моля, проверете адреса и опитайте отново.");
  } finally {
    calculatingShipping.value = false;
  }
};

// Calculate Speedy shipping
const calculateSpeedyShipping = async () => {
  // Check if we have a city (either selected or typed)
  const cityName = selectedSpeedyOffice.value?.address?.city?.name || shippingForm.value.city;

  if (!cityName) {
    speedyShippingCost.value = 0;
    return;
  }

  // For address delivery, we need a street
  if (deliveryMethod.value === "courier_address" && !shippingForm.value.street) {
    console.log("[Checkout] Address delivery requires street, skipping calculation");
    return;
  }

  // For office/automat delivery, we need an office selected
  if (
    (deliveryMethod.value === "speedy_office" || deliveryMethod.value === "speedy_apt") &&
    !selectedSpeedyOffice.value
  ) {
    console.log(
      "[Checkout] Speedy office/automat delivery requires office selection, skipping calculation"
    );
    speedyShippingCost.value = 0;
    return;
  }

  calculatingShipping.value = true;
  console.log("[Checkout] Calculating Speedy shipping...");

  try {
    // Calculate total weight from cart
    const totalWeight = cartItems.value.reduce((total, item) => {
      const itemWeight = item.category?.defaultWeight || item.weight || 0.5;
      return total + itemWeight * item.quantity;
    }, 0);

    // Calculate stacked dimensions (same logic as Econt)
    let maxLength = 0;
    let maxWidth = 0;
    let totalHeight = 0;

    cartItems.value.forEach((item) => {
      const dims = item.category?.defaultDimensions;
      if (dims) {
        if (dims.length > maxLength) maxLength = dims.length;
        if (dims.width > maxWidth) maxWidth = dims.width;
        totalHeight += dims.height * item.quantity;
      } else {
        if (40 > maxLength) maxLength = 40;
        if (30 > maxWidth) maxWidth = 30;
        totalHeight += 20 * item.quantity;
      }
    });

    if (maxLength === 0) maxLength = 40;
    if (maxWidth === 0) maxWidth = 30;
    if (totalHeight === 0) totalHeight = 20;

    console.log("[Checkout] Total cart weight:", totalWeight, "kg");
    console.log("[Checkout] Stacked dimensions:", `${maxLength}×${maxWidth}×${totalHeight} cm`);

    const requestData: any = {
      weight: Math.max(totalWeight, 0.5),
      dimensions: {
        length: maxLength,
        width: maxWidth,
        height: totalHeight,
      },
      receiverCityName: cityName,
      receiverPostCode: shippingForm.value.postalCode || "1000",
      receiverName: `${shippingForm.value.firstName} ${shippingForm.value.lastName}`,
      receiverPhone: shippingForm.value.phone || "0888000000",
    };

    // If office/automat selected, add office ID or use siteId
    if (
      selectedSpeedyOffice.value &&
      (deliveryMethod.value === "speedy_office" || deliveryMethod.value === "speedy_apt")
    ) {
      if (selectedSpeedyOffice.value.id) {
        requestData.officeId = selectedSpeedyOffice.value.id;
        console.log("[Checkout] Speedy office delivery - Office ID:", requestData.officeId);
      } else if (selectedSpeedyOffice.value.siteId) {
        // If we don't have office ID yet, use siteId for address-based calculation
        requestData.receiverCityName = selectedSpeedyOffice.value.address.city.name;
        requestData.receiverPostCode = selectedSpeedyOffice.value.address.city.postCode;
        console.log(
          "[Checkout] Speedy office delivery - Using siteId (no office ID found):",
          selectedSpeedyOffice.value.siteId
        );
        console.warn("[Checkout] Warning: Office ID not found, calculation might be inaccurate");
      } else {
        console.error("[Checkout] No office ID or siteId available for Speedy office delivery");
        speedyShippingCost.value = 0;
        calculatingShipping.value = false;
        return;
      }
    } else if (deliveryMethod.value === "courier_address") {
      // For address delivery, add street
      requestData.receiverStreet = shippingForm.value.street;
      console.log("[Checkout] Speedy address delivery - Street:", requestData.receiverStreet);
    }

    const response = await api.post("speedy/calculate", requestData);

    console.log("[Checkout] Speedy shipping calculation response:", response);

    if (response.success && response.price && response.price.total) {
      speedyShippingCost.value = parseFloat(response.price.total);
      console.log("[Checkout] Speedy shipping price:", speedyShippingCost.value, "BGN");
    } else {
      speedyShippingCost.value = 0;
      console.error("[Checkout] No price returned from Speedy API:", response);
      const errorMessage = response.error || "Не можахме да изчислим цената за доставка";
      toast.error(`❌ ${errorMessage}. Моля, опитайте отново.`);
    }
  } catch (error: any) {
    console.error("[Checkout] Failed to calculate Speedy shipping:", error);
    speedyShippingCost.value = 0;
    const errorMessage =
      error.data?.error || error.message || "Грешка при изчисляване на доставката";
    toast.error(`❌ ${errorMessage}. Моля, проверете адреса и опитайте отново.`);
  } finally {
    calculatingShipping.value = false;
  }
};

// Create debounced versions of shipping calculation functions with request cancellation
const debouncedCalculateEcontShipping = debounceAsync(calculateEcontShipping, 500);
const debouncedCalculateSpeedyShipping = debounceAsync(calculateSpeedyShipping, 500);

// Track current shipping calculation promise for cancellation
let currentShippingCalculation: { cancel: () => void } | null = null;

// Watch for changes in delivery method, city, office, or address fields
watch(
  [
    deliveryMethod,
    deliveryProvider,
    selectedCity,
    selectedOffice,
    selectedSpeedyOffice,
    () => shippingForm.value.street,
    () => shippingForm.value.city,
    () => shippingForm.value.postalCode,
  ],
  ([newDeliveryMethod, newProvider], [oldDeliveryMethod, oldProvider]) => {
    // Cancel any pending shipping calculation
    if (currentShippingCalculation) {
      currentShippingCalculation.cancel();
      currentShippingCalculation = null;
    }

    // Cancel debounced functions
    debouncedCalculateEcontShipping.cancel();
    debouncedCalculateSpeedyShipping.cancel();

    // If delivery method or provider changed, recalculate immediately
    if (newDeliveryMethod !== oldDeliveryMethod || newProvider !== oldProvider) {
      console.log("[Checkout] Delivery method/provider changed, recalculating immediately");
      if (deliveryProvider.value === "speedy") {
        currentShippingCalculation = { cancel: debouncedCalculateSpeedyShipping.cancel };
        calculateSpeedyShipping().catch(() => {
          // Ignore errors from cancelled requests
        });
      } else {
        currentShippingCalculation = { cancel: debouncedCalculateEcontShipping.cancel };
        calculateEcontShipping().catch(() => {
          // Ignore errors from cancelled requests
        });
      }
      return;
    }

    // For address delivery with text input changes, use debounced calculation
    if (deliveryMethod.value === "courier_address") {
      if (deliveryProvider.value === "speedy") {
        currentShippingCalculation = { cancel: debouncedCalculateSpeedyShipping.cancel };
        debouncedCalculateSpeedyShipping().catch((error: Error) => {
          // Ignore cancellation errors
          if (error.message !== "Request was cancelled") {
            console.error("[Checkout] Shipping calculation error:", error);
          }
        });
      } else {
        currentShippingCalculation = { cancel: debouncedCalculateEcontShipping.cancel };
        debouncedCalculateEcontShipping().catch((error: Error) => {
          // Ignore cancellation errors
          if (error.message !== "Request was cancelled") {
            console.error("[Checkout] Shipping calculation error:", error);
          }
        });
      }
    } else {
      // For office/automat selection, calculate immediately
      if (deliveryProvider.value === "speedy") {
        currentShippingCalculation = { cancel: debouncedCalculateSpeedyShipping.cancel };
        calculateSpeedyShipping().catch(() => {
          // Ignore errors from cancelled requests
        });
      } else {
        currentShippingCalculation = { cancel: debouncedCalculateEcontShipping.cancel };
        calculateEcontShipping().catch(() => {
          // Ignore errors from cancelled requests
        });
      }
    }
  }
);

// Cleanup on unmount
onUnmounted(() => {
  // Cancel any pending calculations
  debouncedCalculateEcontShipping.cancel();
  debouncedCalculateSpeedyShipping.cancel();
  if (currentShippingCalculation) {
    currentShippingCalculation.cancel();
  }
});

// Filtered offices based on delivery method
const filteredOffices = computed(() => {
  if (deliveryMethod.value === "econt_automat") {
    return econtOffices.value.filter((office) => office.isAutomat);
  }
  return econtOffices.value.filter((office) => !office.isAutomat);
});

// Load user data on mount
onMounted(async () => {
  // Redirect if cart is empty
  if (cartStore.isEmpty) {
    router.push("/cart");
    return;
  }

  // Fetch user data if not loaded
  if (!authStore.user && authStore.accessToken) {
    await authStore.fetchUser();
  }

  if (authStore.user) {
    // Populate form with user data
    // For authenticated users, always use account email (it's the source of truth)
    shippingForm.value.email = authStore.user.email || "";
    // For other fields, use existing form values if present, otherwise use user data
    shippingForm.value.firstName = shippingForm.value.firstName || authStore.user.firstName || "";
    shippingForm.value.lastName = shippingForm.value.lastName || authStore.user.lastName || "";
    shippingForm.value.phone = shippingForm.value.phone || authStore.user.phone || "";

    // Load default address if exists
    if (authStore.user.addresses && authStore.user.addresses.length > 0) {
      const defaultAddress =
        authStore.user.addresses.find((addr) => addr.isDefault) || authStore.user.addresses[0];
      if (defaultAddress) {
        selectedAddressId.value = defaultAddress._id;
        shippingForm.value.street = defaultAddress.street;
        shippingForm.value.city = defaultAddress.city;
        shippingForm.value.postalCode = defaultAddress.postalCode;
        shippingForm.value.country = defaultAddress.country || "България";
      }
    }
  }

  // Load Econt cities
  console.log("[Checkout] About to load Econt cities on mount...");
  await loadEcontCities();
  console.log("[Checkout] After loadEcontCities, cities count:", econtCities.value.length);

  // Listen for messages from Econt and Speedy iframes
  if (import.meta.client) {
    window.addEventListener(
      "message",
      async (event) => {
        // Handle Econt messages
        if (event.origin.includes("econt.com") || event.origin.includes("delivery.econt")) {
          const data = event.data;
          console.log("[Checkout] Econt iframe FULL data:", JSON.stringify(data, null, 2));
          console.log("[Checkout] Data keys:", Object.keys(data));
          console.log("[Checkout] Office object:", data.office);

          if (data.shipment_error) {
            toast.error("Грешка: " + data.shipment_error);
            return;
          }

          // Handle office object from iframe
          if (data.office) {
            const officeCode = data.office.code || data.office_code;

            // Prevent duplicate processing - check BEFORE doing anything
            if (officeCode === lastSelectedOfficeCode) {
              console.log("[Checkout] Duplicate Econt office message, skipping");
              return;
            }

            if (isProcessingOfficeSelection) {
              console.log("[Checkout] Already processing office selection, skipping");
              return;
            }

            isProcessingOfficeSelection = true;
            lastSelectedOfficeCode = officeCode;

            selectedOffice.value = {
              code: officeCode,
              name: data.office.name || data.office_name || "Избран офис",
              address: data.office.address,
            };

            selectedCity.value = {
              name: data.office.address?.city?.name || data.city_name,
              postCode: data.office.address?.city?.postCode || data.post_code,
            };

            console.log("[Checkout] Office selected:", selectedOffice.value.name);

            // Show toast only once
            toast.success(`✅ Избран офис: ${selectedOffice.value.name}`);

            // Hide iframe and show summary
            showEcontIframe.value = false;

            // Recalculate shipping
            await calculateEcontShipping();

            // Reset processing flag after a delay
            setTimeout(() => {
              isProcessingOfficeSelection = false;
            }, 1000);
          }

          // Store customer info ID
          if (data.id) {
            econtCustomerInfoId.value = data.id;
          }

          // Update price if provided
          if (data.shipping_price || data.shipping_price_cod) {
            const shippingPrice = data.shipping_price_cod || data.shipping_price || 0;
            econtShippingCost.value = parseFloat(shippingPrice);
            console.log("[Checkout] Price from iframe:", econtShippingCost.value);
          }
        }

        // Handle Speedy messages
        if (event.origin.includes("speedy.bg") || event.origin.includes("services.speedy.bg")) {
          const data = event.data;
          console.log("[Checkout] Speedy iframe data:", JSON.stringify(data, null, 2));

          // Filter out Angular devtools messages and other non-office messages
          if (
            data.source === "angular-devtools-content-script" ||
            data.topic === "handshake" ||
            data.__NG_DEVTOOLS_EVENT__
          ) {
            console.log("[Checkout] Ignoring Angular devtools message from Speedy widget");
            return;
          }

          // Speedy widget sends office data directly with id, name, address, etc.
          // The widget returns the full office object including the office ID
          const officeId = data.id; // Widget sends office ID directly!
          const officeName = data.name || data.nameEn;
          const siteId = data.siteId || data.address?.siteId;
          const siteName = data.address?.siteName || data.siteName;
          const fullAddressString = data.address?.fullAddressString || data.fullAddressString;
          const postCode = data.address?.postCode || data.postCode;

          // Check if we have office data (widget sends full office object with id)
          if (officeId) {
            // Prevent duplicate processing
            if (officeId === lastSelectedSpeedyOfficeId || isProcessingSpeedySelection) {
              console.log("[Checkout] Duplicate Speedy office message, skipping");
              return;
            }

            isProcessingSpeedySelection = true;
            lastSelectedSpeedyOfficeId = officeId;

            // Store the office data directly from widget
            selectedSpeedyOffice.value = {
              id: officeId, // Office ID from widget
              siteId: siteId,
              name: officeName || "Избран офис",
              type: data.type, // OFFICE or APT
              address: {
                city: {
                  name: siteName || "",
                  postCode: postCode || "",
                },
                fullAddress:
                  fullAddressString || data.address?.localAddressString || siteName || "",
              },
            };

            console.log("[Checkout] Speedy office selected:", selectedSpeedyOffice.value);

            // Show toast only once
            toast.success(`✅ Избран офис: ${selectedSpeedyOffice.value.name}`);

            // Hide iframe and show summary
            showSpeedyIframe.value = false;

            // Recalculate shipping with office ID
            await calculateSpeedyShipping();

            // Reset processing flag after a delay
            setTimeout(() => {
              isProcessingSpeedySelection = false;
            }, 1000);
          }

          // Update price if provided by Speedy widget
          if (data.shipping_price || data.price) {
            const shippingPrice = data.shipping_price || data.price || 0;
            speedyShippingCost.value = parseFloat(shippingPrice);
            console.log("[Checkout] Speedy price from iframe:", speedyShippingCost.value);
          }
        }
      },
      false
    );
  }
});

// Handle office selection from map component (unused - office selection handled via iframe messages)
const _handleOfficeSelected = async (_office: any) => {
  console.log("[Checkout] Office selected from map:", _office);

  selectedOffice.value = {
    code: _office.code,
    name: _office.name,
    address: _office.address,
  };

  selectedCity.value = {
    name: _office.address.city.name,
    postCode: _office.address.city.postCode,
  };

  toast.success(`Избран офис: ${_office.name}`);

  // Calculate shipping for selected office
  await calculateEcontShipping();
};

// Select saved address
const selectAddress = async (address: any) => {
  selectedAddressId.value = address._id;
  shippingForm.value.street = address.street;
  shippingForm.value.city = address.city;
  shippingForm.value.postalCode = address.postalCode;
  shippingForm.value.country = address.country || "България";
  saveNewAddress.value = false;

  // If it's an Econt office or automat, set delivery method and office info
  if (address.type === "econt_office" || address.type === "econt_automat") {
    // Set delivery provider and method
    deliveryProvider.value = "econt";
    deliveryMethod.value = address.type === "econt_automat" ? "econt_automat" : "econt_office";

    // Set selected office if we have the office code
    if (address.econtOfficeCode && address.econtOfficeName) {
      selectedOffice.value = {
        code: address.econtOfficeCode,
        name: address.econtOfficeName,
        address: {
          fullAddress: address.street,
          city: {
            name: address.city,
            postCode: address.postalCode,
          },
        },
      };

      selectedCity.value = {
        name: address.city,
        postCode: address.postalCode,
      };

      // Hide iframe since we're using saved office
      showEcontIframe.value = false;

      // Recalculate shipping with office-to-office pricing
      await calculateEcontShipping();
    }
  } else if (address.type === "speedy_office" || address.type === "speedy_apt") {
    // Set delivery provider and method for Speedy
    deliveryProvider.value = "speedy";
    deliveryMethod.value = address.type === "speedy_apt" ? "speedy_apt" : "speedy_office";

    // Set selected Speedy office if we have the office ID
    if (address.speedyOfficeId || address.speedyOfficeName) {
      selectedSpeedyOffice.value = {
        id: address.speedyOfficeId,
        name: address.speedyOfficeName || "Избран офис",
        address: {
          fullAddress: address.street,
          city: {
            name: address.city,
            postCode: address.postalCode,
          },
        },
      };

      // Hide iframe since we're using saved office
      showSpeedyIframe.value = false;

      // Recalculate shipping
      await calculateSpeedyShipping();
    }
  } else {
    // For regular addresses, ensure delivery method is courier_address
    // Keep current provider but set to address delivery
    deliveryMethod.value = "courier_address";
    selectedOffice.value = null;
    selectedSpeedyOffice.value = null;
    showEcontIframe.value = true;
    showSpeedyIframe.value = true;

    // Recalculate shipping for address delivery
    if (deliveryProvider.value === "speedy") {
      await calculateSpeedyShipping();
    } else {
      await calculateEcontShipping();
    }
  }
};

// Select new address option
const selectNewAddress = () => {
  selectedAddressId.value = null;
  shippingForm.value.street = "";
  shippingForm.value.city = "";
  shippingForm.value.postalCode = "";
  shippingForm.value.country = "България";
  saveNewAddress.value = true;

  // Ensure we switch to address delivery mode
  deliveryMethod.value = "courier_address";
  selectedOffice.value = null;
  selectedSpeedyOffice.value = null;
  showEcontIframe.value = true;
  showSpeedyIframe.value = true;
};

// Check if we can calculate shipping
const _canCalculateShipping = computed(() => {
  // Check if we have required fields for address delivery
  if (deliveryMethod.value === "courier_address") {
    return shippingForm.value.city && shippingForm.value.postalCode && shippingForm.value.street;
  }
  // For office, we need an office selected
  if (
    deliveryMethod.value.includes("office") ||
    deliveryMethod.value.includes("automat") ||
    deliveryMethod.value.includes("apt")
  ) {
    return (
      (deliveryProvider.value === "econt" && selectedOffice.value) ||
      (deliveryProvider.value === "speedy" && selectedSpeedyOffice.value)
    );
  }
  return false;
});

// Manual shipping calculation
const _calculateShippingManually = async () => {
  if (deliveryProvider.value === "speedy") {
    await calculateSpeedyShipping();
  } else {
    await calculateEcontShipping();
  }
};

// Handle Stripe Checkout
const handleStripeCheckout = async (orderData: any) => {
  isProcessingPayment.value = true;
  errorMessage.value = "";

  try {
    console.log("[Checkout] Creating Stripe Checkout Session...");

    // Prepare headers
    const headers: any = {};
    if (authStore.accessToken) {
      headers.Authorization = `Bearer ${authStore.accessToken}`;
    }

    // Call backend to create Checkout Session
    const response: any = await api.post("payments/create-checkout-session", orderData, {
      headers,
    });

    if (response.success && response.data.sessionUrl) {
      console.log("[Checkout] Stripe session created:", response.data.sessionId);
      console.log("[Checkout] Redirecting to Stripe Checkout...");

      // Redirect to Stripe Checkout
      window.location.href = response.data.sessionUrl;
    } else {
      throw new Error(response.message || "Failed to create checkout session");
    }
  } catch (error: any) {
    console.error("[Checkout] Stripe checkout error:", error);
    errorMessage.value =
      error.data?.message ||
      error.message ||
      "Грешка при създаване на плащане. Моля, опитайте отново.";
    isProcessingPayment.value = false;
    isSubmitting.value = false;
  }
};

// Submit order
const handleSubmit = async () => {
  if (isSubmitting.value) return;

  errorMessage.value = "";
  isSubmitting.value = true;

  // Validate all fields and show errors
  let hasValidationErrors = false;

  // Validate guest form if in guest mode
  if (isGuest.value && !authStore.isAuthenticated) {
    handleBlur("guestEmail", guestForm.value.email);
    handleBlur("guestFirstName", guestForm.value.firstName);
    handleBlur("guestLastName", guestForm.value.lastName);
    handleBlur("guestPhone", guestForm.value.phone);

    if (
      validationErrors.value.guestEmail ||
      validationErrors.value.guestFirstName ||
      validationErrors.value.guestLastName ||
      validationErrors.value.guestPhone
    ) {
      hasValidationErrors = true;
    }
  }

  // Validate shipping address fields if courier delivery is selected
  if (deliveryMethod.value === "courier_address") {
    handleBlur("shippingStreet", shippingForm.value.street);
    handleBlur("shippingCity", shippingForm.value.city);
    handleBlur("shippingPostalCode", shippingForm.value.postalCode);

    if (
      validationErrors.value.shippingStreet ||
      validationErrors.value.shippingCity ||
      validationErrors.value.shippingPostalCode
    ) {
      hasValidationErrors = true;
    }
  }

  if (hasValidationErrors) {
    errorMessage.value = "Моля, попълнете всички задължителни полета правилно.";
    isSubmitting.value = false;
    // Scroll to first error
    nextTick(() => {
      const firstError = document.querySelector(".checkout__input--error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        (firstError as HTMLElement).focus();
      }
    });
    return;
  }

  // Validate office selection based on provider
  if (deliveryMethod.value !== "courier_address") {
    if (deliveryProvider.value === "econt" && !selectedOffice.value) {
      errorMessage.value = "Моля, изберете офис или еконтомат за доставка.";
      isSubmitting.value = false;
      return;
    }
    if (deliveryProvider.value === "speedy" && !selectedSpeedyOffice.value) {
      errorMessage.value = "Моля, изберете офис или автомат на Speedy за доставка.";
      isSubmitting.value = false;
      return;
    }
  }

  // Ensure user data is loaded for authenticated users
  if (!isGuest.value && authStore.accessToken && !authStore.user) {
    await authStore.fetchUser();
  }

  // Prepare shipping address based on delivery method
  // Use guest form data if in guest mode, otherwise use shipping form
  const firstName = isGuest.value ? guestForm.value.firstName : shippingForm.value.firstName;
  const lastName = isGuest.value ? guestForm.value.lastName : shippingForm.value.lastName;
  const email = isGuest.value ? guestForm.value.email : shippingForm.value.email;
  const phone = isGuest.value ? guestForm.value.phone : shippingForm.value.phone;

  let shippingAddress: any;
  if (deliveryMethod.value !== "courier_address") {
    if (deliveryProvider.value === "econt" && selectedOffice.value) {
      shippingAddress = {
        firstName,
        lastName,
        email,
        phone,
        street: selectedOffice.value.address.fullAddress || selectedOffice.value.name,
        city: selectedCity.value?.name || "",
        postalCode: selectedOffice.value.address.postCode || "0000",
        country: shippingForm.value.country,
        notes: shippingForm.value.notes || null,
      };
    } else if (deliveryProvider.value === "speedy" && selectedSpeedyOffice.value) {
      shippingAddress = {
        firstName,
        lastName,
        email,
        phone,
        street: selectedSpeedyOffice.value.address.fullAddress || selectedSpeedyOffice.value.name,
        city: selectedSpeedyOffice.value.address.city?.name || shippingForm.value.city,
        postalCode:
          selectedSpeedyOffice.value.address.city?.postCode || shippingForm.value.postalCode,
        country: shippingForm.value.country,
        notes: shippingForm.value.notes || null,
      };
    } else {
      // Fallback to regular address
      shippingAddress = {
        firstName,
        lastName,
        email,
        phone,
        street: shippingForm.value.street,
        city: shippingForm.value.city,
        postalCode: shippingForm.value.postalCode,
        country: shippingForm.value.country,
        notes: shippingForm.value.notes || null,
      };
    }
  } else {
    shippingAddress = {
      firstName,
      lastName,
      email,
      phone,
      street: shippingForm.value.street,
      city: shippingForm.value.city,
      postalCode: shippingForm.value.postalCode,
      country: shippingForm.value.country,
      notes: shippingForm.value.notes || null,
    };
  }

  // Prepare order data
  const orderData: any = {
    items: cartItems.value.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      customization: item.embroidery
        ? `Бродерия: ${item.embroidery.name}${item.embroidery.color ? `, Цвят: ${item.embroidery.color}` : ""}${item.embroidery.font ? `, Шрифт: ${item.embroidery.font}` : ""}`
        : null,
    })),
    shippingAddress,
    paymentMethod: selectedPaymentMethod.value === "cod" ? "cash_on_delivery" : "stripe_card",
    deliveryMethod: deliveryMethod.value,
    deliveryProvider: deliveryProvider.value,
    shippingCost: shippingCost.value || 0, // Include calculated shipping cost
    econtCustomerInfoId: econtCustomerInfoId.value || null, // Add Econt customer info ID
    isGuest: isGuest.value && !authStore.isAuthenticated, // Add guest flag
    guestInfo:
      isGuest.value && !authStore.isAuthenticated
        ? {
            email: guestForm.value.email,
            firstName: guestForm.value.firstName,
            lastName: guestForm.value.lastName,
            phone: guestForm.value.phone,
          }
        : null,
  };

  // Add Econt data if office/automat selected
  if (
    deliveryMethod.value !== "courier_address" &&
    deliveryProvider.value === "econt" &&
    selectedOffice.value
  ) {
    orderData.econtOfficeCode = selectedOffice.value.code;
    orderData.econtOfficeName = selectedOffice.value.name;
  }

  // Add Speedy data if office/automat selected
  if (
    deliveryMethod.value !== "courier_address" &&
    deliveryProvider.value === "speedy" &&
    selectedSpeedyOffice.value
  ) {
    orderData.speedyOfficeId = selectedSpeedyOffice.value.id;
    orderData.speedyOfficeName = selectedSpeedyOffice.value.name;
  }

  try {
    // Update user profile BEFORE creating order (for both COD and Stripe)
    // This ensures user info is saved even if order creation fails or redirects
    if (!isGuest.value && authStore.isAuthenticated && authStore.user) {
      const needsProfileUpdate =
        !authStore.user?.firstName ||
        !authStore.user?.lastName ||
        !authStore.user?.phone ||
        authStore.user.firstName !== shippingForm.value.firstName ||
        authStore.user.lastName !== shippingForm.value.lastName ||
        authStore.user.phone !== shippingForm.value.phone;

      if (needsProfileUpdate) {
        console.log("[Checkout] Updating user profile before order creation...");
        try {
          await authStore.updateProfile({
            firstName: shippingForm.value.firstName,
            lastName: shippingForm.value.lastName,
            phone: shippingForm.value.phone,
          });
          console.log("[Checkout] Profile updated successfully");

          // Refresh user data
          await authStore.fetchUser();
          console.log("[Checkout] User data refreshed");
        } catch (err) {
          console.error("[Checkout] Failed to update profile:", err);
          // Don't block order creation if profile update fails
        }
      }
    }

    // Check payment method and route accordingly
    if (selectedPaymentMethod.value === "stripe_card") {
      // Handle Stripe checkout (redirects to Stripe)
      await handleStripeCheckout(orderData);
      return; // Exit here as we're redirecting to Stripe
    }

    // COD flow (existing logic)
    // Submit order
    // Prepare headers - only include Authorization if user is authenticated
    const headers: any = {};
    if (authStore.accessToken) {
      headers.Authorization = `Bearer ${authStore.accessToken}`;
    }

    const response = await api.post("orders", orderData, {
      headers,
    });

    if (response.success) {
      console.log("[Checkout] Order created successfully!");

      // Always save/update user profile info
      const needsProfileUpdate =
        !authStore.user?.firstName ||
        !authStore.user?.lastName ||
        !authStore.user?.phone ||
        authStore.user.firstName !== shippingForm.value.firstName ||
        authStore.user.lastName !== shippingForm.value.lastName ||
        authStore.user.phone !== shippingForm.value.phone;

      if (needsProfileUpdate) {
        console.log("[Checkout] Updating user profile...");
        try {
          const updateResult = await authStore.updateProfile({
            firstName: shippingForm.value.firstName,
            lastName: shippingForm.value.lastName,
            phone: shippingForm.value.phone,
          });
          console.log("[Checkout] Profile update result:", updateResult);

          // Force refresh user data
          await authStore.fetchUser();
          console.log("[Checkout] User data refreshed:", authStore.user);
        } catch (err) {
          console.error("[Checkout] Failed to update profile:", err);
        }
      }

      // Save address based on delivery method
      if (deliveryMethod.value === "courier_address") {
        // Save courier address if user chose to save new address
        if (saveNewAddress.value && selectedAddressId.value === null) {
          const hasMatchingAddress = authStore.user?.addresses?.some(
            (addr) =>
              addr.street === shippingForm.value.street &&
              addr.city === shippingForm.value.city &&
              addr.postalCode === shippingForm.value.postalCode
          );

          if (!hasMatchingAddress) {
            console.log("[Checkout] Saving new courier address...");
            try {
              // Don't manually add Authorization header - let useApi handle it
              // It will use token if available, or cookies for Google OAuth users
              const addressResult = await api.post("users/addresses", {
                type: "home",
                street: shippingForm.value.street,
                city: shippingForm.value.city,
                postalCode: shippingForm.value.postalCode,
                country: shippingForm.value.country,
                isDefault: !authStore.user?.addresses?.length,
              });
              console.log("[Checkout] Address save result:", addressResult);

              // Refresh user data
              await authStore.fetchUser();
              console.log("[Checkout] Address saved and user refreshed");
            } catch (err) {
              console.error("[Checkout] Failed to save address:", err);
            }
          }
        }
      } else if (selectedOffice.value) {
        // Save Econt office/automat address
        const officeAddressStreet =
          selectedOffice.value.address.fullAddress || selectedOffice.value.name;
        const officeCity = selectedCity.value?.name || selectedOffice.value.address.city.name;
        const officePostalCode = selectedOffice.value.address.city.postCode || "0000";

        const hasMatchingOfficeAddress = authStore.user?.addresses?.some(
          (addr) =>
            addr.street === officeAddressStreet &&
            addr.city === officeCity &&
            addr.postalCode === officePostalCode
        );

        if (!hasMatchingOfficeAddress) {
          console.log("[Checkout] Saving Econt office address...");
          try {
            // Don't manually add Authorization header - let useApi handle it
            // It will use token if available, or cookies for Google OAuth users
            const addressResult = await api.post("users/addresses", {
              type: deliveryMethod.value === "econt_automat" ? "econt_automat" : "econt_office",
              street: officeAddressStreet,
              city: officeCity,
              postalCode: officePostalCode,
              country: "България",
              isDefault: !authStore.user?.addresses?.length,
              econtOfficeCode: selectedOffice.value.code,
              econtOfficeName: selectedOffice.value.name,
            });
            console.log("[Checkout] Econt office address save result:", addressResult);

            // Refresh user data
            await authStore.fetchUser();
            console.log("[Checkout] Econt office address saved and user refreshed");
          } catch (err) {
            console.error("[Checkout] Failed to save Econt office address:", err);
          }
        }
      }

      // Wait a moment for all updates to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Clear cart
      cartStore.clearCart();

      console.log("[Checkout] Redirecting to success page. Final user state:", authStore.user);

      // Redirect to success page with secure token
      const token = response.data.successToken;
      if (token) {
        await navigateTo(`/order-success?token=${token}`);
      } else {
        // Fallback to orderId for backward compatibility
        await navigateTo(`/order-success?orderId=${response.data._id}`);
      }
    }
  } catch (error: any) {
    console.error("Order submission error:", error);

    // Handle token expiration
    if (
      error.status === 401 ||
      error.data?.message === "Invalid token" ||
      error.data?.message === "Token expired"
    ) {
      // Try to refresh token
      const refreshed = await authStore.refreshAccessToken();
      if (refreshed) {
        // Retry the order submission
        try {
          const response = await api.post("orders", orderData, {
            headers: {
              Authorization: `Bearer ${authStore.accessToken}`,
            },
          });

          if (response.success) {
            cartStore.clearCart();
            const token = response.data.successToken;
            if (token) {
              router.push(`/order-success?token=${token}`);
            } else {
              router.push(`/order-success?orderId=${response.data._id}`);
            }
            return;
          }
        } catch {
          errorMessage.value = "Сесията ви е изтекла. Моля, влезте отново.";
          router.push("/login?redirect=/checkout");
        }
      } else {
        errorMessage.value = "Сесията ви е изтекла. Моля, влезте отново.";
        router.push("/login?redirect=/checkout");
      }
    } else {
      errorMessage.value =
        error.data?.message ||
        "Възникна грешка при създаването на поръчката. Моля, опитайте отново.";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped lang="scss">
.checkout {
  min-height: 100vh;
  padding: 2rem 0;
  background: #f8f9fa;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;

    @media (max-width: 640px) {
      padding: 0 0.75rem;
    }
  }

  &__header {
    margin-bottom: 2rem;
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }

  &__back-link {
    color: #666;
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
      color: #000;
    }
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;

    @media (max-width: 968px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 640px) {
      gap: 1rem;
    }
  }

  &__forms {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
    min-width: 0;

    @media (max-width: 640px) {
      gap: 1.5rem;
    }
  }

  &__section {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;

    @media (max-width: 640px) {
      padding: 1.5rem 1rem;
    }
  }

  &__section-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #1a1a1a;
  }

  &__form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  &__form-group {
    margin-bottom: 1.25rem;
  }

  &__saved-addresses {
    margin-bottom: 2rem;
  }

  &__address-options {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-top: 0.75rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9375rem;
    color: #333;
    cursor: pointer;

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
  }

  &__label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
    font-size: 0.9rem;
  }

  &__required {
    color: #e74c3c;
  }

  &__input,
  &__textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #3498db;
    }

    &--error {
      border-color: #e74c3c;

      &:focus {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
      }
    }
  }

  &__textarea {
    resize: vertical;
    font-family: inherit;
  }

  &__payment-method {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__payment-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &--selected {
      border-color: #3498db;
      background: #f0f8ff;
    }
  }

  &__payment-icon {
    font-size: 2rem;
  }

  &__payment-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  &__payment-desc {
    font-size: 0.85rem;
    color: #666;
  }

  &__summary-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 2rem;
    margin-bottom: 2rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__payment-card {
    position: static;
    margin-bottom: 2rem;
  }

  &__summary-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #1a1a1a;
  }

  &__items {
    border-bottom: 1px solid #eee;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
  }

  &__item {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__item-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
  }

  &__item-info {
    flex: 1;
  }

  &__item-name {
    font-weight: 600;
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
  }

  &__item-details,
  &__item-quantity {
    font-size: 0.8rem;
    color: #666;
  }

  &__item-price {
    font-weight: 600;
    color: #1a1a1a;
  }

  &__totals {
    border-bottom: 1px solid #eee;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
  }

  &__total-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;

    &--final {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 2px solid #eee;
    }
  }

  &__checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9375rem;
    color: #333;
    cursor: pointer;

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
  }

  &__submit-btn {
    width: 100%;
    padding: 1rem;
    background: #b9c6aa;
    color: #2f3a2a;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #a8b599;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(185, 198, 170, 0.3);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__error {
    margin-top: 1rem;
    padding: 1rem;
    background: #fee;
    color: #c33;
    border-radius: 8px;
    font-size: 0.9rem;
  }
}

// Delivery Methods
.checkout__delivery-methods {
  // No margin needed since it's in its own card now
}

.delivery-methods {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-top: 0.75rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.delivery-provider-selection {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.75rem;
  }
}

.provider-radio {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 0;
  box-sizing: border-box;

  @media (max-width: 640px) {
    width: 100%;
    flex: none;
  }

  &:hover {
    border-color: #b9c6aa;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  input[type="radio"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #b9c6aa;
  }

  input[type="radio"]:checked + .provider-radio__label {
    color: #b9c6aa;
  }

  &__label {
    flex: 1;
    font-size: 1rem;
    color: #1a1a1a;
    transition: color 0.2s ease;

    strong {
      font-weight: 600;
    }
  }

  &:has(input:checked) {
    border-color: #b9c6aa;
    background: rgba(185, 198, 170, 0.05);
  }
}

.delivery-method {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;

  &:hover {
    border-color: #b9c6aa;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &--active {
    border-color: #b9c6aa;
    background: rgba(185, 198, 170, 0.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &__icon {
    width: 32px;
    height: 32px;
    color: #666;
  }

  &__name {
    font-weight: 600;
    color: #1a1a1a;
    font-size: 0.9375rem;
  }

  &__desc {
    font-size: 0.8125rem;
    color: #666;
  }
}

.checkout__econt-map-container {
  position: relative;
  z-index: 1;

  p {
    margin-bottom: 1rem;
    color: #666;
    font-size: 0.9rem;
  }
}

.checkout__econt-widget-container {
  margin-bottom: 2rem;
  padding: 1.25rem;
  background: rgba(185, 198, 170, 0.05);
  border: 1px solid #b9c6aa;
  border-radius: 8px;
  min-height: 400px;

  #econt-widget {
    width: 100%;
  }
}

.checkout__econt-iframe-container {
  margin-bottom: 2rem;
  padding: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  p {
    padding: 1rem 1.25rem;
    margin: 0;
    background: rgba(185, 198, 170, 0.05);
    border-bottom: 1px solid #eee;
  }
}

.checkout__econt-iframe {
  width: 100%;
  min-height: 600px;
  height: 600px;
  border: none;
  display: block;
  background: white;
}

.checkout__econt-selector {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .form-group {
    margin-bottom: 1.25rem;
  }

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #b9c6aa;
    }
  }
}

.checkout__selected-office-summary {
  padding: 1.5rem;
  background: rgba(185, 198, 170, 0.05);
  border: 2px solid #b9c6aa;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.checkout__selected-office-info {
  flex: 1;
}

.checkout__selected-office-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #b9c6aa;
  color: #2f3a2a;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 999px;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.checkout__selected-office-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem;
}

.checkout__selected-office-address {
  font-size: 0.9375rem;
  color: #666;
  margin: 0 0 0.75rem;
}

.checkout__selected-office-price {
  font-size: 1rem;
  color: #2f3a2a;
  margin: 0;

  strong {
    font-weight: 700;
    color: #2f3a2a;
  }
}

.checkout__change-office-btn {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #b9c6aa;
  border-radius: 8px;
  color: #2f3a2a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: normal;

  @media (max-width: 640px) {
    white-space: normal;
    word-wrap: break-word;
  }

  &:hover {
    background: #b9c6aa;
    color: white;
  }
}

.checkout__shipping-info {
  margin-top: 1rem;
  padding: 0.875rem 1.125rem;
  background: rgba(185, 198, 170, 0.1);
  border-left: 3px solid #b9c6aa;
  border-radius: 6px;
  font-size: 0.9375rem;
  color: #2f3a2a;

  strong {
    color: #2f3a2a;
    font-weight: 700;
  }
}

.checkout__loading {
  text-align: center;
  padding: 1rem;
  color: #666;
}

// Address Option Cards
.address-option {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  position: relative;

  &:hover {
    border-color: #b9c6aa;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &--active {
    border-color: #b9c6aa;
    background: rgba(185, 198, 170, 0.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &--new {
    border-style: dashed;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__content {
    flex: 1;
  }

  &__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  &__badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background: #b9c6aa;
    color: #2f3a2a;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    border-radius: 4px;
    letter-spacing: 0.05em;
  }

  &__type-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 4px;

    &--home {
      background: rgba(59, 130, 246, 0.1);
      color: #1e40af;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    &--econt {
      background: rgba(185, 198, 170, 0.2);
      color: #2f3a2a;
      border: 1px solid #b9c6aa;
    }
  }

  &__street {
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 0.25rem;
    font-size: 0.9375rem;
  }

  &__city {
    font-size: 0.875rem;
    color: #666;
    margin: 0;
  }

  &__check {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 20px;
    height: 20px;
    color: #b9c6aa;
  }
}

.checkout__load-more-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  color: #666;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #b9c6aa;
    color: #2f3a2a;
    background: rgba(185, 198, 170, 0.05);
  }
}

.checkout__new-address-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.875rem 1rem;
  background: white;
  border: 2px solid #b9c6aa;
  border-radius: 8px;
  color: #2f3a2a;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #b9c6aa;
    color: white;

    .checkout__new-address-icon {
      color: white;
    }
  }

  &--active {
    background: #b9c6aa;
    color: white;

    .checkout__new-address-icon {
      color: white;
    }
  }
}

.checkout__new-address-icon {
  width: 20px;
  height: 20px;
  color: #b9c6aa;
  transition: color 0.2s ease;
}

// Guest Checkout Styles
.checkout__auth-toggle {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.auth-toggle__btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    color: #333;
  }

  &--active {
    background: #b9c6aa;
    color: white;
    border-color: #a8b599;
  }
}

.auth-toggle__icon {
  width: 20px;
  height: 20px;
}

.checkout__guest-form {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8125rem;
  color: #666;
}

.form-error {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8125rem;
  color: #e74c3c;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.required {
  color: #e74c3c;
}

.required {
  color: #e74c3c;
}

.checkout__calculate-btn-container {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.checkout__calculate-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #2f3a2a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: #3e4c38;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.checkout__calculate-hint {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: #666;
  font-style: italic;
  text-align: center;
}
</style>
