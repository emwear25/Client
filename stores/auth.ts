import { defineStore } from 'pinia'

export interface User {
    _id: string
    email: string
    firstName?: string
    lastName?: string
    phone?: string
    addresses?: Address[]
    role: 'customer' | 'admin'
    isVerified: boolean
    createdAt: string
    updatedAt: string
}

export interface Address {
    _id: string
    type: 'home' | 'work' | 'other' | 'econt_office' | 'econt_automat'
    street: string
    city: string
    postalCode: string
    country: string
    isDefault: boolean
    econtOfficeCode?: string
    econtOfficeName?: string
}

interface AuthState {
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    isLoading: boolean
}

const API_URL = 'http://localhost:3030/api/auth'

// Load tokens from localStorage
const loadTokens = () => {
    if (typeof window === 'undefined') return { accessToken: null, refreshToken: null }

    try {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        return { accessToken, refreshToken }
    } catch (error) {
        console.error('Error loading tokens:', error)
        return { accessToken: null, refreshToken: null }
    }
}

// Save tokens to localStorage
const saveTokens = (accessToken: string | null, refreshToken: string | null) => {
    if (typeof window === 'undefined') return

    try {
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken)
        } else {
            localStorage.removeItem('accessToken')
        }

        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken)
        } else {
            localStorage.removeItem('refreshToken')
        }
    } catch (error) {
        console.error('Error saving tokens:', error)
    }
}

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<User | null>(null)
    const { accessToken: savedAccessToken, refreshToken: savedRefreshToken } = loadTokens()
    const accessToken = ref<string | null>(savedAccessToken)
    const refreshToken = ref<string | null>(savedRefreshToken)
    const isLoading = ref(false)
    const isInitialized = ref(false) // Track if plugin has run

    // Debug logging
    if (process.client) {
        console.log('[Auth Store] Initialized with token:', !!savedAccessToken)
        if (savedAccessToken) {
            console.log('[Auth Store] Token preview:', savedAccessToken.substring(0, 20) + '...')
        }
    }

    // Getters
    const isAuthenticated = computed(() => !!user.value && !!accessToken.value)
    const isAdmin = computed(() => user.value?.role === 'admin')
    const fullName = computed(() => {
        if (!user.value) return null
        const { firstName, lastName } = user.value
        if (firstName && lastName) return `${firstName} ${lastName}`
        if (firstName) return firstName
        if (lastName) return lastName
        return null
    })

    // Actions
    const register = async (email: string, password: string) => {
        isLoading.value = true

        try {
            const response = await $fetch(`${API_URL}/register`, {
                method: 'POST',
                body: { email, password }
            })

            if (response.success && response.data) {
                user.value = response.data.user
                accessToken.value = response.data.accessToken
                refreshToken.value = response.data.refreshToken

                saveTokens(response.data.accessToken, response.data.refreshToken)

                return { success: true, user: response.data.user }
            }

            throw new Error(response.message || 'Registration failed')
        } catch (error: any) {
            console.error('Registration error:', error)
            throw new Error(error.data?.message || error.message || 'Registration failed')
        } finally {
            isLoading.value = false
        }
    }

    const login = async (email: string, password: string) => {
        isLoading.value = true

        try {
            const response = await $fetch(`${API_URL}/login`, {
                method: 'POST',
                body: { email, password }
            })

            if (response.success && response.data) {
                user.value = response.data.user
                accessToken.value = response.data.accessToken
                refreshToken.value = response.data.refreshToken

                saveTokens(response.data.accessToken, response.data.refreshToken)

                return { success: true, user: response.data.user }
            }

            throw new Error(response.message || 'Login failed')
        } catch (error: any) {
            console.error('Login error:', error)
            throw new Error(error.data?.message || error.message || 'Login failed')
        } finally {
            isLoading.value = false
        }
    }

    const loadFromStorage = () => {
        console.log('[Auth loadFromStorage] Called, process.client:', process.client)
        if (process.client) {
            const tokens = loadTokens()
            console.log('[Auth loadFromStorage] Tokens loaded:', {
                accessToken: !!tokens.accessToken,
                refreshToken: !!tokens.refreshToken
            })
            accessToken.value = tokens.accessToken
            refreshToken.value = tokens.refreshToken
            console.log('[Auth loadFromStorage] State updated:', {
                accessToken: !!accessToken.value,
                refreshToken: !!refreshToken.value
            })
        } else {
            console.log('[Auth loadFromStorage] Skipped - not on client')
        }
    }

    const logout = async () => {
        try {
            if (refreshToken.value) {
                await $fetch(`${API_URL}/logout`, {
                    method: 'POST',
                    body: { refreshToken: refreshToken.value }
                })
            }
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            // Clear state regardless of API call success
            user.value = null
            accessToken.value = null
            refreshToken.value = null
            saveTokens(null, null)
        }
    }

    const fetchUser = async () => {
        if (!accessToken.value) {
            console.log('[Auth] No access token, skipping fetch')
            return
        }

        isLoading.value = true
        console.log('[Auth] Fetching user with token:', accessToken.value.substring(0, 20) + '...')

        try {
            const response = await $fetch(`${API_URL}/me`, {
                headers: {
                    Authorization: `Bearer ${accessToken.value}`
                }
            })

            if (response.success && response.data) {
                user.value = response.data.user
                console.log('[Auth] User fetched successfully:', user.value.email)
                return { success: true, user: response.data.user }
            }
        } catch (error: any) {
            console.error('[Auth] Fetch user error:', error)

            // If token is invalid, try to refresh
            if (error.status === 401 && refreshToken.value) {
                console.log('[Auth] Token expired, attempting refresh...')
                const refreshed = await refreshAccessToken()
                if (refreshed) {
                    return await fetchUser()
                }
            }

            // If refresh failed, logout
            console.log('[Auth] Auth failed, logging out')
            await logout()
        } finally {
            isLoading.value = false
        }
    }

    const refreshAccessToken = async () => {
        if (!refreshToken.value) return false

        try {
            const response = await $fetch(`${API_URL}/refresh`, {
                method: 'POST',
                body: { refreshToken: refreshToken.value }
            })

            if (response.success && response.data) {
                accessToken.value = response.data.accessToken
                refreshToken.value = response.data.refreshToken

                saveTokens(response.data.accessToken, response.data.refreshToken)

                return true
            }

            return false
        } catch (error) {
            console.error('Token refresh error:', error)
            return false
        }
    }

    const updateProfile = async (data: { firstName?: string; lastName?: string; phone?: string }) => {
        if (!accessToken.value) throw new Error('Not authenticated')

        isLoading.value = true
        console.log('[Auth] Updating profile with data:', data)

        try {
            const response = await $fetch(`${API_URL}/profile`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken.value}`
                },
                body: data
            })

            console.log('[Auth] Profile update response:', response)

            if (response.success && response.data) {
                user.value = response.data.user
                console.log('[Auth] User state updated:', user.value)
                return { success: true, user: response.data.user }
            }

            throw new Error(response.message || 'Profile update failed')
        } catch (error: any) {
            console.error('[Auth] Update profile error:', error)
            throw new Error(error.data?.message || error.message || 'Profile update failed')
        } finally {
            isLoading.value = false
        }
    }

    const changePassword = async (currentPassword: string, newPassword: string) => {
        if (!accessToken.value) throw new Error('Not authenticated')

        isLoading.value = true

        try {
            const response = await $fetch(`${API_URL}/change-password`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken.value}`
                },
                body: { currentPassword, newPassword }
            })

            if (response.success) {
                return { success: true, message: response.message }
            }

            throw new Error(response.message || 'Password change failed')
        } catch (error: any) {
            console.error('Change password error:', error)
            throw new Error(error.data?.message || error.message || 'Password change failed')
        } finally {
            isLoading.value = false
        }
    }

    return {
        // State
        user,
        accessToken,
        refreshToken,
        isLoading,
        isInitialized,

        // Getters
        isAuthenticated,
        isAdmin,
        fullName,

        // Actions
        loadFromStorage,
        register,
        login,
        logout,
        fetchUser,
        refreshAccessToken,
        updateProfile,
        changePassword
    }
})
