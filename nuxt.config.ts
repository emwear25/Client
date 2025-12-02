// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  // Completely disable devtools to prevent localStorage SSR errors
  devtools: false,

  // Disable Vue DevTools integration

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  icon: {
    serverBundle: {
      collections: ['mdi']
    },
    clientBundle: {
      icons: [
        'mdi:heart-outline',
        'mdi:cart-outline',
        'mdi:account-outline',
        'mdi:menu',
        'mdi:close'
      ]
    }
  },

  css: ['~/assets/styles/main.scss'],

  // Disable Vue DevTools integration
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }
  },

  // Proxy API requests to backend server
  nitro: {
    devProxy: {
      '/api': {
        target: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3030',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
        // Forward cookies for Google OAuth
        headers: {
          'Access-Control-Allow-Credentials': 'true'
        }
      }
    }
  },

  // Runtime config for API base URL
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3030',
      frontendUrl: process.env.NUXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'
    }
  }
})