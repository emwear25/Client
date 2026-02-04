<template>
  <ErrorBoundary>
    <ChristmasDecorations />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ErrorBoundary>
</template>

<script setup lang="ts">
// Global SEO schema - Organization and WebSite for brand panels in Google

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          // Organization schema - helps with brand panels
          {
            '@type': 'Organization',
            '@id': 'https://emwear.bg/#organization',
            name: 'emWear',
            url: 'https://emwear.bg',
            logo: {
              '@type': 'ImageObject',
              url: 'https://emwear.bg/logo-dark.png',
              width: 200,
              height: 60,
            },
            description: 'Персонализирани детски изделия с бродерия - халати, раници, кърпи и гергефи. Ръчно изработено в България.',
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              email: 'contact@emwear.bg',
              availableLanguage: 'Bulgarian',
            },
            sameAs: [
              'https://www.facebook.com/emwearbg/',
              'https://www.instagram.com/emwea.r/',
              'https://www.tiktok.com/@emwear.bg',
            ],
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'BG',
            },
          },
          // WebSite schema with SearchAction for sitelinks
          {
            '@type': 'WebSite',
            '@id': 'https://emwear.bg/#website',
            url: 'https://emwear.bg',
            name: 'emWear',
            description: 'Персонализирани детски изделия с бродерия - халати, раници, кърпи и гергефи. Ръчно изработено в България.',
            publisher: {
              '@id': 'https://emwear.bg/#organization',
            },
            inLanguage: 'bg-BG',
            // SearchAction enables sitelinks searchbox in Google
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://emwear.bg/products?search={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          },
        ],
      }),
    },
  ],
});
</script>
