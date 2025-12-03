<template>
  <div class="profile-edit-page">
    <div class="container">
      <div class="profile-edit-page__header">
        <h1 class="profile-edit-page__title">Редактиране на профил</h1>
        <button type="button" class="profile-edit-page__back" @click="$router.back()">
          ← Назад към профила
        </button>
      </div>

      <div class="profile-edit-card">
        <form @submit.prevent="handleSubmit">
          <!-- Personal Information -->
          <div class="form-section">
            <h2 class="form-section__title">Лична информация</h2>

            <div class="form-row">
              <div class="form-group">
                <label for="firstName" class="form-label">Име</label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  class="form-input"
                  placeholder="Вашето име"
                >
              </div>

              <div class="form-group">
                <label for="lastName" class="form-label">Фамилия</label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  class="form-input"
                  placeholder="Вашата фамилия"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="phone" class="form-label">Телефон</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="form-input"
                placeholder="+359 ..."
              >
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Имейл</label>
              <input
                id="email"
                v-model="authStore.user.email"
                type="email"
                class="form-input"
                disabled
              >
              <p class="form-hint">Имейлът не може да бъде променен</p>
            </div>
          </div>

          <!-- Saved Addresses -->
          <div class="form-section">
            <div class="form-section__header">
              <h2 class="form-section__title">Запазени адреси</h2>
              <button
                type="button"
                class="btn btn--outline btn--small"
                @click="openAddressDialog()"
              >
                + Добави адрес
              </button>
            </div>

            <div v-if="authStore.user?.addresses?.length" class="addresses-list">
              <div
                v-for="address in authStore.user.addresses"
                :key="address._id"
                class="address-card"
                :class="{ 'address-card--default': address.isDefault }"
              >
                <div class="address-card__content">
                  <div class="address-card__badges">
                    <div v-if="address.isDefault" class="address-card__badge">По подразбиране</div>
                    <div
                      v-if="address.type === 'econt_office'"
                      class="address-card__type-badge address-card__type-badge--econt"
                    >
                      📦 Офис на Еконт
                    </div>
                    <div
                      v-else-if="address.type === 'econt_automat'"
                      class="address-card__type-badge address-card__type-badge--econt"
                    >
                      🤖 Еконтомат
                    </div>
                    <div v-else class="address-card__type-badge address-card__type-badge--home">
                      🏠 Личен адрес
                    </div>
                  </div>
                  <p class="address-card__street">{{ address.street }}</p>
                  <p class="address-card__city">{{ address.city }}, {{ address.postalCode }}</p>
                  <p class="address-card__country">{{ address.country }}</p>
                </div>
                <div class="address-card__actions">
                  <button
                    v-if="!address.isDefault"
                    type="button"
                    class="address-card__btn address-card__btn--primary"
                    @click="setDefaultAddress(address._id)"
                  >
                    Задай по подразбиране
                  </button>
                  <button
                    type="button"
                    class="address-card__btn"
                    @click="openAddressDialog(address)"
                  >
                    Редактирай
                  </button>
                  <button
                    v-if="!address.isDefault"
                    type="button"
                    class="address-card__btn address-card__btn--danger"
                    @click="deleteAddress(address._id)"
                  >
                    Изтрий
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="addresses-list__empty">Нямате запазени адреси</p>
          </div>

          <!-- Submit Button -->
          <div class="form-actions">
            <button type="submit" class="btn btn--primary btn--large" :disabled="isSaving">
              {{ isSaving ? "Запазване..." : "Запази промените" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Address Dialog -->
    <Teleport to="body">
      <div v-if="showAddressDialog" class="dialog-overlay" @click="closeAddressDialog">
        <div class="dialog" @click.stop>
          <div class="dialog__header">
            <h3 class="dialog__title">
              {{ editingAddress ? "Редактиране на адрес" : "Нов адрес" }}
            </h3>
            <button class="dialog__close" @click="closeAddressDialog">×</button>
          </div>

          <form class="dialog__body" @submit.prevent="saveAddress">
            <div class="form-group">
              <label for="addressStreet" class="form-label">Адрес *</label>
              <input
                id="addressStreet"
                v-model="addressForm.street"
                type="text"
                class="form-input"
                placeholder="Улица, номер, етаж, апартамент"
                required
              >
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="addressCity" class="form-label">Град *</label>
                <input
                  id="addressCity"
                  v-model="addressForm.city"
                  type="text"
                  class="form-input"
                  required
                >
              </div>

              <div class="form-group">
                <label for="addressPostalCode" class="form-label">Пощенски код *</label>
                <input
                  id="addressPostalCode"
                  v-model="addressForm.postalCode"
                  type="text"
                  class="form-input"
                  required
                >
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="addressForm.isDefault" type="checkbox" >
                <span>Задай като адрес по подразбиране</span>
              </label>
            </div>

            <div class="dialog__actions">
              <button type="button" class="btn btn--outline" @click="closeAddressDialog">
                Отказ
              </button>
              <button type="submit" class="btn btn--primary" :disabled="isSavingAddress">
                {{ isSavingAddress ? "Запазване..." : "Запази" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useToast } from "~/composables/useToast";
import { useApi } from "~/composables/useApi";

definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const toast = useToast();
const api = useApi();

// Form state
const form = ref({
  firstName: authStore.user?.firstName || "",
  lastName: authStore.user?.lastName || "",
  phone: authStore.user?.phone || "",
});

const isSaving = ref(false);

// Address dialog state
const showAddressDialog = ref(false);
const editingAddress = ref<any>(null);
const addressForm = ref({
  street: "",
  city: "",
  postalCode: "",
  country: "България",
  isDefault: false,
});
const isSavingAddress = ref(false);

// Update profile info
const handleSubmit = async () => {
  isSaving.value = true;

  try {
    await authStore.updateProfile({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phone: form.value.phone,
    });

    toast.success("Профилът е обновен успешно!");
  } catch (error: any) {
    toast.error(error.message || "Грешка при обновяване на профила");
  } finally {
    isSaving.value = false;
  }
};

// Address dialog
const openAddressDialog = (address?: any) => {
  if (address) {
    editingAddress.value = address;
    addressForm.value = {
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country || "България",
      isDefault: address.isDefault,
    };
  } else {
    editingAddress.value = null;
    addressForm.value = {
      street: "",
      city: "",
      postalCode: "",
      country: "България",
      isDefault: !authStore.user?.addresses?.length,
    };
  }
  showAddressDialog.value = true;
};

const closeAddressDialog = () => {
  showAddressDialog.value = false;
  editingAddress.value = null;
};

const saveAddress = async () => {
  isSavingAddress.value = true;

  try {
    if (editingAddress.value) {
      // Update existing address
      await api.patch(`users/addresses/${editingAddress.value._id}`, addressForm.value, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });
      toast.success("Адресът е обновен!");
    } else {
      // Add new address
      await api.post("users/addresses", addressForm.value, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });
      toast.success("Адресът е добавен!");
    }

    // Refresh user data
    await authStore.fetchUser();
    closeAddressDialog();
  } catch (error: any) {
    toast.error(error.data?.message || "Грешка при запазване на адреса");
  } finally {
    isSavingAddress.value = false;
  }
};

const deleteAddress = async (addressId: string) => {
  if (!confirm("Сигурни ли сте, че искате да изтриете този адрес?")) {
    return;
  }

  try {
    await api.delete(`users/addresses/${addressId}`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    toast.success("Адресът е изтрит!");
    await authStore.fetchUser();
  } catch (error: any) {
    toast.error(error.data?.message || "Грешка при изтриване на адреса");
  }
};

const setDefaultAddress = async (addressId: string) => {
  try {
    await api.patch(
      `users/addresses/${addressId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: {
          isDefault: true,
        },
      }
    );

    toast.success("Адресът е зададен по подразбиране!");
    await authStore.fetchUser();
  } catch (error: any) {
    toast.error(error.data?.message || "Грешка при задаване на адрес по подразбиране");
  }
};

useHead({
  title: "Редактиране на профил - emWear",
});
</script>

<style lang="scss" scoped>
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/fonts" as *;
@use "~/assets/styles/breakpoints" as *;

.profile-edit-page {
  min-height: 60vh;
  padding: 2rem 0 4rem;
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;

  &__header {
    margin-bottom: 2rem;
  }

  &__title {
    font-family: $font-heading;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.75rem;
  }

  &__back {
    font-family: $font-body;
    color: $text-secondary;
    text-decoration: none;
    font-size: 0.9375rem;
    transition: color 0.2s;

    &:hover {
      color: $brand-ink;
    }
  }
}

.profile-edit-card {
  background: $bg-card;
  border: 1px solid $border-base;
  border-radius: 14px;
  padding: 2rem;
  box-shadow: 0 4px 12px $shadow-soft;

  @include up(md) {
    padding: 2.5rem;
  }
}

.form-section {
  margin-bottom: 2.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  &__title {
    font-family: $font-heading;
    font-size: 1.25rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 1.5rem;
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @include up(md) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.form-label {
  font-family: $font-body;
  font-size: 0.875rem;
  font-weight: 600;
  color: $brand-ink;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  font-family: $font-body;
  font-size: 1rem;
  color: $text-primary;
  background: $bg-page;
  border: 1px solid $border-base;
  border-radius: 8px;
  transition: all 0.2s ease;

  &::placeholder {
    color: $text-secondary;
  }

  &:focus {
    outline: none;
    border-color: $brand;
    box-shadow: 0 0 0 3px rgba($brand, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: rgba($bg-page, 0.5);
  }
}

.form-hint {
  font-size: 0.8125rem;
  color: $text-secondary;
  margin: 0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid $border-base;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: $font-body;
  font-size: 0.9375rem;
  color: $text-primary;
  cursor: pointer;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
}

// Addresses
.addresses-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @include up(md) {
    grid-template-columns: repeat(2, 1fr);
  }

  &__empty {
    text-align: center;
    padding: 2rem;
    color: $text-secondary;
    font-family: $font-body;
  }
}

.address-card {
  background: $bg-page;
  border: 1px solid $border-base;
  border-radius: 8px;
  padding: 1.25rem;
  position: relative;
  transition: all 0.2s;

  &--default {
    border-color: $brand;
    background: rgba($brand, 0.05);
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
    background: $brand;
    color: $brand-ink;
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
      background: rgba(#b9c6aa, 0.2);
      color: #2f3a2a;
      border: 1px solid #b9c6aa;
    }
  }

  &__content {
    margin-bottom: 1rem;
  }

  &__street {
    font-family: $font-body;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.375rem;
  }

  &__city,
  &__country {
    font-family: $font-body;
    font-size: 0.875rem;
    color: $text-secondary;
    margin: 0;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__btn {
    padding: 0.5rem 1rem;
    font-family: $font-body;
    font-size: 0.8125rem;
    font-weight: 500;
    background: $bg-card;
    border: 1px solid $border-base;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: $brand;
      border-color: $brand;
      color: $brand-ink;
    }

    &--primary {
      background: $brand;
      border-color: $brand;
      color: $brand-ink;

      &:hover {
        background: darken($brand, 5%);
        border-color: darken($brand, 5%);
      }
    }

    &--danger:hover {
      background: $error;
      border-color: $error;
      color: white;
    }
  }
}

// Dialog
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.dialog {
  background: $bg-card;
  border-radius: 14px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid $border-base;
  }

  &__title {
    font-family: $font-heading;
    font-size: 1.25rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0;
  }

  &__close {
    width: 32px;
    height: 32px;
    border-radius: 999px;
    border: none;
    background: transparent;
    color: $text-secondary;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba($brand, 0.1);
      color: $brand-ink;
    }
  }

  &__body {
    padding: 1.5rem;
  }

  &__actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    padding-top: 1.5rem;
    border-top: 1px solid $border-base;
  }
}
</style>
