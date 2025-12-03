<template>
  <section class="product-reviews">
    <div class="product-reviews__header">
      <h2 class="product-reviews__title">Отзиви на клиенти</h2>
      <div v-if="stats.totalReviews > 0" class="product-reviews__quick-stats">
        <span class="product-reviews__average">{{ stats.averageRating.toFixed(1) }}</span>
        <div class="product-reviews__stars">
          <Icon
            v-for="star in 5"
            :key="star"
            name="mdi:star"
            class="product-reviews__star"
            :class="{
              'product-reviews__star--filled': star <= Math.round(stats.averageRating),
            }"
          />
        </div>
        <span class="product-reviews__count">({{ stats.totalReviews }} отзива)</span>
      </div>
    </div>

    <!-- Filters and Sort -->
    <div v-if="reviews.length > 0 || isLoading" class="product-reviews__controls">
      <div class="product-reviews__filters">
        <button
          v-for="rating in [5, 4, 3, 2, 1]"
          :key="rating"
          class="product-reviews__filter-btn"
          :class="{ 'product-reviews__filter-btn--active': selectedRating === rating }"
          @click="filterByRating(rating)"
        >
          {{ rating }} <Icon name="mdi:star" class="product-reviews__filter-icon" />
          <span class="product-reviews__filter-count">
            ({{ stats.ratingDistribution[rating] || 0 }})
          </span>
        </button>
        <button
          v-if="selectedRating"
          class="product-reviews__filter-btn product-reviews__filter-btn--clear"
          @click="clearFilter"
        >
          Изчисти филтър
        </button>
      </div>

      <select v-model="sortBy" class="product-reviews__sort">
        <option value="newest">Най-нови</option>
        <option value="oldest">Най-стари</option>
        <option value="highest">Най-висок рейтинг</option>
        <option value="lowest">Най-нисък рейтинг</option>
        <option value="helpful">Най-полезни</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="product-reviews__loading">
      <p>Зареждане на отзиви...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading && reviews.length === 0" class="product-reviews__empty">
      <Icon name="mdi:star-outline" class="product-reviews__empty-icon" />
      <h3>Все още няма отзиви</h3>
      <p>Бъдете първите, които ще споделят мнението си за този продукт!</p>
    </div>

    <!-- Reviews List -->
    <div v-else class="product-reviews__list">
      <article v-for="review in reviews" :key="review._id" class="review-card">
        <div class="review-card__header">
          <div class="review-card__author">
            <div class="review-card__avatar">
              {{ getInitials(review.user?.firstName || review.guestName || "Гост") }}
            </div>
            <div class="review-card__info">
              <h3 class="review-card__name">
                {{ review.user?.firstName && review.user?.lastName
                  ? `${review.user.firstName} ${review.user.lastName}`
                  : review.guestName || "Гост" }}
              </h3>
              <p class="review-card__date">{{ formatDate(review.createdAt) }}</p>
            </div>
          </div>
          <div class="review-card__badges">
            <span v-if="review.verifiedPurchase" class="review-card__badge review-card__badge--verified">
              <Icon name="mdi:check-decagram" class="review-card__badge-icon" />
              Потвърдена покупка
            </span>
          </div>
        </div>

        <div class="review-card__rating">
          <Icon
            v-for="star in 5"
            :key="star"
            name="mdi:star"
            class="review-card__star"
            :class="{ 'review-card__star--filled': star <= review.rating }"
          />
        </div>

        <h4 class="review-card__title">{{ review.title }}</h4>
        <p class="review-card__comment">{{ review.comment }}</p>

        <!-- Review Images -->
        <div v-if="review.images && review.images.length > 0" class="review-card__images">
          <button
            v-for="(image, index) in review.images"
            :key="index"
            class="review-card__image-thumb"
            @click="openImageModal(review.images, index)"
          >
            <NuxtImg
              :src="image.url"
              :alt="`Review image ${index + 1}`"
              format="webp"
              quality="75"
              width="100"
              height="100"
              loading="lazy"
            />
          </button>
        </div>

        <div class="review-card__footer">
          <button
            class="review-card__action"
            :disabled="markingHelpful === review._id"
            @click="markHelpful(review._id)"
          >
            <Icon name="mdi:thumb-up" class="review-card__action-icon" />
            Полезно ({{ review.helpfulCount || 0 }})
          </button>
          <button class="review-card__action" @click="reportReview(review._id)">
            <Icon name="mdi:flag" class="review-card__action-icon" />
            Докладвай
          </button>
        </div>
      </article>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.hasMore || currentPage > 1" class="product-reviews__pagination">
      <button
        class="product-reviews__pagination-btn"
        :disabled="currentPage === 1 || isLoading"
        @click="loadPage(currentPage - 1)"
      >
        ← Предишна
      </button>
      <span class="product-reviews__pagination-info">
        Страница {{ currentPage }} от {{ totalPages }}
      </span>
      <button
        class="product-reviews__pagination-btn"
        :disabled="!pagination.hasMore || isLoading"
        @click="loadPage(currentPage + 1)"
      >
        Следваща →
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useApi } from "~/composables/useApi";
import { useToast } from "~/composables/useToast";
import { useAuthStore } from "~/stores/auth";

interface Review {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  guestName?: string | null;
  verifiedPurchase: boolean;
  helpfulCount: number;
  images?: Array<{ url: string; publicId: string }>;
  createdAt: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface Props {
  productId: string;
  stats: ReviewStats;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "stats-updated": [stats: ReviewStats];
}>();

const api = useApi();
const toast = useToast();
const authStore = useAuthStore();

const reviews = ref<Review[]>([]);
const isLoading = ref(false);
const selectedRating = ref<number | null>(null);
const sortBy = ref<"newest" | "oldest" | "highest" | "lowest" | "helpful">("newest");
const currentPage = ref(1);
const pageSize = 10;
const pagination = ref({
  total: 0,
  hasMore: false,
});
const markingHelpful = ref<string | null>(null);

const totalPages = computed(() => Math.ceil(pagination.value.total / pageSize));

const fetchReviews = async () => {
  isLoading.value = true;
  try {
    const skip = (currentPage.value - 1) * pageSize;
    let sortByParam = "createdAt";
    let sortOrder = "desc";

    switch (sortBy.value) {
      case "oldest":
        sortByParam = "createdAt";
        sortOrder = "asc";
        break;
      case "highest":
        sortByParam = "rating";
        sortOrder = "desc";
        break;
      case "lowest":
        sortByParam = "rating";
        sortOrder = "asc";
        break;
      case "helpful":
        sortByParam = "helpfulCount";
        sortOrder = "desc";
        break;
      default:
        sortByParam = "createdAt";
        sortOrder = "desc";
    }

    const queryParams = new URLSearchParams({
      limit: pageSize.toString(),
      skip: skip.toString(),
      sortBy: sortByParam,
      sortOrder,
    });

    if (selectedRating.value) {
      queryParams.append("rating", selectedRating.value.toString());
    }

    const response = await api.get(`reviews/product/${props.productId}?${queryParams.toString()}`);

    if (response.success) {
      reviews.value = response.data.reviews || [];
      pagination.value = {
        total: response.data.pagination?.total || 0,
        hasMore: response.data.pagination?.hasMore || false,
      };

      // Update stats if available
      if (response.data.stats) {
        emit("stats-updated", response.data.stats);
      }
    }
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    toast.error("Грешка при зареждане на отзиви");
  } finally {
    isLoading.value = false;
  }
};

const filterByRating = (rating: number) => {
  selectedRating.value = selectedRating.value === rating ? null : rating;
  currentPage.value = 1;
};

const clearFilter = () => {
  selectedRating.value = null;
  currentPage.value = 1;
};

const loadPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const markHelpful = async (reviewId: string) => {
  if (markingHelpful.value) return;

  markingHelpful.value = reviewId;
  try {
    const response = await api.post(`reviews/${reviewId}/helpful`);
    if (response.success) {
      const review = reviews.value.find((r) => r._id === reviewId);
      if (review) {
        review.helpfulCount = response.data.helpfulCount || review.helpfulCount + 1;
      }
      toast.success("Благодарим за обратната връзка!");
    }
  } catch (error: any) {
    toast.error(error.data?.message || "Грешка при маркиране като полезно");
  } finally {
    markingHelpful.value = null;
  }
};

const reportReview = async (reviewId: string) => {
  if (!confirm("Сигурни ли сте, че искате да докладвате този отзив?")) return;

  try {
    const response = await api.post(`reviews/${reviewId}/report`);
    if (response.success) {
      toast.success("Отзивът е докладван. Ще го прегледаме.");
    }
  } catch (error: any) {
    toast.error(error.data?.message || "Грешка при докладване");
  }
};

const openImageModal = (images: Array<{ url: string }>, startIndex: number) => {
  // TODO: Implement image modal/lightbox
  console.log("Open image modal:", images, startIndex);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Днес";
  if (diffInDays === 1) return "Вчера";
  if (diffInDays < 7) return `Преди ${diffInDays} дни`;
  if (diffInDays < 30) return `Преди ${Math.floor(diffInDays / 7)} седмици`;
  if (diffInDays < 365) return `Преди ${Math.floor(diffInDays / 30)} месеца`;

  return date.toLocaleDateString("bg-BG", { year: "numeric", month: "long", day: "numeric" });
};

const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name[0]?.toUpperCase() || "?";
};

// Watch for changes
watch([selectedRating, sortBy], () => {
  currentPage.value = 1;
  fetchReviews();
});

watch(currentPage, () => {
  fetchReviews();
});

onMounted(() => {
  fetchReviews();
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/colors" as *;
@use "@/assets/styles/breakpoints" as *;

.product-reviews {
  padding: 0;
  max-width: 100%;
  font-size: 0.9375rem;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: $brand-ink;
    margin: 0;
    letter-spacing: -0.02em;
  }

  &__quick-stats {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__average {
    font-size: 1.5rem;
    font-weight: 700;
    color: $brand-ink;
  }

  &__stars {
    display: flex;
    gap: 2px;
  }

  &__star {
    width: 20px;
    height: 20px;
    color: $border-base;

    &--filled {
      color: #f59e0b;
    }
  }

  &__count {
    font-size: 0.875rem;
    color: $text-secondary;
  }

  &__controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  &__filters {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__filter-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0.625rem 1.25rem;
    background: $bg-card;
    border: 2px solid $border-base;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

    &:hover {
      background: rgba($brand, 0.1);
      border-color: $brand;
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba($brand, 0.2);
    }

    &--active {
      background: $grad-brand-b;
      border-color: $brand-ink;
      color: white;
      box-shadow: 0 2px 8px rgba($brand-ink, 0.2);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba($brand-ink, 0.3);
      }
    }

    &--clear {
      margin-left: 0.5rem;
    }
  }

  &__filter-icon {
    width: 16px;
    height: 16px;
    color: #f59e0b;
  }

  &__filter-count {
    font-size: 0.75rem;
    opacity: 0.8;
  }

  &__sort {
    padding: 0.625rem 1.25rem;
    border: 2px solid $border-base;
    border-radius: 8px;
    background: $bg-card;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

    &:hover {
      border-color: $brand;
      box-shadow: 0 2px 6px rgba($brand, 0.15);
    }

    &:focus {
      outline: none;
      border-color: $brand;
      box-shadow: 0 0 0 4px rgba($brand, 0.1);
    }
  }

  &__loading,
  &__empty {
    text-align: center;
    padding: 4rem 1rem;
    color: $text-secondary;
    background: linear-gradient(135deg, rgba($brand, 0.03) 0%, rgba($brand, 0.01) 100%);
    border: 2px dashed $border-base;
    border-radius: 12px;
    margin: 2rem 0;
  }

  &__empty-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    color: $border-base;
    opacity: 0.5;
    animation: float 3s ease-in-out infinite;
  }
  
  &__empty h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.75rem;
  }
  
  &__empty p {
    font-size: 1rem;
    color: $text-secondary;
    margin: 0;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid $border-base;
  }

  &__pagination-btn {
    padding: 0.75rem 1.5rem;
    background: $bg-card;
    border: 1px solid $border-base;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: $brand;
      border-color: $brand;
      color: white;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__pagination-info {
    font-size: 0.875rem;
    color: $text-secondary;
  }
}

.review-card {
  background: $bg-card;
  border: 1px solid $border-base;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, $brand 0%, $brand-accent-2 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
    border-color: rgba($brand, 0.3);
    
    &::before {
      opacity: 1;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
  }

  &__avatar {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: $grad-brand-b;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.125rem;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba($brand-ink, 0.15);
    transition: transform 0.2s ease;
    
    .review-card:hover & {
      transform: scale(1.05);
    }
  }

  &__info {
    min-width: 0;
  }

  &__name {
    font-size: 1rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.25rem;
    word-break: break-word;
  }

  &__date {
    font-size: 0.875rem;
    color: $text-secondary;
    margin: 0;
  }

  &__badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0.5rem 0.875rem;
    background: linear-gradient(135deg, rgba($success, 0.15) 0%, rgba($success, 0.08) 100%);
    border: 1px solid rgba($success, 0.3);
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    color: $success;
    flex-shrink: 0;
    box-shadow: 0 1px 3px rgba($success, 0.2);
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }

  &__badge-icon {
    width: 14px;
    height: 14px;
  }

  &__rating {
    display: flex;
    gap: 4px;
    margin-bottom: 0.75rem;
  }

  &__star {
    width: 18px;
    height: 18px;
    color: $border-base;

    &--filled {
      color: #f59e0b;
    }
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: $brand-ink;
    margin: 0 0 0.75rem;
    word-break: break-word;
    letter-spacing: -0.01em;
  }

  &__comment {
    font-size: 0.9375rem;
    line-height: 1.6;
    color: $text-primary;
    margin: 0 0 1rem;
    white-space: pre-wrap;
    word-break: break-word;
  }

  &__images {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  &__image-thumb {
    width: 100px;
    height: 100px;
    border: 1px solid $border-base;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    background: transparent;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__footer {
    display: flex;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid $border-base;
  }

  &__action {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0.625rem 1.25rem;
    background: transparent;
    border: 2px solid $border-base;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    color: $text-secondary;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: rgba($brand, 0.1);
      border-color: $brand;
      color: $brand;
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba($brand, 0.2);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__action-icon {
    width: 16px;
    height: 16px;
  }
}
</style>

