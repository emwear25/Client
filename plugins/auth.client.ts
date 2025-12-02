import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async () => {
  // Only run on client side
  if (!import.meta.client) return
  const authStore = useAuthStore()
  
  console.log('[Auth Plugin] BEFORE loadFromStorage:')
  console.log('  - isAuthenticated:', authStore.isAuthenticated)
  console.log('  - user:', !!authStore.user)
  console.log('  - localStorage accessToken:', !!localStorage.getItem('accessToken'))
  
  // CRITICAL: Load tokens from localStorage on client side (for email/password users)
  authStore.loadFromStorage()
  
  console.log('[Auth Plugin] AFTER loadFromStorage:')
  console.log('  - isAuthenticated:', authStore.isAuthenticated)
  console.log('  - user:', !!authStore.user)
  
  // Always try to fetch user (works for both cookie-based and token-based auth)
  // Cookie-based auth (Google OAuth) doesn't need a token in localStorage
  // After Google OAuth redirect, user won't be loaded yet, so fetchUser will get it from cookie
  // IMPORTANT: Always fetch user on page load to check for cookie-based auth (Google OAuth)
  console.log('[Auth Plugin] Fetching user (cookie or token)...')
  await authStore.fetchUser()
  console.log('[Auth Plugin] User fetch completed:', {
    hasUser: !!authStore.user,
    userEmail: authStore.user?.email,
    isAuthenticated: authStore.isAuthenticated
  })
  
  // Mark as initialized
  authStore.isInitialized = true
  
  console.log('[Auth Plugin] FINAL STATE:')
  console.log('  - isAuthenticated:', authStore.isAuthenticated)
  console.log('  - user:', authStore.user?.email)
  console.log('  - isInitialized:', authStore.isInitialized)
})

