<template>
  <div class="checkout-guest-form">
    <div class="checkout-guest-form__row">
      <div class="checkout-guest-form__group">
        <label class="checkout-guest-form__label">
          Имейл <span class="checkout-guest-form__required">*</span>
        </label>
        <input
          :model-value="guestForm.email"
          type="email"
          :class="[
            'checkout-guest-form__input',
            { 'checkout-guest-form__input--error': validationErrors.guestEmail },
          ]"
          placeholder="your@email.com"
          required
          @blur="$emit('validate-field', 'guestEmail', guestForm.email)"
          @input="updateField('email', $event)"
        />
        <small v-if="validationErrors.guestEmail" class="checkout-guest-form__error">
          {{ validationErrors.guestEmail }}
        </small>
        <small v-else class="checkout-guest-form__hint"
          >Ще получите потвърждение на този имейл</small
        >
      </div>
    </div>

    <div class="checkout-guest-form__row">
      <div class="checkout-guest-form__group">
        <label class="checkout-guest-form__label">
          Име <span class="checkout-guest-form__required">*</span>
        </label>
        <input
          :model-value="guestForm.firstName"
          type="text"
          :class="[
            'checkout-guest-form__input',
            { 'checkout-guest-form__input--error': validationErrors.guestFirstName },
          ]"
          placeholder="Иван"
          required
          @blur="$emit('validate-field', 'guestFirstName', guestForm.firstName)"
          @input="updateField('firstName', $event)"
        />
        <small v-if="validationErrors.guestFirstName" class="checkout-guest-form__error">
          {{ validationErrors.guestFirstName }}
        </small>
      </div>
      <div class="checkout-guest-form__group">
        <label class="checkout-guest-form__label">
          Фамилия <span class="checkout-guest-form__required">*</span>
        </label>
        <input
          :model-value="guestForm.lastName"
          type="text"
          :class="[
            'checkout-guest-form__input',
            { 'checkout-guest-form__input--error': validationErrors.guestLastName },
          ]"
          placeholder="Иванов"
          required
          @blur="$emit('validate-field', 'guestLastName', guestForm.lastName)"
          @input="updateField('lastName', $event)"
        />
        <small v-if="validationErrors.guestLastName" class="checkout-guest-form__error">
          {{ validationErrors.guestLastName }}
        </small>
      </div>
    </div>

    <div class="checkout-guest-form__row">
      <div class="checkout-guest-form__group">
        <label class="checkout-guest-form__label">
          Телефон <span class="checkout-guest-form__required">*</span>
        </label>
        <input
          :model-value="guestForm.phone"
          type="tel"
          :class="[
            'checkout-guest-form__input',
            { 'checkout-guest-form__input--error': validationErrors.guestPhone },
          ]"
          placeholder="+359 888 123 456"
          required
          @blur="$emit('validate-field', 'guestPhone', guestForm.phone)"
          @input="updateField('phone', $event)"
        />
        <small v-if="validationErrors.guestPhone" class="checkout-guest-form__error">
          {{ validationErrors.guestPhone }}
        </small>
      </div>
    </div>

    <!-- Address fields for guest courier delivery -->
    <template v-if="deliveryMethod === 'courier_address'">
      <div class="checkout-guest-form__row">
        <div class="checkout-guest-form__group">
          <label class="checkout-guest-form__label">
            Адрес <span class="checkout-guest-form__required">*</span>
          </label>
          <input
            :model-value="shippingForm.street"
            type="text"
            :class="[
              'checkout-guest-form__input',
              { 'checkout-guest-form__input--error': validationErrors.shippingStreet },
            ]"
            placeholder="Улица, номер, етаж, апартамент"
            required
            @blur="$emit('validate-field', 'shippingStreet', shippingForm.street)"
            @input="updateShippingField('street', $event)"
          />
          <small v-if="validationErrors.shippingStreet" class="checkout-guest-form__error">
            {{ validationErrors.shippingStreet }}
          </small>
        </div>
      </div>

      <div class="checkout-guest-form__row">
        <div class="checkout-guest-form__group">
          <label class="checkout-guest-form__label">
            Град <span class="checkout-guest-form__required">*</span>
          </label>
          <input
            :model-value="shippingForm.city"
            type="text"
            :class="[
              'checkout-guest-form__input',
              { 'checkout-guest-form__input--error': validationErrors.shippingCity },
            ]"
            required
            @blur="$emit('validate-field', 'shippingCity', shippingForm.city)"
            @input="updateShippingField('city', $event)"
          />
          <small v-if="validationErrors.shippingCity" class="checkout-guest-form__error">
            {{ validationErrors.shippingCity }}
          </small>
        </div>
        <div class="checkout-guest-form__group">
          <label class="checkout-guest-form__label">
            Пощенски код <span class="checkout-guest-form__required">*</span>
          </label>
          <input
            :model-value="shippingForm.postalCode"
            type="text"
            :class="[
              'checkout-guest-form__input',
              { 'checkout-guest-form__input--error': validationErrors.shippingPostalCode },
            ]"
            required
            @blur="$emit('validate-field', 'shippingPostalCode', shippingForm.postalCode)"
            @input="updateShippingField('postalCode', $event)"
          />
          <small v-if="validationErrors.shippingPostalCode" class="checkout-guest-form__error">
            {{ validationErrors.shippingPostalCode }}
          </small>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
interface GuestForm {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface ShippingForm {
  street: string;
  city: string;
  postalCode: string;
}

interface Props {
  guestForm: GuestForm;
  shippingForm: ShippingForm;
  deliveryMethod: string;
  validationErrors: Record<string, string>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:guestForm": [value: GuestForm];
  "update:shippingForm": [value: ShippingForm];
  "validate-field": [fieldName: string, value: string];
  "clear-error": [fieldName: string];
}>();

const updateField = (field: keyof GuestForm, event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:guestForm", {
    ...props.guestForm,
    [field]: target.value,
  });
  emit("clear-error", `guest${field.charAt(0).toUpperCase() + field.slice(1)}`);
};

const updateShippingField = (field: keyof ShippingForm, event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:shippingForm", {
    ...props.shippingForm,
    [field]: target.value,
  });
  emit("clear-error", `shipping${field.charAt(0).toUpperCase() + field.slice(1)}`);
};
</script>

<style scoped lang="scss">
.checkout-guest-form {
  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.25rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  &__group {
    margin-bottom: 1.25rem;
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

  &__input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
    box-sizing: border-box;

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

  &__hint {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.8125rem;
    color: #666;
  }

  &__error {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.8125rem;
    color: #e74c3c;
    animation: slideDown 0.2s ease-out;
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

