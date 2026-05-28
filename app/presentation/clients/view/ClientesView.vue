<template>
    <AppShellLayout screen-title="Biblioteca de Clientes">
        <section class="-my-6 -mr-6">
            <div class="grid min-h-[calc(100vh-64px)] grid-cols-10 gap-0">
                <article class="col-span-7 border-r border-outline/20 p-5 lg:p-6">
                    <header class="space-y-4 pb-4">
                        <div class="flex flex-wrap items-center justify-between gap-3">
                            <h1 class="text-3xl font-headline-md font-semibold text-white">
                                Biblioteca de Clientes
                            </h1>
                            <div class="flex flex-wrap items-center gap-2">
                                <AppButton
                                    icon="download"
                                    size="md"
                                    variant="secondary"
                                    @click="exportClients"
                                >
                                    Export Database
                                </AppButton>
                                <AppButton
                                    icon="person_add"
                                    size="md"
                                    variant="primary"
                                    @click="goToCreateClient"
                                >
                                    Nuevo Cliente
                                </AppButton>
                            </div>
                        </div>

                        <p class="text-lg font-semibold text-slate-200">Biblioteca de Clientes</p>

                        <div class="flex items-start gap-3">
                            <div class="min-w-0 flex-1 space-y-1">
                                <label
                                    class="text-[0.65rem] font-label-caps uppercase tracking-[0.12em] text-secondary-container"
                                >
                                    Estado
                                </label>
                                <AppSelect
                                    v-model="selectedStatus"
                                    compact
                                    :clearable="false"
                                    :input-class="'!py-2.5'"
                                    :options="statusOptions"
                                    :searchable="false"
                                />
                            </div>

                            <div class="min-w-0 flex-1 space-y-1">
                                <label
                                    class="text-[0.65rem] font-label-caps uppercase tracking-[0.12em] text-secondary-container"
                                >
                                    Región
                                </label>
                                <AppSelect
                                    v-model="selectedRegion"
                                    compact
                                    :clearable="false"
                                    :input-class="'!py-2.5'"
                                    :options="regionOptions"
                                    :searchable="false"
                                />
                            </div>

                            <div class="mt-2 w-[170px] shrink-0 space-y-1">
                                <label
                                    class="invisible block text-[0.65rem] font-label-caps uppercase tracking-[0.12em]"
                                >
                                    Reset
                                </label>
                                <AppButton
                                    class="h-[42px] w-full"
                                    size="md"
                                    variant="ghost"
                                    @click="resetFilters"
                                >
                                    Limpiar
                                </AppButton>
                            </div>
                        </div>
                    </header>

                    <div class="mt-4">
                        <ClientsDataTable
                            :rows="filteredRows"
                            :selected-row-key="selectedClientId"
                            @row-select="handleClientRowSelect"
                        />
                    </div>
                </article>

                <aside
                    class="col-span-3 flex h-full flex-col gap-0 border-l border-outline/20 bg-surface-container-low/15"
                >
                    <!-- Acciones -->
                    <div
                        class="flex items-center justify-between gap-1 border-b border-outline/20 px-3 py-2.5"
                    >
                        <div class="flex items-center gap-1">
                            <AppButton
                                icon="edit"
                                size="sm"
                                variant="ghost"
                                :disabled="!selectedClientRow"
                                @click="goToEditSelectedClient"
                            >
                                Editar
                            </AppButton>
                            <AppButton
                                icon="delete"
                                size="sm"
                                variant="ghost"
                                :disabled="!selectedClientRow"
                                class="text-status-error"
                                @click="handleDeleteSelectedClient"
                            >
                                Eliminar
                            </AppButton>
                        </div>
                        <AppButton size="sm" variant="primary">Historial</AppButton>
                    </div>

                    <!-- Nombre y código -->
                    <div class="border-b border-outline/20 px-3 py-3 text-center">
                        <h2 class="truncate text-base font-semibold text-slate-100">
                            {{ selectedClientName }}
                        </h2>
                        <p class="mt-0.5 text-xs text-outline-variant">{{ selectedClientCode }}</p>
                    </div>

                    <!-- Stats -->
                    <div class="grid grid-cols-3 border-b border-outline/20">
                        <div
                            class="border-r border-outline/20 bg-surface-container-low/20 px-2 py-2 text-center"
                        >
                            <p class="text-[0.6rem] uppercase tracking-wide text-outline-variant">
                                Clientes
                            </p>
                            <p class="mt-0.5 text-lg font-semibold text-slate-100">
                                {{ totalClients }}
                            </p>
                        </div>
                        <div class="border-r border-outline/20 bg-primary/10 px-2 py-2 text-center">
                            <p class="text-[0.6rem] uppercase tracking-wide text-primary-fixed-dim">
                                Activos
                            </p>
                            <p class="mt-0.5 text-lg font-semibold text-primary-fixed-dim">
                                {{ activeClients }}
                            </p>
                        </div>
                        <div class="bg-amber-500/15 px-2 py-2 text-center">
                            <p class="text-[0.6rem] uppercase tracking-wide text-amber-200">
                                Inactivos
                            </p>
                            <p class="mt-0.5 text-lg font-semibold text-amber-200">
                                {{ prospectClients }}
                            </p>
                        </div>
                    </div>

                    <!-- Contacto -->
                    <div class="space-y-2 border-b border-outline/20 px-3 py-3">
                        <p
                            class="text-[0.6rem] font-semibold uppercase tracking-wider text-primary-fixed-dim"
                        >
                            Contacto
                        </p>
                        <div class="space-y-1.5">
                            <div>
                                <p class="text-[0.6rem] uppercase text-outline-variant">Nombre</p>
                                <p class="truncate text-sm text-slate-100">
                                    {{ selectedClientContact }}
                                </p>
                            </div>
                            <div>
                                <p class="text-[0.6rem] uppercase text-outline-variant">Email</p>
                                <p class="truncate text-sm text-slate-100">
                                    {{ selectedClientEmail }}
                                </p>
                            </div>
                            <div>
                                <p class="text-[0.6rem] uppercase text-outline-variant">Estado</p>
                                <p class="text-sm text-slate-100">
                                    {{ selectedClientStatusLabel }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Notas -->
                    <div class="px-3 py-3">
                        <p
                            class="text-[0.6rem] font-semibold uppercase tracking-wider text-primary-fixed-dim"
                        >
                            Notas
                        </p>
                        <p
                            class="mt-1.5 text-xs italic leading-relaxed text-slate-300 line-clamp-4"
                        >
                            {{ selectedClientNotes }}
                        </p>
                    </div>
                </aside>
            </div>

            <input
                ref="importInputRef"
                accept=".csv"
                class="hidden"
                type="file"
                @change="handleImportSelection"
            />
        </section>
    </AppShellLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'
import AppSelect, { type AppSelectOption } from '~/presentation/shared/components/ui/AppSelect.vue'
import ClientsDataTable from '~/presentation/clients/components/ClientsDataTable.vue'
import { useClientsModule } from '~/presentation/clients/composables/useClientsModule'

defineOptions({
    name: 'ClientesView',
})

const router = useRouter()
const {
    importInputRef,
    totalClients,
    activeClients,
    prospectClients,
    clientTableRows,
    getClientFormModelById,
    deleteClient,
    handleImportSelection,
    exportClients,
    hydrateClients,
} = useClientsModule()

const selectedStatus = ref<string>('all')
const selectedRegion = ref<string>('all')
const selectedClientId = ref<string>('')

const statusOptions: AppSelectOption[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Activos', value: 'active' },
    { label: 'Inactivos', value: 'inactive' },
]

const regionOptions = computed<AppSelectOption[]>(() => {
    const regions = [
        ...new Set(
            clientTableRows.value
                .map((row) => row.location.split(',').pop()?.trim() ?? '')
                .filter((region) => region.length > 0),
        ),
    ]
    return [
        { label: 'Todas las regiones', value: 'all' },
        ...regions.map((region) => ({ label: region, value: region })),
    ]
})

const filteredRows = computed(() => {
    return clientTableRows.value.filter((clientRow) => {
        if (selectedStatus.value === 'active' && !clientRow.isActive) return false
        if (selectedStatus.value === 'inactive' && clientRow.isActive) return false

        if (selectedRegion.value !== 'all') {
            const region = clientRow.location.split(',').pop()?.trim() ?? ''
            if (region !== selectedRegion.value) return false
        }

        return true
    })
})

const selectedClientRow = computed(() => {
    return (
        filteredRows.value.find((clientRow) => clientRow.id === selectedClientId.value) ??
        filteredRows.value[0] ??
        null
    )
})

const selectedClientForm = computed(() => {
    if (!selectedClientRow.value) {
        return null
    }

    return getClientFormModelById(selectedClientRow.value.id)
})

const selectedClientName = computed(
    () => selectedClientRow.value?.name ?? 'Sin cliente seleccionado',
)
const selectedClientCode = computed(() => selectedClientRow.value?.code ?? 'N/A')
const selectedClientContact = computed(() => selectedClientForm.value?.contactName ?? 'N/A')
const selectedClientStatusLabel = computed(() =>
    selectedClientRow.value ? (selectedClientRow.value.isActive ? 'Activo' : 'Inactivo') : 'N/A',
)
const selectedClientEmail = computed(() => selectedClientForm.value?.contactEmail ?? 'N/A')
const selectedClientNotes = computed(
    () => selectedClientForm.value?.notes || 'No hay notas registradas para este cliente.',
)

const goToCreateClient = () => {
    void router.push('/clientes/nuevo')
}

const goToEditClient = (clientId: string) => {
    void router.push(`/clientes/${clientId}/editar`)
}

const handleClientRowSelect = (clientId: string) => {
    selectedClientId.value = clientId
}

const goToEditSelectedClient = () => {
    if (!selectedClientRow.value) {
        return
    }

    goToEditClient(selectedClientRow.value.id)
}

const handleDeleteSelectedClient = async () => {
    if (!selectedClientRow.value) {
        return
    }

    await deleteClient(selectedClientRow.value.id)
}

const resetFilters = () => {
    selectedStatus.value = 'all'
    selectedRegion.value = 'all'
}

watch(
    filteredRows,
    (rows) => {
        const firstRow = rows.at(0)

        if (!firstRow) {
            selectedClientId.value = ''
            return
        }

        if (!rows.some((row) => row.id === selectedClientId.value)) {
            selectedClientId.value = firstRow.id
        }
    },
    { immediate: true },
)

onMounted(() => {
    void hydrateClients()
})

useHead(() => ({
    title: 'RUASA ERP - Clientes',
    htmlAttrs: {
        lang: 'es',
    },
    bodyAttrs: {
        class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
    },
}))
</script>
