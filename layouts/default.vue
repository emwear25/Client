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
// Layout logic - store initialization handled by plugins
</script>

<style lang="scss" scoped>
@use "~/assets/styles/colors" as *;

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__main {
    flex: 1;
    padding: 0;
    margin: 0;
  }
}
</style>
