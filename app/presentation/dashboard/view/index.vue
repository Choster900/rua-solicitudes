<template>
  <div :class="dashboardThemeClass">
    <aside class="fixed left-0 top-0 h-screen w-[280px] bg-deep-navy border-r border-outline flex flex-col py-stack-lg z-50">
      <div class="px-6 mb-stack-lg">
        <h1 class="text-headline-md font-headline-md font-extrabold text-inverse-primary leading-tight">
          RUASA ERP
        </h1>
        <p class="text-label-caps font-label-caps text-outline-variant opacity-70">
          Packaging &amp; Printing
        </p>
      </div>
      <nav class="flex-1 px-4 space-y-2">
        <a
          class="flex items-center gap-stack-md px-4 py-3 bg-primary-container text-on-primary-container rounded-xl font-bold transition-all scale-[0.99]"
          href="#"
        >
          <span class="material-symbols-outlined fill-icon">dashboard</span>
          <span class="font-label-caps text-label-caps">Dashboard</span>
        </a>
        <a
          class="flex items-center gap-stack-md px-4 py-3 text-outline-variant hover:bg-surface-container-low/10 transition-colors"
          href="#"
        >
          <span class="material-symbols-outlined">inventory_2</span>
          <span class="font-label-caps text-label-caps">Projects</span>
        </a>
        <a
          class="flex items-center gap-stack-md px-4 py-3 text-outline-variant hover:bg-surface-container-low/10 transition-colors"
          href="#"
        >
          <span class="material-symbols-outlined">description</span>
          <span class="font-label-caps text-label-caps">Solicitudes</span>
        </a>
        <a
          class="flex items-center gap-stack-md px-4 py-3 text-outline-variant hover:bg-surface-container-low/10 transition-colors"
          href="#"
        >
          <img
            :src="ventaIcon"
            alt="Ventas"
            class="h-6 w-6 object-contain filter grayscale brightness-90 opacity-90"
          >
          <span class="font-label-caps text-label-caps">Ventas</span>
        </a>
        <a
          class="flex items-center gap-stack-md px-4 py-3 text-outline-variant hover:bg-surface-container-low/10 transition-colors"
          href="#"
        >
          <span class="material-symbols-outlined">brush</span>
          <span class="font-label-caps text-label-caps">Diseño</span>
        </a>
        <a
          class="flex items-center gap-stack-md px-4 py-3 text-outline-variant hover:bg-surface-container-low/10 transition-colors"
          href="#"
        >
          <span class="material-symbols-outlined">verified</span>
          <span class="font-label-caps text-label-caps">Calidad</span>
        </a>
        <a
          class="flex items-center gap-stack-md px-4 py-3 text-outline-variant hover:bg-surface-container-low/10 transition-colors"
          href="#"
        >
          <span class="material-symbols-outlined">notifications</span>
          <span class="font-label-caps text-label-caps">Notifications</span>
        </a>
      </nav>
      <div class="px-4 mt-auto">
        <button class="w-full py-4 bg-secondary-container text-on-secondary-container font-label-caps text-label-caps rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <span class="material-symbols-outlined">add</span>
          Create request
        </button>
      </div>
    </aside>

    <header class="fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-deep-navy border-b border-outline z-40 flex items-center justify-between px-container-padding">
      <div class="flex items-center flex-1 max-w-xl">
        <div class="relative w-full">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">search</span>
          <input
            class="w-full bg-surface-container-low/5 border border-outline/30 rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary-container font-body-sm"
            placeholder="Search orders, clients, or batches..."
            type="text"
          >
        </div>
      </div>
      <div class="flex items-center gap-stack-md">
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
        <div class="h-8 w-[1px] bg-outline/20 mx-2" />
        <div class="flex items-center gap-3">
          <div class="text-right">
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

    <main class="dashboard-scroll ml-[280px] mt-16 p-container-padding h-[calc(100vh-64px)] overflow-y-auto bg-deep-navy">
      <div class="flex items-end justify-between mb-stack-lg">
        <div>
          <h2 class="text-display-lg font-display-lg text-white mb-2">
            Production Overview
          </h2>
          <p class="text-body-lg font-body-lg text-outline-variant">
            Real-time status of printing lines and logistics pipeline.
          </p>
        </div>
        <div class="flex gap-stack-sm bg-surface-container-low/5 p-1 rounded-lg border border-outline/20">
          <button class="px-4 py-2 bg-primary-container text-white rounded font-label-caps text-label-caps">
            Real-time
          </button>
          <button class="px-4 py-2 text-outline-variant hover:text-white rounded font-label-caps text-label-caps">
            History
          </button>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-gutter">
        <div class="col-span-12 md:col-span-3 bg-surface-container-low/5 border border-outline/20 rounded-xl p-stack-md relative overflow-hidden group">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary-container" />
          <p class="text-label-caps font-label-caps text-outline-variant mb-1">
            Active Batches
          </p>
          <h3 class="text-headline-lg font-headline-lg text-white">
            1,284
          </h3>
          <div class="flex items-center gap-1 mt-2 text-status-success">
            <span class="material-symbols-outlined text-[16px]">trending_up</span>
            <span class="text-body-sm font-bold">+12% vs last week</span>
          </div>
        </div>

        <div class="col-span-12 md:col-span-3 bg-surface-container-low/5 border border-outline/20 rounded-xl p-stack-md relative overflow-hidden group">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container" />
          <p class="text-label-caps font-label-caps text-outline-variant mb-1">
            Efficiency OEE
          </p>
          <h3 class="text-headline-lg font-headline-lg text-white">
            94.2%
          </h3>
          <div class="flex items-center gap-1 mt-2 text-status-warning">
            <span class="material-symbols-outlined text-[16px]">pause_circle</span>
            <span class="text-body-sm font-bold">-0.4% (Line 4 Maintenance)</span>
          </div>
        </div>

        <div class="col-span-12 md:col-span-3 bg-surface-container-low/5 border border-outline/20 rounded-xl p-stack-md relative overflow-hidden group">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-status-success" />
          <p class="text-label-caps font-label-caps text-outline-variant mb-1">
            Quality Pass Rate
          </p>
          <h3 class="text-headline-lg font-headline-lg text-white">
            99.8%
          </h3>
          <div class="flex items-center gap-1 mt-2 text-status-success">
            <span class="material-symbols-outlined text-[16px]">verified</span>
            <span class="text-body-sm font-bold">Standard Achieved</span>
          </div>
        </div>

        <div class="col-span-12 md:col-span-3 bg-surface-container-low/5 border border-outline/20 rounded-xl p-stack-md relative overflow-hidden group">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-status-error" />
          <p class="text-label-caps font-label-caps text-outline-variant mb-1">
            Pending Deliveries
          </p>
          <h3 class="text-headline-lg font-headline-lg text-white">
            42
          </h3>
          <div class="flex items-center gap-1 mt-2 text-status-error">
            <span class="material-symbols-outlined text-[16px]">schedule</span>
            <span class="text-body-sm font-bold">5 High Priority</span>
          </div>
        </div>

        <div class="col-span-12 md:col-span-8 bg-surface-container-low/5 border border-outline/20 rounded-xl p-stack-lg min-h-[400px] flex flex-col">
          <div class="flex items-center justify-between mb-stack-lg">
            <h4 class="text-headline-md font-headline-md text-white">
              Production Volume Trends
            </h4>
            <div class="flex gap-4">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-primary-container" />
                <span class="text-label-caps font-label-caps text-outline-variant">Offset</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-secondary-container" />
                <span class="text-label-caps font-label-caps text-outline-variant">Digital</span>
              </div>
            </div>
          </div>

          <div class="flex-1 w-full relative">
            <div class="absolute inset-0 flex items-end justify-between gap-2 pt-10">
              <div class="flex-1 flex flex-col justify-end gap-1 group h-full">
                <div class="w-full bg-primary-container/20 hover:bg-primary-container transition-all h-[40%] rounded-t-sm cursor-pointer" />
                <div class="w-full bg-secondary-container/20 hover:bg-secondary-container transition-all h-[20%] rounded-b-sm cursor-pointer" />
                <p class="text-[10px] text-center text-outline-variant mt-2 font-data-mono">
                  MON
                </p>
              </div>
              <div class="flex-1 flex flex-col justify-end gap-1 group h-full">
                <div class="w-full bg-primary-container/20 hover:bg-primary-container transition-all h-[55%] rounded-t-sm cursor-pointer" />
                <div class="w-full bg-secondary-container/20 hover:bg-secondary-container transition-all h-[30%] rounded-b-sm cursor-pointer" />
                <p class="text-[10px] text-center text-outline-variant mt-2 font-data-mono">
                  TUE
                </p>
              </div>
              <div class="flex-1 flex flex-col justify-end gap-1 group h-full">
                <div class="w-full bg-primary-container/20 hover:bg-primary-container transition-all h-[70%] rounded-t-sm cursor-pointer" />
                <div class="w-full bg-secondary-container/20 hover:bg-secondary-container transition-all h-[45%] rounded-b-sm cursor-pointer" />
                <p class="text-[10px] text-center text-outline-variant mt-2 font-data-mono">
                  WED
                </p>
              </div>
              <div class="flex-1 flex flex-col justify-end gap-1 group h-full">
                <div class="w-full bg-primary-container/20 hover:bg-primary-container transition-all h-[45%] rounded-t-sm cursor-pointer" />
                <div class="w-full bg-secondary-container/20 hover:bg-secondary-container transition-all h-[25%] rounded-b-sm cursor-pointer" />
                <p class="text-[10px] text-center text-outline-variant mt-2 font-data-mono">
                  THU
                </p>
              </div>
              <div class="flex-1 flex flex-col justify-end gap-1 group h-full">
                <div class="w-full bg-primary-container/60 hover:bg-primary-container transition-all h-[85%] rounded-t-sm cursor-pointer" />
                <div class="w-full bg-secondary-container/60 hover:bg-secondary-container transition-all h-[60%] rounded-b-sm cursor-pointer" />
                <p class="text-[10px] text-center text-outline-variant mt-2 font-data-mono">
                  FRI
                </p>
              </div>
              <div class="flex-1 flex flex-col justify-end gap-1 group h-full">
                <div class="w-full bg-primary-container/20 hover:bg-primary-container transition-all h-[30%] rounded-t-sm cursor-pointer" />
                <div class="w-full bg-secondary-container/20 hover:bg-secondary-container transition-all h-[15%] rounded-b-sm cursor-pointer" />
                <p class="text-[10px] text-center text-outline-variant mt-2 font-data-mono">
                  SAT
                </p>
              </div>
              <div class="flex-1 flex flex-col justify-end gap-1 group h-full">
                <div class="w-full bg-primary-container/10 h-[5%] rounded-t-sm" />
                <div class="w-full bg-secondary-container/10 h-[2%] rounded-b-sm" />
                <p class="text-[10px] text-center text-outline-variant mt-2 font-data-mono">
                  SUN
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-12 md:col-span-4 bg-surface-container-low/5 border border-outline/20 rounded-xl p-stack-lg flex flex-col">
          <h4 class="text-headline-md font-headline-md text-white mb-stack-md">
            Logistics Map
          </h4>
          <div class="flex-1 rounded-lg overflow-hidden relative border border-outline/10">
            <img
              class="w-full h-full object-cover grayscale opacity-60"
              data-alt="A dark mode stylized geographic map interface displaying a logistics network with glowing route lines and circular hubs. The color scheme is predominantly deep navy and charcoal, with vibrant neon cyan and royal blue accents highlighting current shipping routes across a urban landscape. Minimalist UI elements like tooltips and zoom controls are visible, following a high-end corporate ERP design language."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOHe_AP0wi03hscz73V6xvX-_SwQXdQl5D0mnKMgzsqcLaVOtrgmuO8t5btqRanB5h5QqltYqsdW6lWJts8jqeMaYmwA2r0B23wg8wVwU56cIqAlSGASB966txMLZ85LOy-VKUwDyGH2Q9Cp7NSoXxHZTo3njVl2YifDF72D2bPWJip4lrwgruQ0vYVb7-9PG8_gbSM7VRHMajjWiYq3wJF4pzZ1Nn6u6yaA5zbk-qgh9cMrS-9oHxXmxjt3i0hc0LLWoHbpn5EoI"
              alt="Logistics network map"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-deep-navy via-transparent to-transparent" />
            <div class="absolute bottom-4 left-4 right-4 bg-deep-navy/80 backdrop-blur-md p-3 border border-outline/30 rounded-lg">
              <div class="flex items-center justify-between">
                <p class="text-label-caps font-label-caps text-white">
                  Active Transports
                </p>
                <span class="text-primary-fixed-dim font-bold">12</span>
              </div>
              <div class="w-full bg-outline/20 h-1 rounded-full mt-2">
                <div class="bg-primary-container h-full w-[65%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-12 bg-surface-container-low/5 border border-outline/20 rounded-xl overflow-hidden">
          <div class="p-stack-lg border-b border-outline/20 flex items-center justify-between">
            <h4 class="text-headline-md font-headline-md text-white">
              Recent Orders
            </h4>
            <button class="text-primary-fixed-dim font-label-caps text-label-caps hover:underline">
              View all orders
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left font-body-sm">
              <thead class="bg-surface-container-low/10 text-outline-variant font-label-caps text-label-caps uppercase">
                <tr>
                  <th class="px-stack-lg py-4 border-b border-outline/10">
                    Batch ID
                  </th>
                  <th class="px-stack-lg py-4 border-b border-outline/10">
                    Client
                  </th>
                  <th class="px-stack-lg py-4 border-b border-outline/10">
                    Material
                  </th>
                  <th class="px-stack-lg py-4 border-b border-outline/10">
                    Status
                  </th>
                  <th class="px-stack-lg py-4 border-b border-outline/10 text-right">
                    Deadline
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline/10">
                <tr class="hover:bg-surface-container-low/5 transition-colors cursor-pointer group">
                  <td class="px-stack-lg py-4 font-data-mono text-white">
                    #RU-8829-X
                  </td>
                  <td class="px-stack-lg py-4 text-white">
                    Global Beverages Co.
                  </td>
                  <td class="px-stack-lg py-4 text-outline-variant">
                    Corrugated 250gsm
                  </td>
                  <td class="px-stack-lg py-4">
                    <span class="px-3 py-1 bg-status-success/20 text-status-success rounded-full text-[10px] font-bold uppercase tracking-wider border border-status-success/30">Produced</span>
                  </td>
                  <td class="px-stack-lg py-4 text-right text-outline-variant">
                    Oct 24, 2023
                  </td>
                </tr>
                <tr class="hover:bg-surface-container-low/5 transition-colors cursor-pointer group">
                  <td class="px-stack-lg py-4 font-data-mono text-white">
                    #RU-9011-Z
                  </td>
                  <td class="px-stack-lg py-4 text-white">
                    Luxe Cosmetics SA
                  </td>
                  <td class="px-stack-lg py-4 text-outline-variant">
                    Artic White Gloss
                  </td>
                  <td class="px-stack-lg py-4">
                    <span class="px-3 py-1 bg-status-warning/20 text-status-warning rounded-full text-[10px] font-bold uppercase tracking-wider border border-status-warning/30">In Progress</span>
                  </td>
                  <td class="px-stack-lg py-4 text-right text-outline-variant">
                    Oct 26, 2023
                  </td>
                </tr>
                <tr class="hover:bg-surface-container-low/5 transition-colors cursor-pointer group">
                  <td class="px-stack-lg py-4 font-data-mono text-white">
                    #RU-9102-A
                  </td>
                  <td class="px-stack-lg py-4 text-white">
                    Natura Organic Foods
                  </td>
                  <td class="px-stack-lg py-4 text-outline-variant">
                    Recycled Kraft
                  </td>
                  <td class="px-stack-lg py-4">
                    <span class="px-3 py-1 bg-primary-container/20 text-primary-fixed-dim rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary-container/30">Queued</span>
                  </td>
                  <td class="px-stack-lg py-4 text-right text-outline-variant">
                    Oct 29, 2023
                  </td>
                </tr>
                <tr class="hover:bg-surface-container-low/5 transition-colors cursor-pointer group">
                  <td class="px-stack-lg py-4 font-data-mono text-white">
                    #RU-8750-M
                  </td>
                  <td class="px-stack-lg py-4 text-white">
                    TechParts Global
                  </td>
                  <td class="px-stack-lg py-4 text-outline-variant">
                    High-Density Fiber
                  </td>
                  <td class="px-stack-lg py-4">
                    <span class="px-3 py-1 bg-status-error/20 text-status-error rounded-full text-[10px] font-bold uppercase tracking-wider border border-status-error/30">Delayed</span>
                  </td>
                  <td class="px-stack-lg py-4 text-right text-status-error font-bold italic">
                    Oct 21, 2023
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <button class="fixed bottom-10 right-10 w-16 h-16 bg-primary-container text-white rounded-full shadow-[0_8px_30px_rgb(0,86,150,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
      <span class="material-symbols-outlined text-[32px] group-hover:rotate-90 transition-transform duration-300">add</span>
      <div class="absolute right-20 bg-deep-navy border border-outline/30 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        <span class="text-label-caps font-label-caps text-white">Quick Action</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import ventaIcon from '~/assets/svg/venta.svg'
import { useThemeMode } from '~/presentation/shared/composables/useThemeMode'

defineOptions({
  name: 'DashboardPage',
})

const { mode, toggleMode, initializeMode } = useThemeMode()
const isDarkMode = computed(() => mode.value === 'dark')
const dashboardThemeClass = computed(() => (isDarkMode.value ? 'dashboard-theme-dark' : 'dashboard-theme-light'))

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

const mouseMoveHandler = (event: MouseEvent) => {
  const amount = 10
  const x = (window.innerWidth - event.pageX * amount) / 100
  const y = (window.innerHeight - event.pageY * amount) / 100
  void x
  void y
}

onMounted(() => {
  initializeMode()

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
    }

    navClickHandlers.set(link, clickHandler)
    link.addEventListener('click', clickHandler)
  })

  document.addEventListener('mousemove', mouseMoveHandler)
})

onUnmounted(() => {
  navClickHandlers.forEach((handler, link) => {
    link.removeEventListener('click', handler)
  })

  navClickHandlers.clear()
  document.removeEventListener('mousemove', mouseMoveHandler)
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

.dashboard-theme-light .bg-surface-container-low\/5 {
  background-color: rgba(229, 238, 255, 0.72) !important;
}

.dashboard-theme-light .bg-surface-container-low\/10 {
  background-color: rgba(211, 228, 254, 0.6) !important;
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
