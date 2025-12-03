<template>
  <div v-if="error" class="error-boundary">
    <div class="error-boundary__container">
      <div class="error-boundary__icon">⚠️</div>
      <h2 class="error-boundary__title">Нещо се обърка</h2>
      <p class="error-boundary__message">
        Извиняваме се за неудобството. Възникна неочаквана грешка.
      </p>
      <div v-if="errorInfo" class="error-boundary__details">
        <details>
          <summary>Детайли за грешката</summary>
          <pre class="error-boundary__error">{{ error }}</pre>
          <pre v-if="errorInfo.componentStack" class="error-boundary__stack"
            >{{ errorInfo.componentStack }}
          </pre>
        </details>
      </div>
      <div class="error-boundary__actions">
        <button class="error-boundary__button" @click="handleReset">Опитай отново</button>
        <button class="error-boundary__button error-boundary__button--secondary" @click="goHome">
          Начало
        </button>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, provide } from "vue";
import { useRouter } from "vue-router";

interface ErrorInfo {
  componentStack?: string;
  errorBoundary?: boolean;
}

const error = ref<Error | null>(null);
const errorInfo = ref<ErrorInfo | null>(null);
const router = useRouter();

// Capture errors from child components
onErrorCaptured((err: Error, instance, info) => {
  error.value = err;
  errorInfo.value = {
    componentStack: info,
    errorBoundary: true,
  };

  // Log error for debugging
  console.error("ErrorBoundary caught an error:", err, info);

  // You can also send error to logging service here
  // logErrorToService(err, info)

  // Return false to prevent error from propagating
  return false;
});

const handleReset = () => {
  error.value = null;
  errorInfo.value = null;
  // Force component to re-render
  window.location.reload();
};

const goHome = () => {
  router.push("/");
};

// Provide error handling context to child components
provide("errorBoundary", {
  reset: handleReset,
});
</script>

<style scoped lang="scss">
.error-boundary {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #fff;

  &__container {
    max-width: 600px;
    text-align: center;
    padding: 2rem;
    border: 2px solid #e74c3c;
    border-radius: 8px;
    background: #fff;
  }

  &__icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 1rem;
  }

  &__message {
    font-size: 1rem;
    color: #666;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  &__details {
    margin: 1.5rem 0;
    text-align: left;

    details {
      cursor: pointer;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;

      summary {
        font-weight: 600;
        color: #333;
        margin-bottom: 0.5rem;

        &:hover {
          color: #e74c3c;
        }
      }
    }
  }

  &__error,
  &__stack {
    font-size: 0.875rem;
    color: #e74c3c;
    background: #fff;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 300px;
    overflow-y: auto;
  }

  &__actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }

  &__button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #e74c3c;
    color: #fff;

    &:hover {
      background: #c0392b;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
    }

    &:active {
      transform: translateY(0);
    }

    &--secondary {
      background: #95a5a6;
      color: #fff;

      &:hover {
        background: #7f8c8d;
      }
    }
  }
}
</style>
