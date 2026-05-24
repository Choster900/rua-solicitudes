<template>
  <aside :class="sidebarClass">
    <div :class="['mb-stack-lg flex items-center justify-center', isCollapsed ? 'px-3' : 'px-6']">
      <img
        alt="RUASA Logo"
        :class="['w-auto object-contain brightness-0 invert opacity-90 transition-all', isCollapsed ? 'h-9' : 'h-12']"
        src="https://lh3.googleusercontent.com/aida/ADBb0ujiXx9N50DdfTe9CfsLyYlpeSMdQBeJ4edwvqQHduYKretEy9UGjRUgBUvuM-ZF69AH2oixZbYNwCBqGrFl1ob-apaw0fpIBU_SE-RBpEk-mdcZjCdDp1zpWl7OBELMyvXbGBehb0pwHrE6PHbRsdBiyvdSqWrx37WjPVhLU4TPPorf2yfIO0HauZa76jOR0KmeXYi4JZUuLwDlfjup7DP5xw5zc5ATh1GAPiF5kb37UfcX_eNV_y9MdQ"
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
          class="h-6 w-6 object-contain filter grayscale brightness-90 opacity-90"
        >
        <span
          v-else
          class="material-symbols-outlined"
          :class="item.key === activeItemKey ? 'fill-icon' : ''"
        >
          {{ item.icon }}
        </span>
        <span
          v-if="!isCollapsed"
          class="font-label-caps text-label-caps"
        >
          {{ item.label }}
        </span>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted } from 'vue'
import { useThemeMode } from '~/presentation/shared/composables/useThemeMode'

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
const { mode, setMode, initializeMode } = useThemeMode()
const navigationItems: AppShellNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'vendedores', label: 'Vendedores', icon: 'group' },
  { key: 'clientes', label: 'Clientes', icon: 'badge' },
  { key: 'diseno', label: 'Diseño', icon: 'brush' },
  { key: 'calidad', label: 'Calidad', icon: 'verified' },
]

defineEmits<{
  selectItem: [itemKey: string]
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

onBeforeMount(() => {
  setMode('dark')
})

onMounted(() => {
  initializeMode()
  if (mode.value !== 'dark') {
    setMode('dark')
  }
})
</script>

<style scoped>
.fill-icon {
  font-variation-settings: 'FILL' 1;
}
</style>
