<template>
  <form class="checkout-shipping-address" @submit.prevent="$emit('submit')">
    <div class="checkout-shipping-address__row checkout-shipping-address__row--names">
      <div class="checkout-shipping-address__group">
        <label for="firstName" class="checkout-shipping-address__label">
          Име <span class="checkout-shipping-address__required">*</span>
        </label>
        <input
          id="firstName"
          :model-value="shippingForm.firstName"
          type="text"
          class="checkout-shipping-address__input"
          required
          @input="updateField('firstName', $event)"
        />
      </div>

      <div class="checkout-shipping-address__group">
        <label for="lastName" class="checkout-shipping-address__label">
          Фамилия <span class="checkout-shipping-address__required">*</span>
        </label>
        <input
          id="lastName"
          :model-value="shippingForm.lastName"
          type="text"
          class="checkout-shipping-address__input"
          required
          @input="updateField('lastName', $event)"
        />
      </div>
    </div>

    <div class="checkout-shipping-address__row">
      <div class="checkout-shipping-address__group">
        <label for="email" class="checkout-shipping-address__label">
          Имейл <span class="checkout-shipping-address__required">*</span>
        </label>
        <input
          id="email"
          :model-value="shippingForm.email"
          type="email"
          class="checkout-shipping-address__input"
          required
          @input="updateField('email', $event)"
        />
      </div>

      <div class="checkout-shipping-address__group">
        <label for="phone" class="checkout-shipping-address__label">
          Телефон <span class="checkout-shipping-address__required">*</span>
        </label>
        <input
          id="phone"
          :model-value="shippingForm.phone"
          type="tel"
          class="checkout-shipping-address__input"
          required
          @input="updateField('phone', $event)"
        />
      </div>
    </div>

    <!-- Address fields (only for courier delivery) -->
    <template v-if="deliveryMethod === 'courier_address'">
      <div class="checkout-shipping-address__group checkout-shipping-address__group--address">
        <label for="street" class="checkout-shipping-address__label">
          Адрес <span class="checkout-shipping-address__required">*</span>
        </label>
        <input
          id="street"
          :model-value="shippingForm.street"
          type="text"
          :class="[
            'checkout-shipping-address__input',
            { 'checkout-shipping-address__input--error': validationErrors.shippingStreet },
          ]"
          placeholder="Улица, номер, етаж, апартамент"
          :required="deliveryMethod === 'courier_address'"
          @blur="$emit('validate-field', 'shippingStreet', shippingForm.street)"
          @input="updateField('street', $event)"
        />
        <small v-if="validationErrors.shippingStreet" class="checkout-shipping-address__error">
          {{ validationErrors.shippingStreet }}
        </small>
      </div>

      <div class="checkout-shipping-address__row checkout-shipping-address__row--city-postal">
        <div class="checkout-shipping-address__group checkout-shipping-address__group--city">
          <label for="city" class="checkout-shipping-address__label">
            Град <span class="checkout-shipping-address__required">*</span>
          </label>
          <input
            id="city"
            :model-value="shippingForm.city"
            type="text"
            :class="[
              'checkout-shipping-address__input',
              { 'checkout-shipping-address__input--error': validationErrors.shippingCity },
            ]"
            :required="deliveryMethod === 'courier_address'"
            @blur="$emit('validate-field', 'shippingCity', shippingForm.city)"
            @input="updateField('city', $event)"
          />
          <small v-if="validationErrors.shippingCity" class="checkout-shipping-address__error">
            {{ validationErrors.shippingCity }}
          </small>
        </div>

        <div class="checkout-shipping-address__group checkout-shipping-address__group--postal">
          <label for="postalCode" class="checkout-shipping-address__label">
            Пощенски код <span class="checkout-shipping-address__required">*</span>
          </label>
          <input
            id="postalCode"
            :model-value="shippingForm.postalCode"
            type="text"
            :class="[
              'checkout-shipping-address__input',
              { 'checkout-shipping-address__input--error': validationErrors.shippingPostalCode },
            ]"
            maxlength="5"
            :required="deliveryMethod === 'courier_address'"
            @blur="$emit('validate-field', 'shippingPostalCode', shippingForm.postalCode)"
            @input="updateField('postalCode', $event)"
          />
          <small
            v-if="validationErrors.shippingPostalCode"
            class="checkout-shipping-address__error"
          >
            {{ validationErrors.shippingPostalCode }}
          </small>
        </div>
      </div>
    </template>

    <!-- Save Address Checkbox (only for authenticated users with new addresses) -->
    <div
      v-if="selectedAddressId === null"
      class="checkout-shipping-address__group"
    >
      <label class="checkout-shipping-address__checkbox-label">
        <input
          :model-value="saveNewAddress"
          type="checkbox"
          @change="$emit('update:saveNewAddress', ($event.target as HTMLInputElement).checked)"
        />
        <span>Запази този адрес за бъдещи поръчки</span>
      </label>
    </div>

    <div class="checkout-shipping-address__group">
      <label for="notes" class="checkout-shipping-address__label">
        Бележки към поръчката (опционално)
      </label>
      <textarea
        id="notes"
        :model-value="shippingForm.notes"
        class="checkout-shipping-address__textarea"
        rows="3"
        placeholder="Допълнителни инструкции за доставка..."
        @input="updateField('notes', $event)"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
}

interface Props {
  shippingForm: ShippingForm;
  deliveryMethod: string;
  validationErrors: Record<string, string>;
  saveNewAddress: boolean;
  selectedAddressId: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:shippingForm": [value: ShippingForm];
  "update:saveNewAddress": [value: boolean];
  "validate-field": [fieldName: string, value: string];
  submit: [];
}>();

const updateField = (field: keyof ShippingForm, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit("update:shippingForm", {
    ...props.shippingForm,
    [field]: target.value,
  });
  emit("validate-field", `shipping${field.charAt(0).toUpperCase() + field.slice(1)}`, target.value);
};
</script>

<style scoped lang="scss">
.checkout-shipping-address {
  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }

    &--names {
      @media (max-width: 640px) {
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }
    }

    &--city-postal {
      grid-template-columns: 60% 40%;
      gap: 0.75rem;

      @media (max-width: 640px) {
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }
    }
  }

  &__group {
    margin-bottom: 1.25rem;

    &--address {
      margin-bottom: 1.25rem;
    }

    &--city,
    &--postal {
      margin-bottom: 1.25rem;
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
    box-sizing: border-box;
    font-family: inherit;

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
  }

  &__error {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.8125rem;
    color: #e74c3c;
    animation: slideDown 0.2s ease-out;
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
</style>

