<template>
  <section v-if="isChristmasMode" class="christmas-promo">
    <div class="christmas-promo__inner">
      <!-- Single promo section - full width like Moonkie -->
      <div class="christmas-promo__section christmas-promo__section--main">
        <div class="christmas-promo__icon">🎄</div>
        <div class="christmas-promo__content">
          <span class="christmas-promo__label">Коледна Промоция</span>
          <div class="christmas-promo__discount-row">
            <span class="christmas-promo__percent">10%</span>
            <span class="christmas-promo__off">OFF</span>
          </div>
          <span class="christmas-promo__desc">на всички продукти</span>
        </div>
      </div>
      
      <div class="christmas-promo__divider"></div>
      
      <!-- Code section -->
      <div class="christmas-promo__section christmas-promo__section--code">
        <span class="christmas-promo__code-label">Използвай код:</span>
        <button 
          class="christmas-promo__code-btn"
          :class="{ 'christmas-promo__code-btn--copied': copied }"
          @click="copyCode"
        >
          {{ copied ? '✓ Копирано!' : 'EMWEAR25' }}
        </button>
      </div>
      
      <div class="christmas-promo__divider"></div>
      
      <!-- Gift/bonus section -->
      <div class="christmas-promo__section christmas-promo__section--gift">
        <div class="christmas-promo__gift-icon">🎁</div>
        <div class="christmas-promo__gift-text">
          <span class="christmas-promo__gift-title">Безплатна доставка</span>
          <span class="christmas-promo__gift-sub">при поръчка над 110лв</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const copied = ref(false);

const isChristmasMode = computed(() => {
  if (config.public.christmasMode === false) return false;
  if (config.public.christmasMode === true) return true;
  
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  
  return (month === 11) || (month === 0 && day <= 6);
});

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText('EMWEAR25');
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>

<style lang="scss" scoped>
// Updated green color as requested
$sage-green: #6c8474;
$sage-dark: #5a7262;
$cream: #f8f6f3;

.christmas-promo {
  background: linear-gradient(135deg, $sage-green 0%, $sage-dark 100%);
  padding: 1rem 1.5rem;
  
  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
  }
  
  &__section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    &--main {
      gap: 1rem;
    }
    
    &--code {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    &--gift {
      gap: 0.75rem;
    }
  }
  
  &__divider {
    width: 1px;
    height: 50px;
    background: rgba(255, 255, 255, 0.3);
  }
  
  &__icon {
    font-size: 2rem;
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  &__label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
  }
  
  &__discount-row {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
  }
  
  &__percent {
    font-size: 2rem;
    font-weight: 800;
    color: white;
    line-height: 1;
  }
  
  &__off {
    font-size: 0.9rem;
    font-weight: 700;
    color: white;
  }
  
  &__desc {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.9);
  }
  
  &__code-label {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  
  &__code-btn {
    background: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.95rem;
    font-weight: 700;
    color: $sage-dark;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.05em;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    &--copied {
      background: #4a6b52;
      color: white;
    }
  }
  
  &__gift-icon {
    font-size: 1.75rem;
  }
  
  &__gift-text {
    display: flex;
    flex-direction: column;
  }
  
  &__gift-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: white;
  }
  
  &__gift-sub {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.8);
  }
  
  // Responsive
  @media (max-width: 768px) {
    padding: 1rem;
    
    &__inner {
      gap: 1rem;
    }
    
    &__divider {
      display: none;
    }
    
    &__section--gift {
      display: none;
    }
    
    &__percent {
      font-size: 1.5rem;
    }
    
    &__icon {
      font-size: 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    &__section--main {
      flex-direction: column;
      text-align: center;
      
      .christmas-promo__content {
        align-items: center;
      }
    }
  }
}
</style>
