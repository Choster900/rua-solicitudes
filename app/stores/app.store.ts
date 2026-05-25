import { defineStore } from 'pinia'
import dayjs from 'dayjs'

interface AppState {
  initializedAt: string | null
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    initializedAt: null,
  }),
  actions: {
    bootstrap() {
      if (!this.initializedAt) {
        this.initializedAt = dayjs().toISOString()
      }
    },
  },
})
