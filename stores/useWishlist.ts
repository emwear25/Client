import { defineStore } from 'pinia'

export const useWishlist = defineStore('wishlist', {
  state: () => ({
    ids: [] as string[],
  }),

  getters: {
    count: (state) => state.ids.length,
    has: (state) => (id: string) => state.ids.includes(id),
  },

  actions: {
    async toggle(id: string) {
      const index = this.ids.indexOf(id)
      if (index > -1) {
        this.ids.splice(index, 1)
        this.persist()

        // Show toast notification
        if (process.client) {
          const { useToast } = await import('~/composables/useToast')
          const toast = useToast()
          toast.info('Премахнато от любими')
        }
      } else {
        this.ids.push(id)
        this.persist()

        // Show toast notification
        if (process.client) {
          const { useToast } = await import('~/composables/useToast')
          const toast = useToast()
          toast.success('Добавено в любими')
        }
      }
    },

    async add(id: string) {
      if (!this.ids.includes(id)) {
        this.ids.push(id)
        this.persist()

        // Show toast notification
        if (process.client) {
          const { useToast } = await import('~/composables/useToast')
          const toast = useToast()
          toast.success('Добавено в любими')
        }
      }
    },

    async remove(id: string) {
      const index = this.ids.indexOf(id)
      if (index > -1) {
        this.ids.splice(index, 1)
        this.persist()

        // Show toast notification
        if (process.client) {
          const { useToast } = await import('~/composables/useToast')
          const toast = useToast()
          toast.info('Премахнато от любими')
        }
      }
    },

    clear() {
      this.ids = []
      this.persist()
    },

    load() {
      if (process.client) {
        const raw = localStorage.getItem('emw_wishlist')
        if (raw) {
          try {
            this.ids = JSON.parse(raw)
          } catch (e) {
            console.error('Failed to load wishlist:', e)
            this.ids = []
          }
        }
      }
    },

    persist() {
      if (process.client) {
        localStorage.setItem('emw_wishlist', JSON.stringify(this.ids))
      }
    },
  },
})

