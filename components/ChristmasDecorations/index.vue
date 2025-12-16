<template>
  <div v-if="isChristmasMode" class="christmas-decorations">
    <!-- Subtle snowfall only -->
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
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

// Check if Christmas mode is enabled
const isChristmasMode = computed(() => {
  if (config.public.christmasMode === false) return false;
  if (config.public.christmasMode === true) return true;
  
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  
  return (month === 11) || (month === 0 && day <= 6);
});

// Increased snowflakes for more festive effect
const snowflakeCount = 30;

// Generate random styles for each snowflake
const getSnowflakeStyle = (index: number) => {
  const left = Math.random() * 100;
  const animationDuration = 10 + Math.random() * 15; // 10-25 seconds (slow)
  const animationDelay = Math.random() * 15;
  const fontSize = 0.5 + Math.random() * 0.5; // 0.5-1rem (small)
  const opacity = 0.25 + Math.random() * 0.35; // 0.25-0.6 (more visible)
  
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
  color: rgba(255, 255, 255, 0.6);
  text-shadow: 0 0 2px rgba(200, 200, 200, 0.3);
  animation: snowfall linear infinite;
  will-change: transform;
}

@keyframes snowfall {
  0% {
    transform: translateY(-20px) rotate(0deg);
  }
  100% {
    transform: translateY(100vh) rotate(180deg);
  }
}

// Hide on mobile for performance
@media (max-width: 768px) {
  .snowflake:nth-child(n+6) {
    display: none;
  }
}
</style>
