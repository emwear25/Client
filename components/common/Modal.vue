<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal" @click.self="handleClose">
        <!-- Backdrop -->
        <div class="modal__backdrop" />
        
        <!-- Modal Container -->
        <div class="modal__container" :class="{ 'modal__container--centered': centered }">
          <!-- Close Button -->
          <button class="modal__close" aria-label="Затвори" @click="handleClose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- Content -->
          <div class="modal__content">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from "vue";

interface Props {
  open: boolean;
  centered?: boolean;
  closeOnBackdrop?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  centered: true,
  closeOnBackdrop: true,
});

const emit = defineEmits<{
  "update:open": [value: boolean];
  close: [];
}>();

const handleClose = () => {
  if (props.closeOnBackdrop) {
    emit("update:open", false);
    emit("close");
  }
};

// Handle ESC key
const handleEsc = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.open) {
    handleClose();
  }
};

// Prevent body scroll when modal is open
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  },
  { immediate: true }
);

onMounted(() => {
  document.addEventListener("keydown", handleEsc);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEsc);
  document.body.style.overflow = "";
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/colors" as *;
@use "@/assets/styles/breakpoints" as *;

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal__container {
  position: relative;
  z-index: 9999;
  background: $bg-card;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 90vw;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &--centered {
    max-width: 600px;
  }

  @include up(md) {
    max-width: 700px;
  }
}

.modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10000;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid $border-base;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  color: $text-primary;

  &:hover {
    background: white;
    border-color: $brand;
    color: $brand;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

.modal__content {
  overflow-y: auto;
  padding: 2rem;
  max-height: 90vh;

  @include up(md) {
    padding: 2.5rem;
  }
}

// Transitions
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal__container,
.modal-leave-active .modal__container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal__container {
    transform: scale(0.95);
    opacity: 0;
  }
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;

  .modal__container {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

