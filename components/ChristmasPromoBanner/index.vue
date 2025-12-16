<template>
  <section v-if="isChristmasMode" class="christmas-promo">
    <div class="christmas-promo__container">
      <!-- Decorative snowflakes -->
      <div class="christmas-promo__snowflakes">
        <span v-for="i in 8" :key="i" class="christmas-promo__flake">❄</span>
      </div>
      
      <!-- Left decoration -->
      <div class="christmas-promo__decoration christmas-promo__decoration--left">
        <span class="christmas-promo__tree">🎄</span>
      </div>
      
      <!-- Main content -->
      <div class="christmas-promo__content">
        <div class="christmas-promo__badge">
          <span class="christmas-promo__badge-icon">🎁</span>
          <span class="christmas-promo__badge-text">Коледна промоция</span>
        </div>
        
        <h2 class="christmas-promo__title">
          <span class="christmas-promo__discount">10% ОТСТЪПКА</span>
          <span class="christmas-promo__subtitle">на всички продукти!</span>
        </h2>
        
        <div class="christmas-promo__code-wrapper">
          <p class="christmas-promo__instruction">Използвайте код:</p>
          <button 
            class="christmas-promo__code" 
            @click="copyCode"
            :class="{ 'christmas-promo__code--copied': copied }"
          >
            <span class="christmas-promo__code-text">{{ copied ? 'Копирано!' : 'EMWEAR25' }}</span>
            <span class="christmas-promo__copy-icon">
              <svg v-if="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
          </button>
        </div>
        
        <p class="christmas-promo__validity">Валидно до 31 декември 2024</p>
      </div>
      
      <!-- Right decoration -->
      <div class="christmas-promo__decoration christmas-promo__decoration--right">
        <span class="christmas-promo__tree">🎄</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const copied = ref(false);

// Check if Christmas mode is enabled
const isChristmasMode = computed(() => {
  if (config.public.christmasMode === false) return false;
  if (config.public.christmasMode === true) return true;
  
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  
  return (month === 11) || (month === 0 && day <= 6);
});

// Copy coupon code to clipboard
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText('EMWEAR25');
    copied.value = true;
    
    // Reset after 2 seconds
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>

<style lang="scss" scoped>
$christmas-red: #c41e3a;
$christmas-green: #165b33;
$christmas-gold: #ffd700;
$snow-white: #ffffff;

.christmas-promo {
  position: relative;
  background: linear-gradient(135deg, $christmas-red 0%, #a01830 50%, $christmas-red 100%);
  padding: 1.5rem 1rem;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }
  
  &__container {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }
  
  &__snowflakes {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    overflow: hidden;
  }
  
  &__flake {
    position: absolute;
    color: rgba(255, 255, 255, 0.3);
    font-size: 1rem;
    animation: float 3s ease-in-out infinite;
    
    &:nth-child(1) { left: 5%; top: 10%; animation-delay: 0s; }
    &:nth-child(2) { left: 15%; top: 80%; animation-delay: 0.5s; }
    &:nth-child(3) { left: 25%; top: 30%; animation-delay: 1s; }
    &:nth-child(4) { left: 40%; top: 70%; animation-delay: 1.5s; }
    &:nth-child(5) { left: 60%; top: 20%; animation-delay: 2s; }
    &:nth-child(6) { left: 75%; top: 60%; animation-delay: 0.3s; }
    &:nth-child(7) { left: 85%; top: 40%; animation-delay: 0.8s; }
    &:nth-child(8) { left: 95%; top: 80%; animation-delay: 1.3s; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(10deg); }
  }
  
  &__decoration {
    flex-shrink: 0;
    
    &--left, &--right {
      display: flex;
      align-items: center;
    }
  }
  
  &__tree {
    font-size: 2.5rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    animation: tree-sway 2s ease-in-out infinite;
  }
  
  @keyframes tree-sway {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
  
  &__content {
    text-align: center;
    z-index: 1;
  }
  
  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: $christmas-gold;
    color: #333;
    padding: 0.25rem 1rem;
    border-radius: 2rem;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    animation: pulse 2s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  &__badge-icon {
    font-size: 1rem;
  }
  
  &__title {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  &__discount {
    font-size: 2rem;
    font-weight: 800;
    color: $snow-white;
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
    letter-spacing: 0.05em;
  }
  
  &__subtitle {
    font-size: 1.1rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
  }
  
  &__code-wrapper {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  &__instruction {
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
  }
  
  &__code {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: $snow-white;
    border: 3px dashed $christmas-gold;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    
    &--copied {
      background: $christmas-green;
      border-color: $christmas-green;
      
      .christmas-promo__code-text {
        color: $snow-white;
      }
      
      .christmas-promo__copy-icon {
        color: $snow-white;
      }
    }
  }
  
  &__code-text {
    font-size: 1.5rem;
    font-weight: 800;
    color: $christmas-red;
    letter-spacing: 0.1em;
    font-family: monospace;
  }
  
  &__copy-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: $christmas-red;
    
    svg {
      width: 100%;
      height: 100%;
    }
  }
  
  &__validity {
    margin: 0.75rem 0 0;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  // Responsive
  @media (max-width: 768px) {
    padding: 1.25rem 1rem;
    
    &__decoration {
      display: none;
    }
    
    &__discount {
      font-size: 1.5rem;
    }
    
    &__subtitle {
      font-size: 0.95rem;
    }
    
    &__code {
      padding: 0.5rem 1rem;
    }
    
    &__code-text {
      font-size: 1.2rem;
    }
    
    &__tree {
      font-size: 2rem;
    }
  }
  
  @media (max-width: 480px) {
    &__badge {
      font-size: 0.75rem;
      padding: 0.2rem 0.75rem;
    }
    
    &__discount {
      font-size: 1.25rem;
    }
  }
}
</style>
