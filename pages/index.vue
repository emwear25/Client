<template>
  <div class="home-page">
    <HeroSlider />
    <PromoBanner />
    <CategoryPromos />
    <FeaturedProducts />
    <FeatureHighlights />
    <BannerSection />
    <Testimonials />
    <NewsletterSignup />
  </div>
</template>

<script setup lang="ts">
import { usePageSEO } from "~/composables/useSEO";

// Set homepage SEO
usePageSEO({
  title: "Магията на бродерията за твоето дете | emWear",
  description:
    "Превърнете всеки детски аксесоар в уникален спомен. Прецизна бродерия с име, любими герои и много любов. Открийте качеството на emWear – вечни подаръци за малки герои.",
  image: "/emwear-front-page.png",
  type: "website",
});

// Add Organization and WebSite structured data
useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            name: "emWear",
            url: "https://emwear.bg",
            logo: "https://emwear.bg/logo-dark.png",
            description: "Персонализирани подаръци с качествена бродерия",
            sameAs: [
              "https://www.facebook.com/emwearbg/",
              "https://www.instagram.com/emwea.r/",
              "https://www.tiktok.com/@emwear.bg",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "Customer Service",
              email: "info@emwear.bg",
              telephone: "+359894366008",
            },
          },
          {
            "@type": "WebSite",
            name: "emWear",
            url: "https://emwear.bg",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://emwear.bg/products?search={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          },
        ],
      }),
    },
  ],
  link: [
    {
      rel: "preload",
      as: "image",
      href: "/img/banners/banner1.jpg",
      fetchpriority: "high",
    },
    {
      rel: "preload",
      as: "image",
      href: "/img/banners/banner2.jpg",
      fetchpriority: "high",
    },
    {
      rel: "preload",
      as: "image",
      href: "/img/banners/banner3.jpg",
      fetchpriority: "high",
    },
    {
      rel: "preload",
      as: "image",
      href: "/img/banners/banner4.jpg",
      fetchpriority: "high",
    },
  ],
});
</script>

<style lang="scss" scoped>
.home-page {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;

  > * {
    margin: 0;
    max-width: 100%;
  }
}
</style>
