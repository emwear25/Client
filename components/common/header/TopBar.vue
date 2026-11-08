<template>
  <div class="topbar">
    <div class="topbar__container">
      <span class="topbar__bf">⚡ BLACK FRIDAY</span>
      <span class="topbar__deals">
        Комплект баня до <strong>−20%</strong>
        <span class="topbar__dot">·</span>
        Раница + ключодържател <strong>−10%</strong>
        <span class="topbar__dot">·</span>
        Безплатна доставка над <strong>€60</strong>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Black Friday announcement bar (shows on every page).
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.topbar {
  background: linear-gradient(90deg, #1b2119 0%, #2f3a2a 100%);
  color: #fff;
  font-family: $font-ui;

  &__container {
    width: 100%;
    margin-inline: auto;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px 12px;
    min-height: 40px;
    text-align: center;

    @include up(md) {
      max-width: 1472px;
      padding-inline: 24px;
    }
  }

  &__bf {
    font-weight: 800;
    font-size: 0.8125rem;
    letter-spacing: 0.1em;
    color: #e7c873;
    white-space: nowrap;

    @media (max-width: 767px) {
      font-size: 0.75rem;
    }
  }

  &__deals {
    font-weight: 400;
    font-size: 0.8125rem;
    letter-spacing: 0.03em;
    color: rgba(255, 255, 255, 0.92);

    strong {
      color: #e7c873;
      font-weight: 700;
    }

    @media (max-width: 767px) {
      font-size: 0.6875rem;
      line-height: 1.5;
    }
  }

  &__dot {
    color: rgba(255, 255, 255, 0.4);
    margin: 0 2px;
  }
}
</style>
