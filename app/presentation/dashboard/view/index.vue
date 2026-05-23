<template>
  <div :class="dashboardThemeClass">
    <div
      v-if="isMobileViewport && isMobileSidebarOpen"
      class="fixed inset-0 z-40 bg-black/45 backdrop-blur-[1px]"
      @click="closeMobileSidebar"
    />

    <aside
      :class="[
        'fixed left-0 top-0 h-screen bg-deep-navy border-r border-outline flex flex-col py-stack-lg z-50 transition-all duration-300 ease-out',
        isMobileViewport ? 'w-[280px]' : isDesktopSidebarCollapsed ? 'w-[88px]' : 'w-[280px]',
        isMobileViewport && !isMobileSidebarOpen ? '-translate-x-full' : 'translate-x-0',
      ]"
    >
      <div :class="['mb-stack-lg flex items-center', isDesktopSidebarCollapsed ? 'justify-center px-3' : 'px-6']">
        <img
          alt="RUASA Logo"
          :class="['w-auto object-contain brightness-0 invert opacity-90 transition-all', isDesktopSidebarCollapsed ? 'h-9' : 'h-12']"
          src="https://lh3.googleusercontent.com/aida/ADBb0ujiXx9N50DdfTe9CfsLyYlpeSMdQBeJ4edwvqQHduYKretEy9UGjRUgBUvuM-ZF69AH2oixZbYNwCBqGrFl1ob-apaw0fpIBU_SE-RBpEk-mdcZjCdDp1zpWl7OBELMyvXbGBehb0pwHrE6PHbRsdBiyvdSqWrx37WjPVhLU4TPPorf2yfIO0HauZa76jOR0KmeXYi4JZUuLwDlfjup7DP5xw5zc5ATh1GAPiF5kb37UfcX_eNV_y9MdQ"
        >
      </div>
      <nav :class="['flex-1 space-y-2', isDesktopSidebarCollapsed ? 'px-2' : 'px-4']">
        <a
          :class="[
            'flex items-center rounded-xl bg-primary-container text-on-primary-container font-bold transition-all scale-[0.99]',
            isDesktopSidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-stack-md px-4 py-3',
          ]"
          href="#"
        >
          <span class="material-symbols-outlined fill-icon">dashboard</span>
          <span
            v-if="!isDesktopSidebarCollapsed"
            class="font-label-caps text-label-caps"
          >
            Dashboard
          </span>
        </a>
        <a
          :class="[
            'flex items-center text-outline-variant hover:bg-surface-container-low/10 transition-colors rounded-xl',
            isDesktopSidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-stack-md px-4 py-3',
          ]"
          href="#"
        >
          <span class="material-symbols-outlined">inventory_2</span>
          <span
            v-if="!isDesktopSidebarCollapsed"
            class="font-label-caps text-label-caps"
          >
            Projects
          </span>
        </a>
        <a
          :class="[
            'flex items-center text-outline-variant hover:bg-surface-container-low/10 transition-colors rounded-xl',
            isDesktopSidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-stack-md px-4 py-3',
          ]"
          href="#"
        >
          <span class="material-symbols-outlined">description</span>
          <span
            v-if="!isDesktopSidebarCollapsed"
            class="font-label-caps text-label-caps"
          >
            Solicitudes
          </span>
        </a>
        <a
          :class="[
            'flex items-center text-outline-variant hover:bg-surface-container-low/10 transition-colors rounded-xl',
            isDesktopSidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-stack-md px-4 py-3',
          ]"
          href="#"
        >
          <img
            :src="ventaIcon"
            alt="Ventas"
            class="h-6 w-6 object-contain filter grayscale brightness-90 opacity-90"
          >
          <span
            v-if="!isDesktopSidebarCollapsed"
            class="font-label-caps text-label-caps"
          >
            Ventas
          </span>
        </a>
        <a
          :class="[
            'flex items-center text-outline-variant hover:bg-surface-container-low/10 transition-colors rounded-xl',
            isDesktopSidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-stack-md px-4 py-3',
          ]"
          href="#"
        >
          <span class="material-symbols-outlined">brush</span>
          <span
            v-if="!isDesktopSidebarCollapsed"
            class="font-label-caps text-label-caps"
          >
            Diseño
          </span>
        </a>
        <a
          :class="[
            'flex items-center text-outline-variant hover:bg-surface-container-low/10 transition-colors rounded-xl',
            isDesktopSidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-stack-md px-4 py-3',
          ]"
          href="#"
        >
          <span class="material-symbols-outlined">verified</span>
          <span
            v-if="!isDesktopSidebarCollapsed"
            class="font-label-caps text-label-caps"
          >
            Calidad
          </span>
        </a>
        <a
          :class="[
            'flex items-center text-outline-variant hover:bg-surface-container-low/10 transition-colors rounded-xl',
            isDesktopSidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-stack-md px-4 py-3',
          ]"
          href="#"
        >
          <span class="material-symbols-outlined">notifications</span>
          <span
            v-if="!isDesktopSidebarCollapsed"
            class="font-label-caps text-label-caps"
          >
            Notifications
          </span>
        </a>
      </nav>
    </aside>

    <header
      :style="{ left: `${contentLeftOffset}px` }"
      class="fixed top-0 right-0 h-16 bg-deep-navy border-b border-outline z-40 flex items-center justify-between px-4 sm:px-6 transition-all duration-300"
    >
      <div class="flex items-center gap-3">
        <button
          class="p-2 text-outline-variant hover:bg-surface-container-low/10 rounded-full transition-colors"
          type="button"
          :title="sidebarToggleTitle"
          @click="toggleSidebar"
        >
          <span class="material-symbols-outlined">{{ sidebarToggleIcon }}</span>
        </button>
        <p class="hidden sm:block text-body-sm font-bold text-white">
          Dashboard
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
        <button class="p-2 text-outline-variant hover:bg-surface-container-low/10 rounded-full transition-colors">
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
          <div class="w-10 h-10 rounded-full border-2 border-primary-container overflow-hidden">
            <img
              alt="User profile photo"
              class="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5mhVG70nTB5Yl9P4QqiCFOV_a70FT55OkcvIn3STXXe54KAozd_H0eeWll2ZQ9_ZgmzujPvr_Z2AwSVIdMqtRJWiDfYzhVBoLfjq7vtdeUw21VwxkQYEHOUr0UckFIh4SaYwQlZ6HChEWvIkVsOnzcLO4tn46MI3jMPh0pxpkao6WjAiz1HmA0xZrYEt6e1zuuKQTUhBxgjOR0g7aLRIBLUudWFHjRVEIY5Twv5jm3otldN5E08SaikynSHgWmbw8Cupd0liGBuM"
            >
          </div>
        </div>
      </div>
    </header>

    <main
      :style="{ marginLeft: `${contentLeftOffset}px` }"
      class="dashboard-scroll mt-16 h-[calc(100vh-64px)] overflow-y-auto bg-deep-navy transition-all duration-300"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ventaIcon from '~/assets/svg/venta.svg'
import { useThemeMode } from '~/presentation/shared/composables/useThemeMode'

defineOptions({
  name: 'DashboardPage',
})

const { mode, toggleMode, initializeMode } = useThemeMode()
const isDarkMode = computed(() => mode.value === 'dark')
const dashboardThemeClass = computed(() => (isDarkMode.value ? 'dashboard-theme-dark' : 'dashboard-theme-light'))
const isMobileViewport = ref(false)
const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)
const sidebarExpandedWidth = 280
const sidebarCollapsedWidth = 88
const desktopBreakpoint = 1024

const isDesktopSidebarCollapsed = computed(() => !isMobileViewport.value && isSidebarCollapsed.value)
const contentLeftOffset = computed(() => {
  if (isMobileViewport.value) {
    return 0
  }

  return isSidebarCollapsed.value ? sidebarCollapsedWidth : sidebarExpandedWidth
})
const sidebarToggleIcon = computed(() => {
  if (isMobileViewport.value) {
    return isMobileSidebarOpen.value ? 'close' : 'menu'
  }

  return isSidebarCollapsed.value ? 'chevron_right' : 'chevron_left'
})
const sidebarToggleTitle = computed(() => {
  if (isMobileViewport.value) {
    return isMobileSidebarOpen.value ? 'Cerrar menú' : 'Abrir menú'
  }

  return isSidebarCollapsed.value ? 'Expandir sidebar' : 'Colapsar sidebar'
})

useHead(() => ({
  title: 'RUASA ERP - Dashboard Industrial',
  htmlAttrs: {
    lang: 'es',
  },
  bodyAttrs: {
    class: `font-body-md overflow-hidden ${isDarkMode.value ? 'bg-deep-navy text-on-surface-variant' : 'bg-background text-on-background'}`,
  },
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Metropolis:wght@400;500&family=JetBrains+Mono:wght@500&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
    },
  ],
}))

const navClickHandlers = new Map<HTMLAnchorElement, (event: Event) => void>()
let resizeHandler: (() => void) | null = null

const syncViewportState = () => {
  isMobileViewport.value = window.innerWidth < desktopBreakpoint

  if (!isMobileViewport.value) {
    isMobileSidebarOpen.value = false
  }
}

const toggleSidebar = () => {
  if (isMobileViewport.value) {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
    return
  }

  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

onMounted(() => {
  initializeMode()
  syncViewportState()

  const navLinks = Array.from(document.querySelectorAll('aside nav a')) as HTMLAnchorElement[]

  navLinks.forEach((link) => {
    const clickHandler = (event: Event) => {
      event.preventDefault()

      navLinks.forEach((currentLink) => {
        currentLink.classList.remove('bg-primary-container', 'text-on-primary-container', 'font-bold')
        currentLink.classList.add('text-outline-variant')
        currentLink.querySelector('.material-symbols-outlined')?.classList.remove('fill-icon')
      })

      link.classList.add('bg-primary-container', 'text-on-primary-container', 'font-bold')
      link.classList.remove('text-outline-variant')
      link.querySelector('.material-symbols-outlined')?.classList.add('fill-icon')

      if (isMobileViewport.value) {
        closeMobileSidebar()
      }
    }

    navClickHandlers.set(link, clickHandler)
    link.addEventListener('click', clickHandler)
  })

  resizeHandler = () => {
    syncViewportState()
  }

  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  navClickHandlers.forEach((handler, link) => {
    link.removeEventListener('click', handler)
  })

  navClickHandlers.clear()

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
})
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.fill-icon {
  font-variation-settings: 'FILL' 1;
}

.bg-deep-navy {
  background-color: #0F172A !important;
}

.dashboard-theme-dark {
  color-scheme: dark;
}

.dashboard-theme-light {
  color-scheme: light;
}

.dashboard-theme-light aside,
.dashboard-theme-light header,
.dashboard-theme-light main,
.dashboard-theme-light .bg-deep-navy {
  background-color: #f8f9ff !important;
}

.dashboard-theme-light .text-white {
  color: #0b1c30 !important;
}

.dashboard-theme-light .text-outline-variant {
  color: #5f6670 !important;
}

.dashboard-theme-light .text-primary-fixed-dim {
  color: #005696 !important;
}

.dashboard-theme-light .hover\:bg-surface-container-low\/10:hover {
  background-color: rgba(211, 228, 254, 0.78) !important;
}

.dashboard-theme-light .hover\:text-white:hover {
  color: #0b1c30 !important;
}

.dashboard-theme-light .border-outline {
  border-color: rgba(114, 119, 129, 0.45) !important;
}

.dashboard-theme-light .border-outline\/10 {
  border-color: rgba(114, 119, 129, 0.16) !important;
}

.dashboard-theme-light .border-outline\/20 {
  border-color: rgba(114, 119, 129, 0.24) !important;
}

.dashboard-theme-light .border-outline\/30 {
  border-color: rgba(114, 119, 129, 0.3) !important;
}

.dashboard-theme-light input {
  color: #0b1c30 !important;
}

.dashboard-theme-light input::placeholder {
  color: #5f6670 !important;
}

.dashboard-theme-light .dashboard-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.dashboard-theme-light .dashboard-scroll::-webkit-scrollbar-thumb {
  background: #94a3b8;
}

.font-body-sm,
.font-body-md,
.font-body-lg {
  font-family: 'Metropolis', sans-serif;
}

.font-headline-lg,
.font-headline-md,
.font-display-lg,
.font-label-caps {
  font-family: 'Montserrat', sans-serif;
}

.font-data-mono {
  font-family: 'JetBrains Mono', monospace;
}

.dashboard-scroll::-webkit-scrollbar {
  width: 6px;
}

.dashboard-scroll::-webkit-scrollbar-track {
  background: #0F172A;
}

.dashboard-scroll::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
</style>
