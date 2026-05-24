<template>
  <header
    :style="{ left: `${leftOffset}px` }"
    class="fixed top-0 right-0 z-40 h-16 border-b border-outline bg-deep-navy px-4 sm:px-6 flex items-center justify-between transition-all duration-300"
  >
    <div class="flex items-center gap-3">
      <button
        class="inline-flex h-10 w-10 items-center justify-center rounded-full p-0 text-outline-variant transition-colors hover:bg-surface-container-low/10"
        type="button"
        :title="sidebarToggleTitle"
        @click="$emit('toggleSidebar')"
      >
        <span class="material-symbols-outlined block leading-none">{{ sidebarToggleIcon }}</span>
      </button>
      <p class="hidden sm:block text-body-sm font-bold text-white">
        {{ screenTitle }}
      </p>
    </div>

    <div class="flex items-center gap-2 sm:gap-stack-md">
      <button
        class="p-2 text-outline-variant hover:bg-surface-container-low/10 rounded-full transition-colors"
        type="button"
        :title="isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
        @click="toggleMode"
      >
        <span class="material-symbols-outlined">{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</span>
      </button>
      <button
        class="p-2 text-outline-variant hover:bg-surface-container-low/10 rounded-full transition-colors"
        type="button"
        @click="handleHelp"
      >
        <span class="material-symbols-outlined">help_outline</span>
      </button>
      <div class="hidden sm:block h-8 w-[1px] bg-outline/20 mx-1 sm:mx-2" />
      <div class="flex items-center gap-3">
        <div class="hidden sm:block text-right">
          <p class="text-body-sm font-bold text-white leading-none">
            Ing. Carlos Ruíz
          </p>
          <p class="text-[10px] font-label-caps text-outline-variant uppercase">
            Plant Manager
          </p>
        </div>
        <div class="h-10 w-10 overflow-hidden rounded-full border-2 border-primary-container">
          <img
            alt="User profile photo"
            class="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5mhVG70nTB5Yl9P4QqiCFOV_a70FT55OkcvIn3STXXe54KAozd_H0eeWll2ZQ9_ZgmzujPvr_Z2AwSVIdMqtRJWiDfYzhVBoLfjq7vtdeUw21VwxkQYEHOUr0UckFIh4SaYwQlZ6HChEWvIkVsOnzcLO4tn46MI3jMPh0pxpkao6WjAiz1HmA0xZrYEt6e1zuuKQTUhBxgjOR0g7aLRIBLUudWFHjRVEIY5Twv5jm3otldN5E08SaikynSHgWmbw8Cupd0liGBuM"
          >
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'
import { useThemeMode } from '~/presentation/shared/composables/useThemeMode'

interface AppShellHeaderProps {
  leftOffset: number
  sidebarToggleIcon: string
  sidebarToggleTitle: string
  screenTitle: string
}

defineOptions({
  name: 'AppShellHeader',
})

defineProps<AppShellHeaderProps>()
const toast = useAppToast()
const { mode, toggleMode } = useThemeMode()
const isDarkMode = computed(() => mode.value === 'dark')
const handleHelp = () => {
  toast.info('Centro de ayuda en construcción.')
}

defineEmits<{
  toggleSidebar: []
}>()
</script>
