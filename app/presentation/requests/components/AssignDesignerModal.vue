<template>
    <div
        v-if="open"
        class="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4"
        @click.self="handleClose"
    >
        <section
            class="w-full max-w-lg rounded-2xl border border-outline/20 bg-deep-navy p-5 shadow-2xl"
        >
            <header class="flex items-start justify-between gap-4">
                <div>
                    <h3 class="text-base font-semibold text-white">Asignar diseñador</h3>
                    <p class="mt-1 text-sm text-outline-variant">
                        Selecciona un diseñador del equipo para que tome la solicitud
                        <span v-if="requestCode" class="font-semibold text-primary-fixed-dim">
                            {{ requestCode }} </span
                        >.
                    </p>
                </div>

                <button
                    type="button"
                    class="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline-variant transition-colors hover:bg-surface-container-low/10 hover:text-white"
                    title="Cerrar"
                    @click="handleClose"
                >
                    <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
            </header>

            <div class="mt-4 space-y-2">
                <label class="text-[0.65rem] font-label-caps uppercase text-secondary-container">
                    Diseñador
                    <span class="text-status-error">*</span>
                </label>

                <AppSelect
                    v-model="selectedDesignerId"
                    :clearable="false"
                    :options="designerOptions"
                    placeholder="Selecciona un diseñador..."
                    :searchable="true"
                />

                <p v-if="errorMessage" class="text-xs text-status-error">
                    {{ errorMessage }}
                </p>
            </div>

            <footer class="mt-5 flex flex-wrap items-center justify-end gap-2">
                <AppButton variant="ghost" @click="handleClose"> Cancelar </AppButton>
                <AppButton :disabled="isSubmitting" variant="primary" @click="handleConfirm">
                    {{ isSubmitting ? 'Asignando...' : 'Asignar' }}
                </AppButton>
            </footer>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'
import AppSelect from '~/presentation/shared/components/ui/AppSelect.vue'
import { useApiClient } from '~/presentation/shared/composables/useApiClient'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'

interface Designer {
    id: string
    fullName: string
    userType: string
    status: string
}

interface AssignDesignerModalProps {
    open: boolean
    requestCode?: string
    initialDesignerId?: string | null
}

defineOptions({
    name: 'AssignDesignerModal',
})

const props = withDefaults(defineProps<AssignDesignerModalProps>(), {
    requestCode: '',
    initialDesignerId: null,
})

const emit = defineEmits<{
    close: []
    confirm: [designerId: string, designerName: string]
}>()

const apiClient = useApiClient()
const toast = useAppToast()

const designers = ref<Designer[]>([])
const selectedDesignerId = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const designerOptions = computed(() => {
    return designers.value
        .filter((designer) => designer.status === 'Activo')
        .map((designer) => ({
            label: designer.fullName,
            value: designer.id,
        }))
})

const loadDesigners = async () => {
    try {
        const response = await apiClient.get<Designer[]>('/users')
        designers.value = response.data.filter((user) => user.userType === 'Diseñador')
    } catch {
        toast.warning('No se pudo cargar la lista de diseñadores.')
    }
}

const resetState = () => {
    selectedDesignerId.value = props.initialDesignerId ?? ''
    errorMessage.value = ''
    isSubmitting.value = false
}

const handleClose = () => {
    if (isSubmitting.value) {
        return
    }
    emit('close')
}

const handleConfirm = () => {
    if (!selectedDesignerId.value) {
        errorMessage.value = 'Debes seleccionar un diseñador.'
        return
    }

    errorMessage.value = ''
    isSubmitting.value = true
    const selectedDesigner = designers.value.find((d) => d.id === selectedDesignerId.value)
    const designerName = selectedDesigner?.fullName ?? ''
    emit('confirm', selectedDesignerId.value, designerName)
}

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            resetState()
            void loadDesigners()
        }
    },
    { immediate: true },
)

defineExpose({
    resetSubmitting: () => {
        isSubmitting.value = false
    },
})
</script>
