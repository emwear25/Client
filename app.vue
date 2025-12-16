<template>
  <ErrorBoundary>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ErrorBoundary>
</template>

<script setup lang="ts">
// ===== GLOBAL ORGANIZATION & WEBSITE SCHEMA =====
// SEO Benefit: Establishes brand identity, enables search box in Google results

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'emWear',
  url: 'https://emwear.bg',
  logo: 'https://emwear.bg/logo-dark.png',
  description: 'Персонализирани подаръци с качествена бродерия. Детски раници, торби, чанти с име.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    availableLanguage: ['Bulgarian', 'bg'],
    areaServed: 'BG',
  },
  sameAs: [
    'https://www.facebook.com/emwear',
    'https://www.instagram.com/emwear',
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'BG',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'emWear',
  url: 'https://emwear.bg',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://emwear.bg/products?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

// Inject schemas into head
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(organizationSchema),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(websiteSchema),
    },
  ],
});
</script>
