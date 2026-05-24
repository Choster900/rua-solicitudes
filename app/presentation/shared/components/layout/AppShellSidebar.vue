<template>
  <aside :class="sidebarClass">
    <div :class="['mb-stack-lg flex items-center justify-center', isCollapsed ? 'px-3' : 'px-6']">
      <img
        alt="RUASA Logo"
        :class="['w-auto object-contain opacity-90 transition-all', isCollapsed ? 'h-9' : 'h-12']"
        :src="sidebarLogoSrc"
      >
    </div>

    <nav :class="['flex-1 space-y-2', isCollapsed ? 'px-2' : 'px-4']">
      <button
        v-for="item in navigationItems"
        :key="item.key"
        :class="[
          'w-full flex items-center rounded-xl transition-all',
          isCollapsed ? 'justify-center px-2 py-3' : 'gap-stack-md px-4 py-3',
          item.key === activeItemKey
            ? 'bg-primary-container text-on-primary-container font-bold'
            : 'text-outline-variant hover:bg-surface-container-low/10',
        ]"
        type="button"
        :title="item.label"
        @click="$emit('selectItem', item.key)"
      >
        <img
          v-if="item.imageSrc"
          :src="item.imageSrc"
          :alt="item.label"
          class="h-6 w-6 object-contain sidebar-icon-orange"
        >
        <span
          v-else
          class="material-symbols-outlined"
          :class="[
            item.key === activeItemKey ? 'fill-icon' : '',
            'sidebar-icon-orange',
          ]"
        >
          {{ item.icon }}
        </span>
        <span
          v-if="!isCollapsed"
          class="font-label-caps text-label-caps text-white"
        >
          {{ item.label }}
        </span>
      </button>
    </nav>

    <div :class="['mt-stack-md border-t border-outline/20 pt-stack-md', isCollapsed ? 'px-2' : 'px-4']">
      <button
        :class="[
          'w-full flex items-center rounded-xl transition-all text-outline-variant hover:bg-surface-container-low/10',
          isCollapsed ? 'justify-center px-2 py-3' : 'gap-stack-md px-4 py-3',
        ]"
        type="button"
        title="Cerrar sesión"
        @click="$emit('logout')"
      >
        <span class="material-symbols-outlined sidebar-icon-orange">
          logout
        </span>
        <span
          v-if="!isCollapsed"
          class="font-label-caps text-label-caps text-white"
        >
          Cerrar sesión
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeMode } from '~/presentation/shared/composables/useThemeMode'
import logoModoClaro from '~/assets/logos/rua_logo_modo_claro_transparente.png'
import logoModoOscuro from '~/assets/logos/rua_logo_modo_oscuro_transparente.png'

interface AppShellNavItem {
  key: string
  label: string
  icon?: string
  imageSrc?: string
}

interface AppShellSidebarProps {
  activeItemKey: string
  isMobileViewport: boolean
  isMobileSidebarOpen: boolean
  isCollapsed: boolean
}

defineOptions({
  name: 'AppShellSidebar',
})

const props = defineProps<AppShellSidebarProps>()
const { mode } = useThemeMode()

const sidebarLogoSrc = computed(() => (mode.value === 'light' ? logoModoClaro : logoModoOscuro))
const navigationItems: AppShellNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'solicitudes', label: 'Solicitudes', icon: 'assignment_add' },
  { key: 'bandeja-diseno', label: 'Bandeja Diseño', icon: 'design_services' },
  { key: 'bandeja-calidad', label: 'Bandeja Calidad', icon: 'rule' },
  { key: 'usuarios', label: 'Usuarios', icon: 'manage_accounts' },
  { key: 'clientes', label: 'Clientes', icon: 'badge' },
]

defineEmits<{
  selectItem: [itemKey: string]
  logout: []
}>()

const sidebarClass = computed(() => {
  const widthClass = props.isMobileViewport
    ? 'w-[280px]'
    : props.isCollapsed
      ? 'w-[88px]'
      : 'w-[280px]'

  const translateClass = props.isMobileViewport && !props.isMobileSidebarOpen ? '-translate-x-full' : 'translate-x-0'

  return [
    'fixed left-0 top-0 h-screen bg-deep-navy border-r border-outline flex flex-col py-stack-lg z-50 transition-all duration-300 ease-out',
    widthClass,
    translateClass,
  ]
})
</script>

<style scoped>
.fill-icon {
  font-variation-settings: 'FILL' 1;
}

.sidebar-icon-orange {
  color: #f59e0b;
  filter: brightness(0) saturate(100%) invert(66%) sepia(79%) saturate(1063%) hue-rotate(358deg) brightness(101%) contrast(96%);
}
</style>
