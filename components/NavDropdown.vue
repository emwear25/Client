<template>
  <div class="nav-dropdown" :class="{ 'nav-dropdown--open': isOpen }">
    <ul class="nav-dropdown__list">
      <template v-for="item in items" :key="item.to">
        <li class="nav-dropdown__item">
          <NuxtLink :to="item.to" @click="emit('itemClick')">
            {{ item.label }}
          </NuxtLink>
        </li>
        <li
          v-for="child in item.children || []"
          :key="child.to"
          class="nav-dropdown__item nav-dropdown__item--child"
        >
          <NuxtLink :to="child.to" @click="emit('itemClick')">
            {{ child.label }}
          </NuxtLink>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface DropdownItem {
  label: string;
  to: string;
  children?: { label: string; to: string }[];
}

defineProps<{
  items: DropdownItem[];
  isOpen: boolean;
}>();

const emit = defineEmits<{
  itemClick: [];
}>();
</script>

<style scoped lang="scss">
.nav-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  // Grow with the longest item, wrap only if it gets very long
  min-width: 260px;
  width: max-content;
  max-width: 360px;
  margin: 0;
  padding: 0;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms ease-out;
  z-index: 999;
}

.nav-dropdown--open {
  opacity: 1;
  pointer-events: auto;
}

.nav-dropdown__list {
  list-style: none;
  margin: 0;
  padding: 16px 0;
}

.nav-dropdown__item {
  padding: 8px 24px;
  white-space: normal;

  a {
    display: block;
    font-size: 16px;
    line-height: 1.4;
    color: #333;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  &:hover {
    background-color: #f7f7f7;

    a {
      color: #111;
    }
  }

  a:focus-visible {
    outline: 2px solid #000;
    outline-offset: -2px;
  }
}

.nav-dropdown__item--child {
  padding-left: 40px;

  a {
    font-size: 14.5px;
    color: #555;
  }
}
</style>
