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
  ],

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
        "mdi:heart-outline",
        "mdi:cart-outline",
        "mdi:account-outline",
        "mdi:menu",
        "mdi:close",
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
  },

  // Runtime config for API base URL
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3030",
      frontendUrl: process.env.NUXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
    },
  },
});
