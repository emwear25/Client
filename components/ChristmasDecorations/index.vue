<template>
  <div v-if="isChristmasMode" class="christmas-decorations">
    <!-- Snowfall Effect -->
    <div class="snowfall">
      <div 
        v-for="i in snowflakeCount" 
        :key="i" 
        class="snowflake"
        :style="getSnowflakeStyle(i)"
      >
        ❄
      </div>
    </div>
    
    <!-- Corner Decorations (optional festive garnish) -->
    <div class="christmas-garnish christmas-garnish--left">
      <svg viewBox="0 0 100 100" class="garnish-svg">
        <circle cx="15" cy="85" r="8" fill="#c41e3a" opacity="0.6"/>
        <circle cx="30" cy="70" r="6" fill="#165b33" opacity="0.5"/>
        <circle cx="10" cy="65" r="5" fill="#ffd700" opacity="0.4"/>
      </svg>
    </div>
    <div class="christmas-garnish christmas-garnish--right">
      <svg viewBox="0 0 100 100" class="garnish-svg">
        <circle cx="85" cy="85" r="8" fill="#c41e3a" opacity="0.6"/>
        <circle cx="70" cy="70" r="6" fill="#165b33" opacity="0.5"/>
        <circle cx="90" cy="65" r="5" fill="#ffd700" opacity="0.4"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

// Check if Christmas mode is enabled
const isChristmasMode = computed(() => {
  // First check runtime config
  if (config.public.christmasMode === false) return false;
  if (config.public.christmasMode === true) return true;
  
  // Auto-enable from Dec 1 to Jan 6
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const day = now.getDate();
  
  return (month === 11) || (month === 0 && day <= 6);
});

// Number of snowflakes (reduced for performance)
const snowflakeCount = 25;

// Generate random styles for each snowflake
const getSnowflakeStyle = (index: number) => {
  const left = Math.random() * 100;
  const animationDuration = 5 + Math.random() * 10; // 5-15 seconds
  const animationDelay = Math.random() * 10;
  const fontSize = 0.5 + Math.random() * 1; // 0.5-1.5rem
  const opacity = 0.3 + Math.random() * 0.5; // 0.3-0.8
  
  return {
    left: `${left}%`,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`,
    fontSize: `${fontSize}rem`,
    opacity: opacity,
  };
};
</script>

<style lang="scss" scoped>
.christmas-decorations {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
  overflow: hidden;
}

.snowfall {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.snowflake {
  position: absolute;
  top: -20px;
  color: #fff;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  animation: snowfall linear infinite;
  will-change: transform;
}

@keyframes snowfall {
  0% {
    transform: translateY(-20px) rotate(0deg);
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
  }
}

// Corner decorations (subtle)
.christmas-garnish {
  position: fixed;
  width: 100px;
  height: 100px;
  opacity: 0.5;
  z-index: 9997;
  
  &--left {
    bottom: 0;
    left: 0;
  }
  
  &--right {
    bottom: 0;
    right: 0;
    transform: scaleX(-1);
  }
}

.garnish-svg {
  width: 100%;
  height: 100%;
}

// Reduce snowfall on mobile for performance
@media (max-width: 768px) {
  .snowflake:nth-child(n+15) {
    display: none;
  }
}
</style>
