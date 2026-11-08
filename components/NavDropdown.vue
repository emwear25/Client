<template>
  <div class="mega" :class="{ 'mega--open': isOpen }">
    <div class="mega__inner">
      <div v-for="group in groups" :key="group.title" class="mega__group">
        <p class="mega__group-title">{{ group.title }}</p>
        <ul class="mega__list">
          <li v-for="item in group.items" :key="item.to">
            <NuxtLink :to="item.to" class="mega__item" @click="emit('itemClick')">
              <span class="mega__thumb">
                <img :src="item.image" :alt="item.label" loading="lazy" />
              </span>
              <span class="mega__label">{{ item.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="mega__foot">
      <NuxtLink to="/products" class="mega__foot-link" @click="emit('itemClick')">
        Всички продукти →
      </NuxtLink>
      <NuxtLink to="/sales" class="mega__foot-link mega__foot-link--sale" @click="emit('itemClick')">
        Намаления
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MegaItem {
  label: string;
  to: string;
  image: string;
}
interface MegaGroup {
  title: string;
  items: MegaItem[];
}

defineProps<{
  groups: MegaGroup[];
  isOpen: boolean;
}>();

const emit = defineEmits<{ itemClick: [] }>();
</script>

<style scoped lang="scss">
.mega {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  width: max-content;
  max-width: min(860px, 94vw);
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.12);
  padding: 1.5rem 1.75rem 1rem;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
  z-index: 100;

  &--open {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0);
  }

  &__inner {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.75rem;

    @media (max-width: 700px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__group-title {
    font-family: "Outfit", sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #a0a79a;
    margin: 0 0 0.75rem;
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.4rem 0.5rem;
    border-radius: 10px;
    text-decoration: none;
    transition: background 0.15s ease;

    &:hover {
      background: #f3f5f0;

      .mega__label {
        color: #2f3a2a;
      }
      .mega__thumb {
        transform: scale(1.05);
      }
    }
  }

  &__thumb {
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    border-radius: 9px;
    overflow: hidden;
    background: #f3f5f0;
    transition: transform 0.2s ease;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &__label {
    font-size: 14px;
    font-weight: 500;
    color: #4a4a4a;
    line-height: 1.2;
    transition: color 0.15s ease;
  }

  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 0.9rem;
    border-top: 1px solid #eee;
  }

  &__foot-link {
    font-size: 13px;
    font-weight: 600;
    color: #2f3a2a;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    &--sale {
      color: #c0607a;
    }
  }
}
</style>
