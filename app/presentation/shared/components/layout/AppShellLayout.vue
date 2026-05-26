<template>
    <div class="app-shell-root">
        <div
            v-if="isMobileViewport && isMobileSidebarOpen"
            class="fixed inset-0 z-40 bg-black/45 backdrop-blur-[1px]"
            @click="closeMobileSidebar"
        />

        <AppShellSidebar
            :active-item-key="activeNavigationItem"
            :is-mobile-viewport="isMobileViewport"
            :is-mobile-sidebar-open="isMobileSidebarOpen"
            :is-collapsed="isDesktopSidebarCollapsed"
            @select-item="handleNavigationItemSelect"
            @logout="handleLogout"
        />

        <AppShellHeader
            :left-offset="contentLeftOffset"
            :sidebar-toggle-icon="sidebarToggleIcon"
            :sidebar-toggle-title="sidebarToggleTitle"
            :screen-title="screenTitle"
            @toggle-sidebar="toggleSidebar"
        />

        <AppShellWorkspace :left-offset="contentLeftOffset">
            <slot />
        </AppShellWorkspace>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppShellHeader from '~/presentation/shared/components/layout/AppShellHeader.vue'
import AppShellSidebar from '~/presentation/shared/components/layout/AppShellSidebar.vue'
import AppShellWorkspace from '~/presentation/shared/components/layout/AppShellWorkspace.vue'

defineOptions({
    name: 'AppShellLayout',
})

interface AppShellLayoutProps {
    screenTitle: string
}

defineProps<AppShellLayoutProps>()

const desktopBreakpoint = 1024
const sidebarExpandedWidth = 280
const sidebarCollapsedWidth = 88

const router = useRouter()
const route = useRoute()
const isMobileViewport = ref(false)
const isSidebarCollapsed = useState<boolean>('app-shell-sidebar-collapsed', () => false)
const isMobileSidebarOpen = ref(false)
const navigationRouteByItemKey: Record<string, string> = {
    dashboard: '/dashboard',
    solicitudes: '/solicitudes',
    'bandeja-diseno': '/requests/design',
    'bandeja-calidad': '/requests/quality',
    usuarios: '/usuarios',
    vendedores: '/vendedores',
    clientes: '/clientes',
}
const activeNavigationItem = computed(() => {
    const routePath = route.path

    if (routePath.startsWith('/requests/design') || routePath.startsWith('/requests/workflow')) {
        return 'bandeja-diseno'
    }

    if (routePath.startsWith('/requests/quality')) {
        return 'bandeja-calidad'
    }

    if (routePath.startsWith('/disenadores')) {
        return 'bandeja-diseno'
    }

    if (routePath.startsWith('/calidad')) {
        return 'bandeja-calidad'
    }

    if (routePath.startsWith('/solicitudes')) {
        return 'solicitudes'
    }

    if (routePath.startsWith('/usuarios')) {
        return 'usuarios'
    }

    if (routePath.startsWith('/vendedores')) {
        return 'vendedores'
    }

    if (routePath.startsWith('/clientes')) {
        return 'clientes'
    }

    if (routePath.startsWith('/dashboard')) {
        return 'dashboard'
    }

    return 'dashboard'
})

const isDesktopSidebarCollapsed = computed(
    () => !isMobileViewport.value && isSidebarCollapsed.value,
)
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

const handleNavigationItemSelect = (itemKey: string) => {
    const targetPath = navigationRouteByItemKey[itemKey]

    if (targetPath && route.path !== targetPath) {
        void router.push(targetPath)
    }

    if (isMobileViewport.value) {
        closeMobileSidebar()
    }
}

const handleLogout = () => {
    const accessToken = useCookie<string | null>('access_token')
    accessToken.value = null

    // Limpia las caches del usuario anterior para que el siguiente login
    // re-hidrate los datos con su nuevo rol.
    useState<unknown[]>('requests-module-list', () => []).value = []
    useState<boolean>('requests-module-hydrated', () => false).value = false
    useState<unknown | null>('session-user', () => null).value = null
    useState<unknown[]>('clients-module-list', () => []).value = []
    useState<boolean>('clients-module-hydrated', () => false).value = false

    closeMobileSidebar()
    void router.push('/login')
}

onMounted(() => {
    syncViewportState()

    resizeHandler = () => {
        syncViewportState()
    }

    window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler)
    }
})
</script>
