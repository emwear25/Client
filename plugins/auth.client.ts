import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  console.log('[Auth Plugin] BEFORE loadFromStorage:')
  console.log('  - accessToken:', !!authStore.accessToken)
  console.log('  - user:', !!authStore.user)
  console.log('  - localStorage accessToken:', !!localStorage.getItem('accessToken'))
  
  // CRITICAL: Load tokens from localStorage on client side
  authStore.loadFromStorage()
  
  console.log('[Auth Plugin] AFTER loadFromStorage:')
  console.log('  - accessToken:', !!authStore.accessToken)
  console.log('  - user:', !!authStore.user)
  
  // Load user if token exists
  if (authStore.accessToken && !authStore.user) {
    console.log('[Auth Plugin] Token found, fetching user...')
    await authStore.fetchUser()
    console.log('[Auth Plugin] User fetched:', !!authStore.user)
  } else if (authStore.accessToken && authStore.user) {
    console.log('[Auth Plugin] User already loaded:', authStore.user.email)
  } else {
    console.log('[Auth Plugin] No token found - cannot fetch user')
  }
  
  // Mark as initialized
  authStore.isInitialized = true
  
  console.log('[Auth Plugin] FINAL STATE:')
  console.log('  - isAuthenticated:', authStore.isAuthenticated)
  console.log('  - user:', authStore.user?.email)
  console.log('  - isInitialized:', authStore.isInitialized)
})

