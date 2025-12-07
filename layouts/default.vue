<template>
  <div class="app-layout">
    <!-- Header -->
    <CommonHeader />

    <!-- Main Content -->
    <main class="app-layout__main">
      <slot />
    </main>

    <!-- Footer -->
    <CommonFooter />

    <!-- Toast Container -->
    <CommonToastContainer />

    <!-- Cart Drawer -->
    <CartDrawer />
  </div>
</template>

<script setup lang="ts">
import { useDefaultSEO } from "~/composables/useSEO";

// Set default SEO for all pages
useDefaultSEO();
</script>

<style lang="scss" scoped>
@use "~/assets/styles/colors" as *;

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;

  &__main {
    flex: 1;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    width: 100%;
    max-width: 100%;
  }
}
</style>
