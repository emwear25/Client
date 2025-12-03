<template>
  <div class="checkout-delivery-method">
    <!-- Delivery Provider Selection -->
    <div class="checkout-delivery-method__section">
      <h2 class="checkout-delivery-method__section-title">Метод на доставка</h2>

      <!-- Delivery Provider Selection (Econt vs Speedy) -->
      <div class="checkout-delivery-method__provider-selection">
        <label class="checkout-delivery-method__provider-radio">
          <input
            :checked="modelValue.provider === 'econt'"
            type="radio"
            value="econt"
            @change="handleProviderChange('econt')"
          />
          <span class="checkout-delivery-method__provider-label">
            <strong>Доставка с Econt</strong>
          </span>
        </label>

        <label class="checkout-delivery-method__provider-radio">
          <input
            :checked="modelValue.provider === 'speedy'"
            type="radio"
            value="speedy"
            @change="handleProviderChange('speedy')"
          />
          <span class="checkout-delivery-method__provider-label">
            <strong>Доставка със Speedy</strong>
          </span>
        </label>
      </div>

      <!-- Delivery Method Buttons -->
      <div class="checkout-delivery-method__methods">
        <div class="checkout-delivery-method__methods-grid">
          <!-- Econt Methods -->
          <template v-if="modelValue.provider === 'econt'">
            <button
              type="button"
              class="checkout-delivery-method__method"
              :class="{
                'checkout-delivery-method__method--active': modelValue.method === 'courier_address',
              }"
              @click="$emit('update:modelValue', { ...modelValue, method: 'courier_address' })"
            >
              <svg
                class="checkout-delivery-method__method-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <div>
                <div class="checkout-delivery-method__method-name">Куриер до адрес</div>
                <div class="checkout-delivery-method__method-desc">Доставка до посочен адрес</div>
              </div>
            </button>

            <button
              type="button"
              class="checkout-delivery-method__method"
              :class="{
                'checkout-delivery-method__method--active': modelValue.method === 'econt_office',
              }"
              @click="$emit('update:modelValue', { ...modelValue, method: 'econt_office' })"
            >
              <svg
                class="checkout-delivery-method__method-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <div>
                <div class="checkout-delivery-method__method-name">Офис на Еконт</div>
                <div class="checkout-delivery-method__method-desc">Вземане от офис</div>
              </div>
            </button>

            <button
              type="button"
              class="checkout-delivery-method__method"
              :class="{
                'checkout-delivery-method__method--active': modelValue.method === 'econt_automat',
              }"
              @click="$emit('update:modelValue', { ...modelValue, method: 'econt_automat' })"
            >
              <svg
                class="checkout-delivery-method__method-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                <polyline points="17 2 12 7 7 2" />
              </svg>
              <div>
                <div class="checkout-delivery-method__method-name">Eконтомат</div>
                <div class="checkout-delivery-method__method-desc">Автоматична кутия</div>
              </div>
            </button>
          </template>

          <!-- Speedy Methods -->
          <template v-else-if="modelValue.provider === 'speedy'">
            <button
              type="button"
              class="checkout-delivery-method__method"
              :class="{
                'checkout-delivery-method__method--active': modelValue.method === 'courier_address',
              }"
              @click="$emit('update:modelValue', { ...modelValue, method: 'courier_address' })"
            >
              <svg
                class="checkout-delivery-method__method-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v4M12 19v4M1 12h4M19 12h4" />
              </svg>
              <div>
                <div class="checkout-delivery-method__method-name">Куриер до адрес</div>
                <div class="checkout-delivery-method__method-desc">Доставка до врата</div>
              </div>
            </button>

            <button
              type="button"
              class="checkout-delivery-method__method"
              :class="{
                'checkout-delivery-method__method--active': modelValue.method === 'speedy_office',
              }"
              @click="$emit('update:modelValue', { ...modelValue, method: 'speedy_office' })"
            >
              <svg
                class="checkout-delivery-method__method-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <div>
                <div class="checkout-delivery-method__method-name">Офис на Speedy</div>
                <div class="checkout-delivery-method__method-desc">Вземане от офис</div>
              </div>
            </button>

            <button
              type="button"
              class="checkout-delivery-method__method"
              :class="{
                'checkout-delivery-method__method--active': modelValue.method === 'speedy_apt',
              }"
              @click="$emit('update:modelValue', { ...modelValue, method: 'speedy_apt' })"
            >
              <svg
                class="checkout-delivery-method__method-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                <polyline points="17 2 12 7 7 2" />
              </svg>
              <div>
                <div class="checkout-delivery-method__method-name">Автомат Speedy (APT)</div>
                <div class="checkout-delivery-method__method-desc">Автоматична кутия</div>
              </div>
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Econt Office Selection -->
    <div
      v-if="modelValue.provider === 'econt' && modelValue.method !== 'courier_address'"
      class="checkout-delivery-method__section"
    >
      <h2 class="checkout-delivery-method__section-title">
        Изберете
        {{ modelValue.method === "econt_automat" ? "eконтомат" : "офис" }} на Еконт
      </h2>

      <!-- Show selected office summary -->
      <div
        v-if="selectedOffice && !showEcontIframe"
        class="checkout-delivery-method__office-summary"
      >
        <div class="checkout-delivery-method__office-info">
          <div class="checkout-delivery-method__office-badge">✅ Избран офис</div>
          <h3 class="checkout-delivery-method__office-name">{{ selectedOffice.name }}</h3>
          <p class="checkout-delivery-method__office-address">
            📍 {{ selectedCity?.name || "" }}
            <span v-if="selectedOffice.address?.fullAddress">
              - {{ selectedOffice.address.fullAddress }}</span
            >
          </p>
          <p v-if="econtShippingCost > 0" class="checkout-delivery-method__office-price">
            💰 Цена за доставка:
            <strong>{{ econtShippingCost.toFixed(2) }} лв</strong>
          </p>
        </div>
        <button
          type="button"
          class="checkout-delivery-method__change-office-btn"
          @click="$emit('show-econt-iframe')"
        >
          ✏️ Промени офис
        </button>
      </div>

      <!-- Econt iframe with map -->
      <div v-else class="checkout-delivery-method__iframe-container">
        <p class="checkout-delivery-method__iframe-label">
          📍 Изберете офис или адрес за доставка с Еконт:
        </p>
        <iframe
          :src="econtIframeUrl"
          class="checkout-delivery-method__iframe"
          frameborder="0"
          allow="geolocation"
        />

        <!-- Hidden field to store customer info ID -->
        <input
          :value="econtCustomerInfoId"
          type="hidden"
          name="customerInfo[id]"
          @input="$emit('update:econtCustomerInfoId', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- Speedy Office Selection -->
    <div
      v-if="modelValue.provider === 'speedy' && modelValue.method !== 'courier_address'"
      class="checkout-delivery-method__section"
    >
      <h2 class="checkout-delivery-method__section-title">
        Изберете
        {{ modelValue.method === "speedy_apt" ? "автомат" : "офис" }} на Speedy
      </h2>

      <!-- Show selected office summary -->
      <div
        v-if="selectedSpeedyOffice && !showSpeedyIframe"
        class="checkout-delivery-method__office-summary"
      >
        <div class="checkout-delivery-method__office-info">
          <div class="checkout-delivery-method__office-badge">✅ Избран офис</div>
          <h3 class="checkout-delivery-method__office-name">{{ selectedSpeedyOffice.name }}</h3>
          <p class="checkout-delivery-method__office-address">
            📍 {{ selectedSpeedyOffice.address?.city?.name || "" }}
            <span v-if="selectedSpeedyOffice.address?.fullAddress">
              - {{ selectedSpeedyOffice.address.fullAddress }}</span
            >
          </p>
          <p v-if="speedyShippingCost > 0" class="checkout-delivery-method__office-price">
            💰 Цена за доставка:
            <strong>{{ speedyShippingCost.toFixed(2) }} лв</strong>
          </p>
        </div>
        <button
          type="button"
          class="checkout-delivery-method__change-office-btn"
          @click="$emit('show-speedy-iframe')"
        >
          ✏️ Промени офис
        </button>
      </div>

      <!-- Speedy iframe with map -->
      <div v-else class="checkout-delivery-method__iframe-container">
        <p class="checkout-delivery-method__iframe-label">
          📍 Изберете офис или адрес за доставка със Speedy:
        </p>
        <iframe
          :src="speedyIframeUrl"
          class="checkout-delivery-method__iframe"
          frameborder="0"
          allow="geolocation"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface DeliveryValue {
  provider: "econt" | "speedy";
  method:
    | "courier_address"
    | "econt_office"
    | "econt_automat"
    | "speedy_office"
    | "speedy_apt";
}

interface Office {
  code?: string;
  name: string;
  address?: {
    fullAddress?: string;
    city?: {
      name?: string;
    };
  };
}

interface City {
  name?: string;
}

interface Props {
  modelValue: DeliveryValue;
  selectedOffice: Office | null;
  selectedSpeedyOffice: Office | null;
  selectedCity: City | null;
  econtShippingCost: number;
  speedyShippingCost: number;
  showEcontIframe: boolean;
  showSpeedyIframe: boolean;
  econtCustomerInfoId: string;
  shippingCity?: string;
  shippingPostalCode?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: DeliveryValue];
  "update:showEcontIframe": [value: boolean];
  "update:showSpeedyIframe": [value: boolean];
  "update:econtCustomerInfoId": [value: string];
  "show-econt-iframe": [];
  "show-speedy-iframe": [];
}>();

const handleProviderChange = (provider: "econt" | "speedy") => {
  emit("update:modelValue", {
    provider,
    method: "courier_address",
  });
  if (provider === "econt") {
    emit("update:showSpeedyIframe", true);
  } else {
    emit("update:showEcontIframe", true);
  }
};

const econtIframeUrl = computed(() => {
  const params = new URLSearchParams({
    shopUrl: typeof window !== "undefined" ? window.location.origin : "",
    city: props.shippingCity || "София",
    officeType: props.modelValue.method === "econt_automat" ? "aps" : "office",
    lang: "bg",
  });
  return `https://officelocator.econt.com/?${params.toString()}`;
});

const speedyIframeUrl = computed(() => {
  const params = new URLSearchParams({
    lang: "bg",
    showOfficesList: "0",
    dropOff: "1",
    pickUp: "1",
    officeType: props.modelValue.method === "speedy_apt" ? "APT" : "ALL",
    selectOfficeButtonCaption: "Избери този офис",
  });

  if (props.shippingCity) {
    params.append("siteName", props.shippingCity);
  }
  if (props.shippingPostalCode) {
    params.append("postcode", props.shippingPostalCode);
  }

  return `https://services.speedy.bg/office_locator_widget_v3/office_locator.php?${params.toString()}`;
});
</script>

<style scoped lang="scss">
.checkout-delivery-method {
  &__section {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
    margin-bottom: 2rem;

    &:last-child {
      margin-bottom: 0;
    }

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

  &__provider-selection {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.625rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  &__provider-radio {
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

    &:has(input:checked) {
      border-color: #b9c6aa;
      background: rgba(185, 198, 170, 0.05);
    }
  }

  &__provider-label {
    flex: 1;
    font-size: 1rem;
    color: #1a1a1a;
    transition: color 0.2s ease;

    strong {
      font-weight: 600;
    }
  }

  &__methods {
    margin-top: 0.75rem;
  }

  &__methods-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.625rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__method {
    background: #fafafa;
    border: 1.5px solid #e5e7eb;
    border-radius: 6px;
    padding: 0.625rem;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    text-align: left;
    width: 100%;
    box-sizing: border-box;

    &:hover {
      border-color: #b9c6aa;
      background: white;
    }

    &--active {
      border-color: #b9c6aa;
      background: rgba(185, 198, 170, 0.08);
      box-shadow: 0 0 0 1px rgba(185, 198, 170, 0.2);
    }
  }

  &__method-icon {
    width: 20px;
    height: 20px;
    color: #6b7280;
    flex-shrink: 0;
  }

  &__method-name {
    font-weight: 600;
    color: #1a1a1a;
    font-size: 0.875rem;
    line-height: 1.3;
    margin: 0 0 0.125rem 0;
  }

  &__method-desc {
    font-size: 0.75rem;
    color: #6b7280;
    line-height: 1.3;
    margin: 0;
  }

  &__office-summary {
    padding: 1.5rem;
    background: rgba(185, 198, 170, 0.05);
    border: 2px solid #b9c6aa;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    flex-wrap: wrap;

    @media (max-width: 640px) {
      flex-direction: column;
    }
  }

  &__office-info {
    flex: 1;
    min-width: 0;
  }

  &__office-badge {
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

  &__office-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 0.5rem;
    word-wrap: break-word;
  }

  &__office-address {
    font-size: 0.9375rem;
    color: #666;
    margin: 0 0 0.75rem;
    word-wrap: break-word;
  }

  &__office-price {
    font-size: 1rem;
    color: #2f3a2a;
    margin: 0;

    strong {
      font-weight: 700;
      color: #2f3a2a;
    }
  }

  &__change-office-btn {
    padding: 0.75rem 1.5rem;
    background: white;
    border: 2px solid #b9c6aa;
    border-radius: 8px;
    color: #2f3a2a;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: normal;
    box-sizing: border-box;

    @media (max-width: 640px) {
      width: 100%;
    }

    &:hover {
      background: #b9c6aa;
      color: white;
    }
  }

  &__iframe-container {
    margin-bottom: 2rem;
    padding: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    width: 100%;
    box-sizing: border-box;
  }

  &__iframe-label {
    margin: 0;
    padding: 1rem 1.25rem;
    background: rgba(185, 198, 170, 0.05);
    border-bottom: 1px solid #eee;
  }

  &__iframe {
    width: 100%;
    min-height: 600px;
    height: 600px;
    border: none;
    display: block;
    background: white;

    @media (max-width: 640px) {
      min-height: 500px;
      height: 500px;
    }
  }
}
</style>

