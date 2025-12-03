<template>
  <div class="review-form">
    <h3 class="review-form__title">Споделете вашето мнение</h3>
    <p class="review-form__subtitle">
      Вашето мнение е важно за нас и за другите клиенти!
    </p>

    <form class="review-form__form" @submit.prevent="handleSubmit">
      <!-- Rating -->
      <div class="review-form__field">
        <label class="review-form__label">Рейтинг *</label>
        <div class="review-form__rating">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            class="review-form__star-btn"
            :class="{
              'review-form__star-btn--filled': star <= (hoveredRating || formData.rating),
            }"
            @click="formData.rating = star"
            @mouseenter="hoveredRating = star"
            @mouseleave="hoveredRating = 0"
          >
            <span class="review-form__star-text">★</span>
          </button>
        </div>
        <span v-if="errors.rating" class="review-form__error">{{ errors.rating }}</span>
      </div>

      <!-- Title -->
      <div class="review-form__field">
        <label for="review-title" class="review-form__label">Заглавие *</label>
        <input
          id="review-title"
          v-model="formData.title"
          type="text"
          class="review-form__input"
          :class="{ 'review-form__input--error': errors.title }"
          placeholder="Например: Отлично качество!"
          maxlength="200"
          @blur="validateField('title')"
        />
        <span v-if="errors.title" class="review-form__error">{{ errors.title }}</span>
      </div>

      <!-- Comment -->
      <div class="review-form__field">
        <label for="review-comment" class="review-form__label">Вашият отзив *</label>
        <textarea
          id="review-comment"
          v-model="formData.comment"
          class="review-form__textarea"
          :class="{ 'review-form__textarea--error': errors.comment }"
          placeholder="Разкажете ни повече за вашия опит с продукта..."
          rows="5"
          maxlength="2000"
          @blur="validateField('comment')"
        />
        <div class="review-form__char-count">
          {{ formData.comment.length }}/2000 символа
        </div>
        <span v-if="errors.comment" class="review-form__error">{{ errors.comment }}</span>
      </div>

      <!-- Guest Fields (if not authenticated) -->
      <template v-if="!isAuthenticated">
        <div class="review-form__field">
          <label for="review-guest-name" class="review-form__label">Вашето име *</label>
          <input
            id="review-guest-name"
            v-model="formData.guestName"
            type="text"
            class="review-form__input"
            :class="{ 'review-form__input--error': errors.guestName }"
            placeholder="Вашето име"
            maxlength="100"
            @blur="validateField('guestName')"
          />
          <span v-if="errors.guestName" class="review-form__error">{{ errors.guestName }}</span>
        </div>

        <div class="review-form__field">
          <label for="review-guest-email" class="review-form__label">Имейл *</label>
          <input
            id="review-guest-email"
            v-model="formData.guestEmail"
            type="email"
            class="review-form__input"
            :class="{ 'review-form__input--error': errors.guestEmail }"
            placeholder="your@email.com"
            @blur="validateField('guestEmail')"
          />
          <span v-if="errors.guestEmail" class="review-form__error">{{ errors.guestEmail }}</span>
        </div>
      </template>

      <!-- Order ID (optional) -->
      <div v-if="userOrders.length > 0" class="review-form__field">
        <label for="review-order" class="review-form__label">
          Поръчка (за потвърдена покупка)
        </label>
        <select
          id="review-order"
          v-model="formData.orderId"
          class="review-form__select"
        >
          <option value="">Изберете поръчка...</option>
          <option
            v-for="order in userOrders"
            :key="order._id"
            :value="order._id"
          >
            Поръчка #{{ order.orderNumber }} - {{ formatDate(order.createdAt) }}
          </option>
        </select>
        <p class="review-form__help">
          Изборът на поръчка ще добави значка "Потвърдена покупка" към вашия отзив
        </p>
      </div>

      <!-- Image Upload (Future Enhancement) -->
      <!-- <div class="review-form__field">
        <label class="review-form__label">Снимки (по избор)</label>
        <div class="review-form__images">
          <button type="button" class="review-form__image-btn">
            <Icon name="mdi:camera" class="review-form__image-icon" />
            Добави снимка
          </button>
        </div>
      </div> -->

      <!-- Error Message -->
      <div v-if="submitError" class="review-form__error-message">
        {{ submitError }}
      </div>

      <!-- Success Message -->
      <div v-if="showSuccess" class="review-form__success-message">
        <div class="review-form__success-icon">✓</div>
        <div class="review-form__success-content">
          <strong>Отзивът е изпратен успешно!</strong>
          <p>Вашият отзив ще бъде прегледан от нашия екип преди публикуване. Очаквайте одобрение в рамките на 24 часа.</p>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="review-form__submit"
        :disabled="isSubmitting || showSuccess"
      >
        {{ isSubmitting ? "Изпраща се..." : "Изпрати отзив" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useApi } from "~/composables/useApi";
import { useToast } from "~/composables/useToast";
import { useAuthStore } from "~/stores/auth";

interface Props {
  productId: string;
}

interface FormData {
  rating: number;
  title: string;
  comment: string;
  guestName: string;
  guestEmail: string;
  orderId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  submitted: [];
  "stats-updated": [];
}>();

const api = useApi();
const toast = useToast();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const hoveredRating = ref(0);
const isSubmitting = ref(false);
const submitError = ref("");
const showSuccess = ref(false);
const userOrders = ref<any[]>([]);

const formData = reactive<FormData>({
  rating: 0,
  title: "",
  comment: "",
  guestName: "",
  guestEmail: "",
  orderId: "",
});

const errors = reactive<Partial<Record<keyof FormData, string>>>({});

const validateField = (field: keyof FormData) => {
  delete errors[field];

  switch (field) {
    case "rating":
      if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
        errors.rating = "Моля, изберете рейтинг от 1 до 5 звезди";
      }
      break;
    case "title":
      if (!formData.title.trim()) {
        errors.title = "Заглавието е задължително";
      } else if (formData.title.trim().length < 3) {
        errors.title = "Заглавието трябва да е поне 3 символа";
      } else if (formData.title.trim().length > 200) {
        errors.title = "Заглавието не може да надвишава 200 символа";
      }
      break;
    case "comment":
      if (!formData.comment.trim()) {
        errors.comment = "Отзивът е задължителен";
      } else if (formData.comment.trim().length < 10) {
        errors.comment = "Отзивът трябва да е поне 10 символа";
      } else if (formData.comment.trim().length > 2000) {
        errors.comment = "Отзивът не може да надвишава 2000 символа";
      }
      break;
    case "guestName":
      if (!isAuthenticated.value && !formData.guestName.trim()) {
        errors.guestName = "Името е задължително";
      } else if (!isAuthenticated.value && formData.guestName.trim().length < 2) {
        errors.guestName = "Името трябва да е поне 2 символа";
      }
      break;
    case "guestEmail":
      if (!isAuthenticated.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.guestEmail.trim()) {
          errors.guestEmail = "Имейлът е задължителен";
        } else if (!emailRegex.test(formData.guestEmail.trim())) {
          errors.guestEmail = "Моля, въведете валиден имейл адрес";
        }
      }
      break;
  }
};

const validateForm = (): boolean => {
  Object.keys(formData).forEach((key) => {
    validateField(key as keyof FormData);
  });

  return Object.keys(errors).length === 0;
};

const handleSubmit = async () => {
  submitError.value = "";
  Object.keys(errors).forEach((key) => delete errors[key as keyof FormData]);

  if (!validateForm()) {
    submitError.value = "Моля, попълнете всички задължителни полета правилно";
    return;
  }

  isSubmitting.value = true;

  try {
    const reviewPayload: any = {
      productId: props.productId,
      rating: formData.rating,
      title: formData.title.trim(),
      comment: formData.comment.trim(),
    };

    if (!isAuthenticated.value) {
      reviewPayload.guestName = formData.guestName.trim();
      reviewPayload.guestEmail = formData.guestEmail.trim();
    }

    if (formData.orderId) {
      reviewPayload.orderId = formData.orderId;
    }

    const response = await api.post("reviews", reviewPayload);

    if (response.success) {
      showSuccess.value = true;
      toast.success("Отзивът е изпратен успешно! Ще бъде прегледан преди публикуване.");

      // Reset form
      Object.assign(formData, {
        rating: 0,
        title: "",
        comment: "",
        guestName: "",
        guestEmail: "",
        orderId: "",
      });
      hoveredRating.value = 0;

      // Emit events
      emit("submitted");
      emit("stats-updated");

      // Hide success message after 5 seconds
      setTimeout(() => {
        showSuccess.value = false;
      }, 5000);
    }
  } catch (error: any) {
    console.error("Submit review error:", error);
    submitError.value =
      error.data?.message ||
      error.message ||
      "Грешка при изпращане на отзива. Моля, опитайте отново.";
    toast.error(submitError.value);
  } finally {
    isSubmitting.value = false;
  }
};

const fetchUserOrders = async () => {
  if (!isAuthenticated.value) return;

  try {
    const response = await api.get("orders", {
      headers: authStore.accessToken
        ? { Authorization: `Bearer ${authStore.accessToken}` }
        : {},
    });

    if (response.success && Array.isArray(response.data)) {
      // Filter orders that contain this product
      userOrders.value = response.data.filter((order: any) =>
        order.items?.some((item: any) => item.id === props.productId)
      );
    }
  } catch (error) {
    console.error("Error fetching user orders:", error);
    // Fail silently - not critical for review submission
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("bg-BG", { year: "numeric", month: "long", day: "numeric" });
};

onMounted(() => {
  if (isAuthenticated.value) {
    fetchUserOrders();
  }
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/colors" as *;
@use "@/assets/styles/breakpoints" as *;

.review-form {
  background: $bg-card;
  border: 1px solid $border-base;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.3s ease;
  max-width: 700px;
  margin: 0 auto;

  @include up(lg) {
    padding: 1.5rem;
  }

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: $brand-ink;
    margin: 0 0 0.375rem;
    letter-spacing: -0.02em;

    @include up(lg) {
      font-size: 1.5rem;
    }
  }

  &__subtitle {
    font-size: 0.875rem;
    color: $text-secondary;
    margin: 0 0 1rem;
    line-height: 1.5;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__label {
    font-size: 0.9375rem;
    font-weight: 600;
    color: $brand-ink;
  }

  &__rating {
    display: flex;
    gap: 0.5rem;
    padding: 0.75rem;
    background: rgba($brand, 0.05);
    border-radius: 8px;
    justify-content: flex-start;
  }

  &__star-btn {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    color: #d1d5db;
    font-size: 28px;
    line-height: 1;

    &:hover {
      transform: scale(1.2);
      background: rgba($brand-accent-3, 0.1);
    }

    &:active {
      transform: scale(1.1);
    }

    &--filled {
      color: #f59e0b;
      text-shadow: 0 1px 2px rgba(245, 158, 11, 0.3);
    }
  }

  &__star-text {
    display: block;
    transition: all 0.2s ease;
  }

  &__input,
  &__textarea,
  &__select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid $border-base;
    border-radius: 8px;
    font-size: 0.9375rem;
    font-family: inherit;
    color: $text-primary;
    background: $bg-page;
    transition: all 0.2s ease;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: $brand;
      background: white;
      box-shadow: 0 0 0 3px rgba($brand, 0.1);
    }

    &--error {
      border-color: $error;
      background: rgba($error, 0.05);
      
      &:focus {
        box-shadow: 0 0 0 3px rgba($error, 0.1);
      }
    }

    &::placeholder {
      color: $text-tertiary;
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
  }

  &__char-count {
    font-size: 0.75rem;
    color: $text-secondary;
    text-align: right;
  }

  &__help {
    font-size: 0.75rem;
    color: $text-secondary;
    margin: 0;
  }

  &__error {
    font-size: 0.875rem;
    color: $error;
  }

  &__error-message {
    padding: 1rem;
    background: rgba($error, 0.1);
    border: 1px solid rgba($error, 0.3);
    border-radius: 6px;
    color: $error;
    font-size: 0.9375rem;
  }

  &__success-message {
    padding: 1rem 1.25rem;
    background: linear-gradient(135deg, rgba($success, 0.1) 0%, rgba($success, 0.05) 100%);
    border: 2px solid rgba($success, 0.3);
    border-radius: 8px;
    color: $success;
    font-size: 0.875rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    animation: slideIn 0.3s ease;
  }

  &__success-icon {
    width: 24px;
    height: 24px;
    background: $success;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.875rem;
    flex-shrink: 0;
    margin-top: 2px;
  }

  &__success-content {
    flex: 1;
    
    strong {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: 600;
    }
    
    p {
      margin: 0;
      font-size: 0.8125rem;
      line-height: 1.5;
      opacity: 0.9;
    }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__submit {
    padding: 0.875rem 2rem;
    background: $grad-brand-b;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba($brand-ink, 0.15);
    letter-spacing: 0.01em;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($brand-ink, 0.25);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba($brand-ink, 0.2);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
}
</style>

