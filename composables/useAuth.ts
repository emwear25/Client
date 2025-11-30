import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
    const authStore = useAuthStore()
    const router = useRouter()
    const route = useRoute()

    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const user = computed(() => authStore.user)
    const isAdmin = computed(() => authStore.isAdmin)
    const fullName = computed(() => authStore.fullName)

    const login = async (email: string, password: string) => {
        return await authStore.login(email, password)
    }

    const register = async (email: string, password: string) => {
        return await authStore.register(email, password)
    }

    const logout = async () => {
        await authStore.logout()
        router.push('/login')
    }

    const requireAuth = () => {
        if (!authStore.isAuthenticated) {
            router.push({
                path: '/login',
                query: { redirect: route.fullPath }
            })
        }
    }

    const requireGuest = () => {
        if (authStore.isAuthenticated) {
            router.push('/')
        }
    }

    return {
        isAuthenticated,
        user,
        isAdmin,
        fullName,
        login,
        register,
        logout,
        requireAuth,
        requireGuest
    }
}
