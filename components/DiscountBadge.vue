<template>
  <div v-if="hasDiscount" class="discount-badge" :class="badgeClass">
    <span class="badge-text">{{ badgeText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  product?: {
    price: number;
    compareAt?: number | null;
    onSale?: boolean;
  };
  discount?: {
    type: "percentage" | "fixed_amount" | "sale";
    value: number;
  };
  type?: "sale" | "percentage" | "fixed" | "flash";
}

const props = withDefaults(defineProps<Props>(), {
  type: "sale",
});

const hasDiscount = computed(() => {
  if (props.discount) return true;
  if (props.product) {
    return (
      props.product.onSale ||
      (props.product.compareAt && props.product.compareAt > props.product.price)
    );
  }
  return false;
});

const badgeText = computed(() => {
  if (props.discount) {
    if (props.discount.type === "percentage") {
      return `-${props.discount.value}%`;
    } else if (props.discount.type === "fixed_amount") {
      return `-${props.discount.value.toFixed(2)} лв.`;
    }
  }

  if (props.product && props.product.compareAt && props.product.price) {
    const savingsPercent = Math.round(
      ((props.product.compareAt - props.product.price) / props.product.compareAt) * 100
    );
    return `-${savingsPercent}%`;
  }

  return "ПРОМОЦИЯ";
});

const badgeClass = computed(() => {
  return {
    "badge-sale": props.type === "sale",
    "badge-percentage": props.type === "percentage",
    "badge-fixed": props.type === "fixed",
    "badge-flash": props.type === "flash",
  };
});
</script>

<style scoped>
.discount-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  animation: fadeInScale 0.3s ease;
}

.badge-sale {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.badge-percentage {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.badge-fixed {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: #1f2937;
}

.badge-flash {
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  color: white;
  animation: pulse 2s ease-in-out infinite;
}

.badge-text {
  display: block;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 4px 16px rgba(255, 107, 107, 0.4);
  }
}
</style>
