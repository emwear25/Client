// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",

  // Completely disable devtools to prevent localStorage SSR errors
  devtools: false,

  // Disable Vue DevTools integration

  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "nuxt-gtag",
  ],

  // Google Analytics Configuration
  gtag: {
    id: process.env.NUXT_PUBLIC_GTAG_ID,
  },

  // SEO Configuration
  app: {
    head: {
      htmlAttrs: {
        lang: "bg",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "emWear - Персонализирани детски изделия с бродерия",
      titleTemplate: "%s | emWear",
      meta: [
        {
          name: "description",
          content:
            "Детски халати, раници и кърпи с бродирано име. Ръчно персонализирани в България. Бърза изработка до 48 часа. Безплатна доставка над 110 лв!",
        },
        {
          name: "format-detection",
          content: "telephone=no",
        },
        {
          name: "google-site-verification",
          content: "sHIs7mS_DUrEeMcB8eEyoKtupqBx-m1G8MrW67zKl4U",
        },
        {
          property: "og:site_name",
          content: "emWear",
        },
        {
          property: "og:locale",
          content: "bg_BG",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:site",
          content: "@emwear",
        },
        {
          name: "facebook-domain-verification",
          content: "6hxpk71iufv6pwh7sxcxk2wm5dt26e",
        },
        {
          property: "fb:app_id",
          content: "1363872864704654", // Your Facebook Pixel ID
        },
      ],
      link: [
        {
          rel: "canonical",
          href: process.env.NUXT_PUBLIC_FRONTEND_URL || "https://emwear.bg",
        },
      ],
    },
  },

  // Image optimization configuration for ecommerce
  image: {
    // Use ipx provider (works with any URL, including Cloudinary)
    provider: "ipx",
    // Quality settings
    quality: 80,
    format: ["webp"],
    // Screen sizes for responsive images
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    // Default modifiers
    modifiers: {
      quality: 80,
      format: "webp",
    },
    // Presets for different use cases
    presets: {
      // Product card thumbnail (grid view)
      productCard: {
        modifiers: {
          format: "webp",
          quality: 75,
          width: 400,
          height: 400,
        },
      },
      // Product detail page main image
      productDetail: {
        modifiers: {
          format: "webp",
          quality: 85,
          width: 800,
          height: 800,
        },
      },
      // Product thumbnail (gallery)
      productThumb: {
        modifiers: {
          format: "webp",
          quality: 70,
          width: 100,
          height: 100,
        },
      },
    },
  },

  icon: {
    serverBundle: {
      collections: ["mdi"],
    },
    clientBundle: {
      icons: [
        // Header icons
        "mdi:heart-outline",
        "mdi:cart-outline",
        "mdi:account-outline",
        "mdi:menu",
        "mdi:close",
        "mdi:package-variant",
        "mdi:logout",
        // FeatureHighlights icons (homepage)
        "mdi:alphabetical-variant",
        "mdi:cog",
        "mdi:truck-fast",
        "mdi:gift-outline",
        // Testimonials/Reviews
        "mdi:star",
        "mdi:star-outline",
        "mdi:format-quote-open",
        "mdi:check-decagram",
        // Contact page
        "mdi:phone",
        "mdi:email",
        // Footer
        "mdi:facebook",
        "mdi:instagram",
        // Newsletter
        "mdi:email-heart-outline",
        "mdi:email-outline",
        "mdi:arrow-right",
        // Category grid
        "mdi:backpack",
        "mdi:bathtub-outline",
        "mdi:tshirt-crew",
      ],
    },
  },

  css: ["~/assets/styles/main.scss"],

  // Disable Vue DevTools integration
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
    optimizeDeps: {
      include: ["markdown-it", "dompurify"],
    },
  },

  // Proxy API requests to backend server
  nitro: {
    devProxy: {
      "/api": {
        target: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3030",
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
        // Forward cookies for Google OAuth
        headers: {
          "Access-Control-Allow-Credentials": "true",
        },
      },
    },
    compressPublicAssets: true,
    minify: true,
    prerender: {
      crawlLinks: true,
      routes: ["/", "/products", "/about", "/contact"],
      failOnError: false, // Don't fail build on 404s during prerendering
    },
  },

  // Runtime config for API base URL
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3030",
      frontendUrl: process.env.NUXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
      gtagId: process.env.NUXT_PUBLIC_GTAG_ID || "",
    },
  },

  // Performance optimizations for SEO
  experimental: {
    payloadExtraction: false, // Faster page loads
  },

  // SEO and performance
  routeRules: {
    // Static pages - pre-render for better SEO (shorter cache for faster updates)
    "/": { prerender: true, headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    "/about": { prerender: true, headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    "/contact": { prerender: true, headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    "/blog": { ssr: true, isr: 300, headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }, // SSR for dynamic blog content
    "/blog/**": { ssr: true, isr: 300, headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }, // Individual blog posts
    "/privacy-policy": { prerender: true, headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    "/terms": { prerender: true, headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    "/shipping": { prerender: true, headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    "/products": { prerender: true, isr: 300, headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }, // ISR with 5 min cache
    // Dynamic product pages - SSR for SEO (shorter cache)
    "/products/**": { ssr: true, isr: 300, headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    "/category/**": { ssr: true, isr: 300, headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    // Private pages - no cache
    "/checkout": { prerender: false, headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } },
    "/cart": { prerender: false, headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } },
    "/profile": { prerender: false, headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } },
    "/orders": { prerender: false, headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } },
    // "/login": { prerender: false, headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } },
    "/register": { prerender: false, headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } },
  },
});
