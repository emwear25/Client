<template>
  <div class="about-page">
    <AboutUsHeroBanner />
    <AboutUsOurStory />
    <AboutUsWhatMakesUsDifferent />
    <AboutUsMeetTheMaker />
    <Testimonials />
    <AboutUsCallToAction />
  </div>
</template>

<script setup lang="ts">
import { usePageSEO } from "~/composables/useSEO";

// Set page SEO
usePageSEO({
  title: "За нас",
  description:
    "Научете повече за emWear - създаваме персонализирани подаръци с внимание към всеки детайл. Произведено в България с много грижа и любов.",
  type: "website",
});

// Add AboutPage structured data
useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "За нас - emWear",
        description:
          "Научете повече за emWear - създаваме персонализирани подаръци с внимание към всеки детайл.",
        mainEntity: {
          "@type": "Organization",
          name: "emWear",
          description: "Персонализирани подаръци с качествена бродерия",
        },
      }),
    },
  ],
});
</script>

<style scoped lang="scss">
.about-page {
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
  // No additional styles needed - components handle their own spacing
}
</style>
