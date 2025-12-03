<template>
  <div class="shipping-page">
    <div class="container">
      <h1 class="shipping-page__title">Доставка и Връщане</h1>

      <section class="shipping-page__section">
        <h2 class="shipping-page__section-title">Доставка</h2>
        <div class="shipping-page__content">
          <p>Доставяме навсякъде в България чрез куриерска компания.</p>
          <ul>
            <li>Безплатна доставка за поръчки над 100 лв.</li>
            <li>Стандартна доставка: 5.99 лв.</li>
            <li>Срок за доставка: 2-5 работни дни.</li>
          </ul>
        </div>
      </section>

      <section class="shipping-page__section">
        <h2 class="shipping-page__section-title">Връщане</h2>
        <div class="shipping-page__content">
          <p>Можете да върнете продукт в срок от 14 дни от получаването.</p>
          <ul>
            <li>Продуктът трябва да е в оригинална опаковка.</li>
            <li>Неизползван и без следи от употреба.</li>
            <li>Разходите по връщането са за сметка на клиента.</li>
          </ul>
        </div>
      </section>

      <section class="shipping-page__section">
        <h2 class="shipping-page__section-title">Контакти</h2>
        <div class="shipping-page__content">
          <p>За въпроси относно доставка и връщане, моля свържете се с нас:</p>
          <NuxtLink to="/contact" class="btn btn--primary"> Свържи се с нас </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Доставка и Връщане - emWear",
  meta: [
    { name: "description", content: "Информация за доставка и връщане на продукти от emWear." },
  ],
});
</script>

<style lang="scss" scoped>
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/fonts" as *;
@use "~/assets/styles/breakpoints" as *;

.shipping-page {
  min-height: 60vh;
  padding: 4rem 1rem;

  &__title {
    font-family: $font-heading;
    font-size: clamp(2rem, 4vw, 3rem);
    color: $brand-ink;
    margin: 0 0 3rem;
    text-align: center;
  }

  &__section {
    margin-bottom: 3rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__section-title {
    font-family: $font-heading;
    font-size: 1.75rem;
    color: $brand-ink;
    margin: 0 0 1rem;
  }

  &__content {
    font-family: $font-body;
    font-size: 1rem;
    line-height: 1.7;
    color: $text-primary;

    p {
      margin: 0 0 1rem;
    }

    ul {
      margin: 1rem 0;
      padding-left: 1.5rem;

      li {
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>
