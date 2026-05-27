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
                <span class="material-symbols-outlined block leading-none">{{
                    sidebarToggleIcon
                }}</span>
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
                <span class="material-symbols-outlined">{{
                    isDarkMode ? 'light_mode' : 'dark_mode'
                }}</span>
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
                        {{ displayName }}
                    </p>
                    <p class="text-[10px] font-label-caps text-outline-variant uppercase">
                        {{ displayRole }}
                    </p>
                </div>
                <div
                    class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-container bg-primary/20 text-sm font-bold text-primary-fixed-dim select-none"
                >
                    {{ displayInitials }}
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'
import { useThemeMode } from '~/presentation/shared/composables/useThemeMode'
import { getAuthTokenProfile } from '~/presentation/auth/utils/auth-token.util'
import { USER_TYPE_BY_ROLE_CODE } from '~/presentation/interfaces/users/user.interface'

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

const accessToken = useCookie<string | null>('access_token')
const currentUser = computed(() => {
    const token = accessToken.value
    return token ? getAuthTokenProfile(token) : null
})
const displayName = computed(() => currentUser.value?.fullName || 'Usuario')
const displayRole = computed(() => {
    const roleCode = currentUser.value?.primaryRole
    if (!roleCode) return ''
    return USER_TYPE_BY_ROLE_CODE[roleCode as keyof typeof USER_TYPE_BY_ROLE_CODE] ?? roleCode
})
const displayInitials = computed(() => {
    const name = currentUser.value?.fullName ?? ''
    return name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
})
const handleHelp = () => {
    toast.info('Centro de ayuda en construcción.')
}

defineEmits<{
    toggleSidebar: []
}>()
</script>
