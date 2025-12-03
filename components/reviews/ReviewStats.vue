<template>
  <div class="review-stats">
    <div class="review-stats__summary">
      <div class="review-stats__rating">
        <span class="review-stats__average">{{ stats.averageRating.toFixed(1) }}</span>
        <div class="review-stats__stars">
          <Icon
            v-for="star in 5"
            :key="star"
            name="mdi:star"
            class="review-stats__star"
            :class="{
              'review-stats__star--filled': star <= Math.round(stats.averageRating),
            }"
          />
        </div>
      </div>
      <p class="review-stats__count">
        {{ stats.totalReviews }} {{ stats.totalReviews === 1 ? "отзив" : "отзива" }}
      </p>
    </div>

    <div class="review-stats__distribution">
      <div
        v-for="rating in [5, 4, 3, 2, 1]"
        :key="rating"
        class="review-stats__bar"
        @click="emit('filter-by-rating', rating)"
      >
        <div class="review-stats__bar-label">
          <span>{{ rating }}</span>
          <Icon name="mdi:star" class="review-stats__bar-icon" />
        </div>
        <div class="review-stats__bar-track">
          <div
            class="review-stats__bar-fill"
            :style="{ width: `${getBarWidth(rating)}%` }"
          />
        </div>
        <span class="review-stats__bar-count">
          {{ stats.ratingDistribution[rating] || 0 }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  stats: ReviewStats;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "filter-by-rating": [rating: number];
}>();

const getBarWidth = (rating: number) => {
  const count = props.stats.ratingDistribution[rating] || 0;
  if (props.stats.totalReviews === 0) return 0;
  return (count / props.stats.totalReviews) * 100;
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/colors" as *;
@use "@/assets/styles/breakpoints" as *;

.review-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, $bg-card 0%, rgba($brand, 0.03) 100%);
  border: 1px solid $border-base;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  @include up(md) {
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.25rem;
  }

  &__summary {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
    min-width: 140px;

    @include up(md) {
      align-items: flex-start;
      text-align: left;
    }
  }

  &__rating {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    @include up(md) {
      align-items: flex-start;
    }
  }

  &__average {
    font-size: 2rem;
    font-weight: 700;
    background: $grad-brand-b;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  &__stars {
    display: flex;
    gap: 4px;
  }

  &__star {
    width: 24px;
    height: 24px;
    color: $border-base;
    transition: color 0.2s ease;

    &--filled {
      color: #f59e0b;
    }
  }

  &__count {
    font-size: 0.875rem;
    color: $text-secondary;
    margin: 0;
  }

  &__distribution {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-width: 0;
  }

  &__bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0.5rem;
    border-radius: 6px;
    margin: -0.5rem;
    padding: 0.5rem;

    &:hover {
      background: rgba($brand, 0.05);
      transform: translateX(4px);
    }
  }

  &__bar-label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.875rem;
    font-weight: 600;
    color: $text-primary;
    min-width: 50px;
  }

  &__bar-icon {
    width: 16px;
    height: 16px;
    color: #f59e0b;
  }

  &__bar-track {
    flex: 1;
    height: 8px;
    background: rgba($border-base, 0.3);
    border-radius: 4px;
    overflow: hidden;
    min-width: 0;
  }

  &__bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
    border-radius: 4px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(245, 158, 11, 0.3);
  }

  &__bar-count {
    font-size: 0.875rem;
    color: $text-secondary;
    min-width: 30px;
    text-align: right;
  }
}
</style>

