/**
 * Global error handler plugin for Nuxt
 * Catches unhandled errors and provides fallback UI
 */

export default defineNuxtPlugin((nuxtApp) => {
  const isDev = process.env.NODE_ENV === 'development'

  // Handle Vue errors
  nuxtApp.vueApp.config.errorHandler = (error: Error, instance, info) => {
    console.error('Global Vue error handler:', error, info)

    // Log to error tracking service in production
    if (!isDev) {
      // logErrorToService(error, { context: info, instance })
    }

    // Show user-friendly error message
    // You can use a toast or error notification system here
  }

  // Handle unhandled promise rejections
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)

      // Prevent default browser error handling
      event.preventDefault()

      // Log to error tracking service
      if (!isDev) {
        // logErrorToService(event.reason, { type: 'unhandledRejection' })
      }
    })
  }

  // Handle global JavaScript errors
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      console.error('Global JavaScript error:', event.error)

      // Log to error tracking service
      if (!isDev) {
        // logErrorToService(event.error, {
        //   type: 'globalError',
        //   filename: event.filename,
        //   lineno: event.lineno,
        //   colno: event.colno,
        // })
      }
    })
  }
})

