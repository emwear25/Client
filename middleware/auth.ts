import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore()

    // On SSR, skip auth check - let client-side handle it
    if (import.meta.server) {
        console.log('[Auth Middleware] Running on server, skipping auth check')
        return
    }

    // Wait for auth initialization to complete (max 3 seconds)
    if (!authStore.isInitialized) {
        console.log('[Auth Middleware] Waiting for auth initialization...')
        let attempts = 0
        while (!authStore.isInitialized && attempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 100))
            attempts++
        }
        console.log('[Auth Middleware] Auth initialized after', attempts * 100, 'ms')
    }

    // If we have a token but no user, try to fetch the user
    if (authStore.accessToken && !authStore.user && !authStore.isLoading) {
        console.log('[Auth Middleware] Token exists but no user, fetching...')
        await authStore.fetchUser()
    }

    console.log('[Auth Middleware] Checking auth for:', to.fullPath, '| isAuthenticated:', authStore.isAuthenticated)

    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
        console.log('[Auth Middleware] Not authenticated, redirecting to login')
        // Use replace instead of navigateTo to prevent page flash
        return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`, { replace: true })
    }
    
    console.log('[Auth Middleware] Access granted to:', to.fullPath)
})
