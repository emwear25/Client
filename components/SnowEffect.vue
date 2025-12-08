<template>
  <div class="snow-container" aria-hidden="true">
    <div v-for="i in snowflakeCount" :key="i" class="snowflake" :style="getSnowflakeStyle(i)">
      ❄
    </div>
  </div>
</template>

<script setup lang="ts">
const snowflakeCount = 50; // Number of snowflakes

const getSnowflakeStyle = (_index: number) => {
  // Random horizontal position
  const left = Math.random() * 100;

  // Random animation duration (slower = more variation)
  const duration = 5 + Math.random() * 10; // 5-15 seconds

  // Random delay for staggered start
  const delay = Math.random() * 5;

  // Random size
  const size = 0.5 + Math.random() * 1; // 0.5-1.5em

  // Random horizontal drift
  const drift = -20 + Math.random() * 40; // -20px to 20px

  return {
    left: `${left}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    fontSize: `${size}em`,
    "--drift": `${drift}px`,
    opacity: 0.6 + Math.random() * 0.4, // 0.6 to 1
  };
};
</script>

<style scoped lang="scss">
.snow-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.snowflake {
  position: absolute;
  top: -10%;
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  animation: fall linear infinite;
  user-select: none;
  filter: brightness(1) contrast(1);
  -webkit-filter: brightness(1) contrast(1);
}

@keyframes fall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  100% {
    transform: translateY(110vh) translateX(var(--drift)) rotate(360deg);
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .snowflake {
    animation: none;
    display: none;
  }
}
</style>
