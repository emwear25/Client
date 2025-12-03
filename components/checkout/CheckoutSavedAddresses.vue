<template>
  <div class="checkout-saved-addresses">
    <label class="checkout-saved-addresses__label">Изберете адрес</label>
    <div class="checkout-saved-addresses__options">
      <button
        v-for="address in displayedAddresses"
        :key="address._id"
        type="button"
        class="checkout-saved-addresses__option"
        :class="{
          'checkout-saved-addresses__option--active': selectedAddressId === address._id,
        }"
        @click="$emit('select-address', address)"
      >
        <div class="checkout-saved-addresses__content">
          <div class="checkout-saved-addresses__badges">
            <div v-if="address.isDefault" class="checkout-saved-addresses__badge">
              По подразбиране
            </div>
            <div
              v-if="address.type === 'econt_office'"
              class="checkout-saved-addresses__type-badge checkout-saved-addresses__type-badge--econt"
            >
              📦 Офис на Еконт
            </div>
            <div
              v-else-if="address.type === 'econt_automat'"
              class="checkout-saved-addresses__type-badge checkout-saved-addresses__type-badge--econt"
            >
              🤖 Еконтомат
            </div>
            <div
              v-else
              class="checkout-saved-addresses__type-badge checkout-saved-addresses__type-badge--home"
            >
              🏠 Личен адрес
            </div>
          </div>
          <p class="checkout-saved-addresses__street">{{ address.street }}</p>
          <p class="checkout-saved-addresses__city">{{ address.city }}, {{ address.postalCode }}</p>
        </div>
        <svg
          v-if="selectedAddressId === address._id"
          class="checkout-saved-addresses__check"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    </div>

    <!-- Load More Addresses Button -->
    <button
      v-if="hasMoreAddresses"
      type="button"
      class="checkout-saved-addresses__load-more-btn"
      @click="$emit('load-more')"
    >
      Покажи всички адреси ({{ totalAddresses - displayedAddresses.length }} още)
    </button>

    <!-- New Address Button -->
    <button
      type="button"
      class="checkout-saved-addresses__new-address-btn"
      :class="{
        'checkout-saved-addresses__new-address-btn--active': selectedAddressId === null,
      }"
      @click="$emit('new-address')"
    >
      <svg
        class="checkout-saved-addresses__new-address-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      Нов адрес
    </button>
  </div>
</template>

<script setup lang="ts">
interface Address {
  _id: string;
  street: string;
  city: string;
  postalCode: string;
  type?: string;
  isDefault?: boolean;
  econtOfficeCode?: string;
  econtOfficeName?: string;
}

interface Props {
  displayedAddresses: Address[];
  selectedAddressId: string | null;
  hasMoreAddresses: boolean;
  totalAddresses: number;
}

defineProps<Props>();

defineEmits<{
  "select-address": [address: Address];
  "load-more": [];
  "new-address": [];
}>();
</script>

<style scoped lang="scss">
.checkout-saved-addresses {
  &__label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
    font-size: 0.9rem;
  }

  &__options {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-top: 0.75rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__option {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    position: relative;
    width: 100%;
    box-sizing: border-box;

    &:hover {
      border-color: #b9c6aa;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    &--active {
      border-color: #b9c6aa;
      background: rgba(185, 198, 170, 0.05);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
  }

  &__content {
    flex: 1;
    min-width: 0;
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
    word-wrap: break-word;
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
    flex-shrink: 0;
  }

  &__load-more-btn {
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
    box-sizing: border-box;

    &:hover {
      border-color: #b9c6aa;
      color: #2f3a2a;
      background: rgba(185, 198, 170, 0.05);
    }
  }

  &__new-address-btn {
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
    box-sizing: border-box;

    &:hover {
      background: #b9c6aa;
      color: white;

      .checkout-saved-addresses__new-address-icon {
        color: white;
      }
    }

    &--active {
      background: #b9c6aa;
      color: white;

      .checkout-saved-addresses__new-address-icon {
        color: white;
      }
    }
  }

  &__new-address-icon {
    width: 20px;
    height: 20px;
    color: #2f3a2a;
    transition: color 0.2s;
  }
}
</style>

