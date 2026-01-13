<template>
  <section class="promo-banner">
    <div class="promo-banner__inner">
      <!-- Personalized Products Section -->
      <div class="promo-banner__section promo-banner__section--main">
        <div class="promo-banner__icon">✨</div>
        <div class="promo-banner__content">
          <span class="promo-banner__label">Персонализирани Продукти</span>
          <span class="promo-banner__title">Ръчно Изработени</span>
          <span class="promo-banner__desc">с внимание към детайла</span>
        </div>
      </div>
      
      <div class="promo-banner__divider"></div>
      
      <!-- Quality Section -->
      <div class="promo-banner__section promo-banner__section--quality">
        <div class="promo-banner__icon">🧵</div>
        <div class="promo-banner__content">
          <span class="promo-banner__label">Качествени Материи</span>
          <span class="promo-banner__title">100% Памук</span>
          <span class="promo-banner__desc">меки и комфортни</span>
        </div>
      </div>
      
      <div class="promo-banner__divider"></div>
      
      <!-- Free shipping section -->
      <div class="promo-banner__section promo-banner__section--gift">
        <div class="promo-banner__gift-icon">🚚</div>
        <div class="promo-banner__gift-text">
          <span class="promo-banner__gift-title">Безплатна доставка</span>
          <span class="promo-banner__gift-sub">при поръчка над 55€</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No logic needed - always show the decorative banner
</script>

<style lang="scss" scoped>
// Calming sage green color palette
$sage-green: #6c8474;
$sage-dark: #5a7262;
$cream: #f8f6f3;

.promo-banner {
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
    
    &--main,
    &--quality {
      gap: 1rem;
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
    font-size: 1.75rem;
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  &__label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(255, 255, 255, 0.75);
    font-weight: 500;
  }
  
  &__title {
    font-size: 1rem;
    font-weight: 700;
    color: white;
    line-height: 1.2;
  }
  
  &__desc {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.85);
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
  
  // Responsive - show all 3 sections on mobile with dividers
  @media (max-width: 768px) {
    padding: 1.25rem 0.75rem;
    
    &__inner {
      display: grid;
      grid-template-columns: 1fr auto 1fr auto 1fr;
      gap: 0;
      align-items: center;
      min-height: 80px;
    }
    
    &__divider {
      display: block;
      width: 1px;
      height: 60px;
      background: rgba(255, 255, 255, 0.35);
      align-self: center;
    }
    
    &__section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0 0.5rem;
      height: 100%;
      
      &--main,
      &--quality {
        gap: 0.15rem;
        
        .promo-banner__content {
          align-items: center;
        }
      }
      
      &--gift {
        display: flex;
        gap: 0.15rem;
      }
    }
    
    &__icon {
      font-size: 1.5rem;
    }
    
    &__title {
      font-size: 0.85rem;
      font-weight: 700;
    }
    
    &__label {
      font-size: 0.55rem;
      letter-spacing: 0.08em;
      font-weight: 600;
    }
    
    &__desc {
      font-size: 0.6rem;
    }
    
    &__gift-icon {
      font-size: 1.5rem;
    }
    
    &__gift-title {
      font-size: 0.8rem;
      font-weight: 700;
    }
    
    &__gift-sub {
      font-size: 0.6rem;
    }
    
    &__gift-text {
      align-items: center;
    }
  }
  
  @media (max-width: 420px) {
    padding: 1rem 0.5rem;
    
    &__inner {
      min-height: 70px;
    }
    
    &__divider {
      height: 55px;
    }
    
    &__section {
      padding: 0 0.35rem;
    }
    
    &__icon {
      font-size: 1.25rem;
    }
    
    &__title {
      font-size: 0.75rem;
    }
    
    &__label {
      font-size: 0.5rem;
    }
    
    &__desc {
      font-size: 0.55rem;
    }
    
    &__gift-icon {
      font-size: 1.25rem;
    }
    
    &__gift-title {
      font-size: 0.7rem;
    }
    
    &__gift-sub {
      font-size: 0.55rem;
    }
  }
}
</style>
