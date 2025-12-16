<template>
  <div class="home-page">
    <HeroSlider />
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
  title: "emWear - Персонализирани детски изделия с бродерия",
  description:
    "Детски халати, раници и кърпи с бродирано име. Ръчно персонализирани в България. Бърза изработка до 48 часа. Безплатна доставка над 110 лв!",
  image: "/logo-dark.png",
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
