<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__section">
        <FooterNav />
      </div>
      <div class="footer__bottom">
        <FooterBottom />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import FooterNav from './FooterNav.vue'
import FooterBottom from './FooterBottom.vue'
</script>

<style scoped lang="scss">
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/breakpoints' as *;

.footer {
  width: 100%;
  background: $brand-ink;
  color: $color-white;
  padding: 3rem 0 2rem;

  @include up(md) {
    padding: 4rem 0 2rem;
  }

  &__container {
    width: 100%;
    margin-inline: auto;
    padding-inline: 16px;

    @include up(md) { 
      max-width: 960px; 
      padding-inline: 20px; 
    }
    @include up(lg) { 
      max-width: 1280px; 
      padding-inline: 24px; 
    }
    @include up(xl) { 
      max-width: 1440px; 
      padding-inline: 32px; 
    }
  }

  &__section {
    margin-bottom: 2.5rem;

    @include up(md) {
      margin-bottom: 3rem;
    }
  }

  &__bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding-top: 2rem;
  }
}
</style>
