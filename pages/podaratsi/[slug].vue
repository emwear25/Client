<template>
  <section v-if="page" class="occasion-page">
    <div class="occasion-hero">
      <div class="container">
        <nav class="occasion-hero__crumbs" aria-label="Навигация">
          <NuxtLink to="/">Начало</NuxtLink>
          <span aria-hidden="true">/</span>
          <NuxtLink to="/podaratsi">Подаръци по повод</NuxtLink>
        </nav>
        <h1 class="occasion-hero__title">{{ page.h1 }}</h1>
        <p class="occasion-hero__intro">{{ page.intro }}</p>
      </div>
    </div>

    <div class="container">
      <div v-for="group in groups" :key="group.slug" class="occasion-group">
        <div class="occasion-group__head">
          <h2 class="occasion-group__title">{{ group.name }}</h2>
          <NuxtLink :to="`/category/${group.slug}`" class="occasion-group__more">
            Виж всички →
          </NuxtLink>
        </div>
        <div class="occasion-grid">
          <CatalogProductCard
            v-for="product in group.products"
            :key="product._id"
            :product="product"
            @quick-view="openQuickView"
          />
        </div>
      </div>
    </div>

    <SeoContent :sections="page.sections" :faq="page.faq" :related="page.related" />

    <CatalogQuickViewDrawer :open="drawerOpen" :product="activeProduct" @close="drawerOpen = false" />
  </section>
</template>

<script setup lang="ts">
import { useApi } from "~/composables/useApi";
import { usePageSEO } from "~/composables/useSEO";
import { useBreadcrumbs } from "~/composables/useBreadcrumbs";
import { LANDING_BY_SLUG } from "~/utils/seoContent";
import SeoContent from "~/components/common/sections/SeoContent.vue";
import type QuickViewDrawer from "~/components/catalog/QuickViewDrawer.vue";

type QuickViewProduct = InstanceType<typeof QuickViewDrawer>["$props"]["product"];

const route = useRoute();
const slug = computed(() => route.params.slug as string);
const page = computed(() => LANDING_BY_SLUG[slug.value] || null);

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: "Страницата не е намерена", fatal: true });
}

// Shape returned by GET /products (what ProductCard / QuickViewDrawer expect)
interface OccasionProduct {
  _id: string;
  slug?: string;
  name: string;
  description: string;
  price: number;
  compareAt?: number | null;
  category: string | { _id: string; name: string };
  images?: Array<{ url: string; publicId: string }>;
  stock: number;
  createdAt: string;
}

interface ApiCategory {
  _id: string;
  slug: string;
  name: string;
  displayName?: string;
}

interface Group {
  slug: string;
  name: string;
  products: OccasionProduct[];
}

const { data: groups } = await useAsyncData(
  `occasion-${slug.value}`,
  async (): Promise<Group[]> => {
    const current = LANDING_BY_SLUG[slug.value];
    if (!current) return [];
    const api = useApi();
    const categoriesResponse = await api.get<{ success: boolean; data: ApiCategory[] }>("categories?active=true");
    const categories = categoriesResponse?.data || [];

    const results = await Promise.all(
      current.categories.map(async (categorySlug) => {
        const cat = categories.find((c) => c.slug === categorySlug);
        if (!cat) return null;
        try {
          const res = await api.get(
            `products?category=${cat._id}&active=true&page=1&limit=${current.perCategory || 4}&sortBy=newest`
          );
          const products = Array.isArray(res?.data) ? res.data : [];
          return products.length
            ? { slug: cat.slug, name: cat.displayName || cat.name, products }
            : null;
        } catch {
          return null;
        }
      })
    );
    return results.filter((g): g is Group => Boolean(g));
  },
  { default: () => [], watch: [slug] }
);

const drawerOpen = ref(false);
const activeProduct = ref<QuickViewProduct>(null);
const openQuickView = (product: OccasionProduct) => {
  // Same API object; the drawer just declares a richer type
  activeProduct.value = product as unknown as QuickViewProduct;
  drawerOpen.value = true;
};

usePageSEO(() =>
  page.value
    ? {
        title: page.value.title,
        description: page.value.description,
        image: page.value.image || groups.value?.[0]?.products?.[0]?.images?.[0]?.url,
        path: `/podaratsi/${page.value.slug}`,
      }
    : null
);

useBreadcrumbs(() =>
  page.value
    ? [
        { name: "Начало", url: "/" },
        { name: "Подаръци по повод", url: "/podaratsi" },
        { name: page.value.label, url: `/podaratsi/${page.value.slug}` },
      ]
    : null
);

useHead(() => {
  const products = (groups.value || []).flatMap((g) => g.products);
  if (!page.value || !products.length) return {};
  return {
    script: [
      {
        key: "ld-collection",
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: page.value.h1,
          description: page.value.description,
          url: `https://www.emwear.bg/podaratsi/${page.value.slug}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: products.length,
            itemListElement: products.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://www.emwear.bg/products/${p.slug || p._id}`,
              name: p.name,
            })),
          },
        }),
      },
    ],
  };
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/colors" as *;
@use "@/assets/styles/breakpoints" as *;

.occasion-page {
  min-height: 100vh;
  overflow-x: hidden;
}

.occasion-hero {
  background: $grad-brand-a;
  padding: 2.5rem 0 3rem;
  text-align: center;
  color: $brand-ink;

  @include up(md) {
    padding: 3.5rem 0 4rem;
  }

  &__crumbs {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    color: $text-secondary;

    a {
      color: inherit;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__title {
    font-family: "Outfit", sans-serif;
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 1rem;
    line-height: 1.15;

    @include up(md) {
      font-size: 3rem;
    }
  }

  &__intro {
    max-width: 680px;
    margin: 0 auto;
    font-size: 1.05rem;
    line-height: 1.6;
    color: $text-primary;
  }
}

.occasion-group {
  margin-top: 2.5rem;

  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  &__title {
    font-family: "Outfit", sans-serif;
    font-size: 1.4rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0;

    @include up(md) {
      font-size: 1.75rem;
    }
  }

  &__more {
    flex-shrink: 0;
    color: $brand-ink;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.occasion-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @include up(md) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @include up(lg) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}
</style>
