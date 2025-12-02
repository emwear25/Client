<template>
  <div class="header-wrapper">
    <TopBar />
    <header class="site-header">
      <div class="site-header__container">
        <HeaderLogo />
        <HeaderNav />
        <HeaderIcons :menu-open="menuOpen" @toggle-menu="toggleMenu" />
        <MobileMenu :is-open="menuOpen" @close="closeMenu" />
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TopBar from './TopBar.vue'
import HeaderLogo from './HeaderLogo.vue'
import HeaderNav from './HeaderNav.vue'
import HeaderIcons from './HeaderIcons.vue'
import MobileMenu from './MobileMenu.vue'

// Mobile menu state
const menuOpen = ref(false)

// Toggle mobile menu
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

// Close mobile menu
const closeMenu = () => {
  menuOpen.value = false
}
</script>

<style scoped lang="scss">
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/breakpoints' as *;

.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 12px $shadow-soft;
}

.site-header {
  background: $color-white;
  border-bottom: 2px solid $brand;
  height: 78px;

  @include up(md) {
    height: 84px;
  }

  &__container {
    width: 100%;
    margin-inline: auto;
    padding-inline: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    position: relative;

    @include up(md) {
      max-width: 1104px;
      padding-inline: 20px;
    }
    @include up(lg) {
      max-width: 1472px;
      padding-inline: 24px;
    }
    @include up(xl) {
      max-width: 1656px;
      padding-inline: 32px;
    }
  }
}
</style>
