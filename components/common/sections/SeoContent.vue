<template>
  <section v-if="sections.length || faq.length || relatedPages.length" class="seo-content">
    <div class="container seo-content__inner">
      <div v-for="section in sections" :key="section.heading" class="seo-content__block">
        <h2 class="seo-content__heading">{{ section.heading }}</h2>
        <!-- Copy is static, trusted content from utils/seoContent.ts -->
        <!-- eslint-disable vue/no-v-html -->
        <p v-for="(p, i) in section.paragraphs" :key="i" class="seo-content__text" v-html="p" />
        <ul v-if="section.bullets?.length" class="seo-content__list">
          <li v-for="(b, i) in section.bullets" :key="i" v-html="b" />
        </ul>
        <!-- eslint-enable vue/no-v-html -->
      </div>

      <div v-if="faq.length" class="seo-content__block">
        <h2 class="seo-content__heading">Често задавани въпроси</h2>
        <details v-for="item in faq" :key="item.q" class="seo-content__faq">
          <summary class="seo-content__question">{{ item.q }}</summary>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p class="seo-content__text" v-html="item.a" />
        </details>
      </div>

      <nav v-if="relatedPages.length" class="seo-content__block" aria-label="Подаръци по повод">
        <h2 class="seo-content__heading">Подаръци по повод</h2>
        <ul class="seo-content__chips">
          <li v-for="page in relatedPages" :key="page.slug">
            <NuxtLink :to="`/podaratsi/${page.slug}`" class="seo-content__chip">{{ page.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>

<script setup lang="ts">
import { LANDING_BY_SLUG, type LandingPage, type SeoFaq, type SeoSection } from "~/utils/seoContent";

const props = withDefaults(
  defineProps<{
    sections?: SeoSection[];
    faq?: SeoFaq[];
    related?: string[];
  }>(),
  { sections: () => [], faq: () => [], related: () => [] }
);

const relatedPages = computed(() =>
  props.related
    .map((slug) => LANDING_BY_SLUG[slug])
    .filter((page): page is LandingPage => Boolean(page))
);
</script>

<style lang="scss" scoped>
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;

.seo-content {
  padding: 3rem 0 4rem;
  border-top: 1px solid $border-base;
  margin-top: 3rem;

  &__inner {
    max-width: 820px;
    margin: 0 auto;
  }

  &__block + &__block {
    margin-top: 2.25rem;
  }

  &__heading {
    font-family: "Outfit", sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.75rem;

    @include up(md) {
      font-size: 1.75rem;
    }
  }

  &__text,
  &__list {
    color: $text-primary;
    font-size: 1rem;
    line-height: 1.7;
    margin: 0 0 0.75rem;
  }

  &__list {
    padding-left: 1.25rem;

    li + li {
      margin-top: 0.35rem;
    }
  }

  :deep(a) {
    color: $brand-ink;
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      color: $brand-hover;
    }
  }

  &__faq {
    border-bottom: 1px solid $border-base;
    padding: 0.85rem 0;

    .seo-content__text {
      margin: 0.6rem 0 0;
    }
  }

  &__question {
    cursor: pointer;
    font-weight: 600;
    color: $brand-ink;
    list-style-position: outside;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__chip {
    display: inline-block;
    padding: 0.45rem 0.9rem;
    border-radius: 999px;
    background: $bg-card;
    border: 1px solid $border-base;
    text-decoration: none !important;
    font-size: 0.95rem;

    &:hover {
      border-color: $brand;
    }
  }
}
</style>
