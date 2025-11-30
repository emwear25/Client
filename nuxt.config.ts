// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  // Completely disable devtools to prevent localStorage SSR errors
  devtools: false,

  // Disable Vue DevTools integration
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }
  },

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

  // Proxy API requests to backend server
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3030/api',
        changeOrigin: true
      }
    }
  }
})