<template>
  <section class="shipping-page">
    <!-- Hero Section -->
    <CommonPageHero
      title="Доставка и Връщане"
      subtitle="Информация за доставка, срокове и условия за връщане на продукти"
    />

    <div class="container">
      <section class="shipping-page__section">
        <h2 class="shipping-page__section-title">Доставка</h2>
        <div class="shipping-page__content">
          <p>Доставяме навсякъде в България чрез куриерска компания (Еконт или Спиди).</p>
          <ul>
            <li>Безплатна доставка за поръчки над 110 лв.</li>
            <li>
              <strong>Цената за доставка се изчислява автоматично</strong> в процеса на поръчка в
              зависимост от:
              <ul style="margin-top: 0.5rem; padding-left: 1.5rem">
                <li>Избрания офис или адрес за доставка</li>
                <li>Теглото и размерите на поръчката</li>
              </ul>
            </li>
            <li>
              <strong>Срок за доставка: 1-3 работни дни</strong> след потвърждение на поръчката.
            </li>
            <li>Можете да изберете доставка до офис на куриер или до адрес (до врата).</li>
          </ul>
          <p class="shipping-page__note">
            Точната цена за доставка ще видите в процеса на поръчка след избор на град и метод на
            доставка.
          </p>
        </div>
      </section>

      <section class="shipping-page__section">
        <h2 class="shipping-page__section-title">Връщане и Рекламации</h2>
        <div class="shipping-page__content">
          <h3 class="shipping-page__subsection-title">Неперсонализирани продукти</h3>
          <p>
            Можете да върнете неперсонализиран продукт в срок от <strong>14 дни</strong> от
            получаването.
          </p>
          <ul>
            <li>Продуктът трябва да е в оригинална опаковка.</li>
            <li>Неизползван и без следи от употреба.</li>
            <li>Разходите по връщането са за сметка на клиента.</li>
          </ul>

          <h3 class="shipping-page__subsection-title">Персонализирани продукти</h3>
          <p>
            Персонализираните продукти (с бродерия, име, персонализиран дизайн)
            <strong>не могат да бъдат върнати</strong>, освен ако:
          </p>
          <ul>
            <li>
              Продуктът е <strong>повреден</strong> или има <strong>производствен дефект</strong>.
            </li>
            <li>
              Полученият продукт <strong>не съответства</strong> на поръчания (грешка от наша
              страна).
            </li>
            <li>В тези случаи ще заменим продукта или ще възстановим пълната сума.</li>
          </ul>
          <p class="shipping-page__contact-note">
            За рекламации и въпроси относно връщане, моля свържете се с нас на
            <strong>info@emwear.bg</strong> или <strong>+359 89 092 7520</strong>.
          </p>
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
  </section>
</template>

<script setup lang="ts">
import { usePageSEO } from "~/composables/useSEO";

usePageSEO({
  title: "Доставка и Връщане",
  description:
    "Информация за доставка и връщане на продукти от emWear. Доставка 1-3 работни дни. Безплатна доставка над 110 лв. Връщане на неперсонализирани продукти до 14 дни.",
  type: "website",
});
</script>

<style lang="scss" scoped>
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/fonts" as *;
@use "~/assets/styles/breakpoints" as *;

.shipping-page {
  min-height: 60vh;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  padding: 0 0 4rem;

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

    h3 {
      font-family: $font-heading;
      font-weight: 600;
    }

    strong {
      color: $brand-ink;
      font-weight: 600;
    }
  }

  &__subsection-title {
    font-family: $font-heading;
    font-size: 1.25rem;
    margin: 1.5rem 0 1rem;
    color: $brand-ink;
    font-weight: 600;
  }

  &__note {
    margin-top: 1rem;
    font-style: italic;
    color: $text-secondary;
  }

  &__contact-note {
    margin-top: 1rem;
  }
}
</style>
