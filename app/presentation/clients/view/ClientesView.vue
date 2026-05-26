<template>
    <AppShellLayout screen-title="Biblioteca de Clientes">
        <section class="-my-6 -mr-6">
            <div class="grid min-h-[calc(100vh-64px)] grid-cols-5 gap-0">
                <article class="col-span-3 border-r border-outline/20 p-5 lg:p-6">
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
                                    Industria
                                </label>
                                <AppSelect
                                    v-model="selectedIndustry"
                                    compact
                                    :clearable="false"
                                    :input-class="'!py-2.5'"
                                    :options="industryOptions"
                                    :searchable="false"
                                />
                            </div>

                            <div class="min-w-0 flex-1 space-y-1">
                                <label
                                    class="text-[0.65rem] font-label-caps uppercase tracking-[0.12em] text-secondary-container"
                                >
                                    Status
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
                                    Region
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
                                    Reset Filters
                                </AppButton>
                            </div>
                        </div>
                    </header>

                    <div class="mt-4">
                        <ClientsDataTable
                            :rows="filteredRows"
                            @delete-client="deleteClient"
                            @edit-client="goToEditClient"
                        />
                    </div>
                </article>

                <aside
                    class="col-span-2 h-full border-l border-outline/20 bg-surface-container-low/15 p-5 lg:p-6"
                >
                    <div
                        class="flex items-center justify-between gap-2 border-b border-outline/20 pb-4"
                    >
                        <AppButton size="md" variant="ghost" @click="goToEditSelectedClient">
                            Editar Perfil
                        </AppButton>
                        <AppButton size="md" variant="primary"> Historial </AppButton>
                    </div>

                    <div class="mt-5 text-center">
                        <h2 class="text-3xl font-headline-md font-semibold text-slate-100">
                            {{ selectedClientName }}
                        </h2>
                        <p class="mt-1 text-xl text-outline-variant">
                            ID: {{ selectedClientCode }}
                        </p>
                    </div>

                    <div
                        class="mt-5 grid grid-cols-3 overflow-hidden rounded-lg border border-outline/20"
                    >
                        <article
                            class="border-r border-outline/20 bg-surface-container-low/20 p-3 text-center"
                        >
                            <p
                                class="text-[0.65rem] uppercase tracking-[0.13em] text-outline-variant"
                            >
                                Ordenes Totales
                            </p>
                            <p class="mt-1 text-3xl font-semibold text-slate-100">
                                {{ totalClients }}
                            </p>
                        </article>
                        <article class="border-r border-outline/20 bg-primary/10 p-3 text-center">
                            <p
                                class="text-[0.65rem] uppercase tracking-[0.13em] text-primary-fixed-dim"
                            >
                                Solicitudes Activas
                            </p>
                            <p class="mt-1 text-3xl font-semibold text-primary-fixed-dim">
                                {{ activeClients }}
                            </p>
                        </article>
                        <article class="bg-amber-500/15 p-3 text-center">
                            <p class="text-[0.65rem] uppercase tracking-[0.13em] text-amber-200">
                                Pendientes de Aprobacion
                            </p>
                            <p class="mt-1 text-3xl font-semibold text-amber-200">
                                {{ prospectClients }}
                            </p>
                        </article>
                    </div>

                    <section class="mt-6 border-t border-outline/20 pt-4">
                        <h3
                            class="text-[0.75rem] font-label-caps uppercase tracking-[0.14em] text-primary-fixed-dim"
                        >
                            Informacion de Contacto
                        </h3>
                        <div class="mt-3 grid grid-cols-2 gap-4">
                            <div>
                                <p
                                    class="text-[0.65rem] font-label-caps uppercase text-outline-variant"
                                >
                                    Contacto
                                </p>
                                <p class="mt-1 text-lg text-slate-100">
                                    {{ selectedClientContact }}
                                </p>
                            </div>
                            <div>
                                <p
                                    class="text-[0.65rem] font-label-caps uppercase text-outline-variant"
                                >
                                    Encargado
                                </p>
                                <p class="mt-1 text-lg text-slate-100">
                                    {{ selectedClientStatusLabel }}
                                </p>
                            </div>
                        </div>
                        <div class="mt-3">
                            <p
                                class="text-[0.65rem] font-label-caps uppercase text-outline-variant"
                            >
                                Email
                            </p>
                            <p class="mt-1 break-all text-lg text-slate-100">
                                {{ selectedClientEmail }}
                            </p>
                        </div>
                    </section>

                    <section class="mt-6 border-t border-outline/20 pt-4">
                        <h3
                            class="text-[0.75rem] font-label-caps uppercase tracking-[0.14em] text-primary-fixed-dim"
                        >
                            Notas
                        </h3>
                        <blockquote
                            class="mt-3 border-l-4 border-amber-300 pl-3 text-2xl italic leading-relaxed text-slate-300 lg:text-[1.45rem]"
                        >
                            {{ selectedClientNotes }}
                        </blockquote>
                    </section>

                    <section class="mt-6 border-t border-outline/20 pt-4">
                        <h3
                            class="text-[0.75rem] font-label-caps uppercase tracking-[0.14em] text-primary-fixed-dim"
                        >
                            Solicitudes Recientes
                        </h3>
                        <div
                            class="mt-3 divide-y divide-outline/20 rounded-lg border border-outline/20 bg-surface-container-low/10"
                        >
                            <article class="flex items-center justify-between gap-3 px-3 py-2.5">
                                <div>
                                    <p class="text-lg font-semibold text-slate-100">
                                        #SOL-9921: Die-cut optimization
                                    </p>
                                    <p class="text-sm text-outline-variant">Submitted 2 days ago</p>
                                </div>
                                <span
                                    class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-deep-navy"
                                >
                                    <span class="material-symbols-outlined text-[16px]"
                                        >more_horiz</span
                                    >
                                </span>
                            </article>
                            <article class="flex items-center justify-between gap-3 px-3 py-2.5">
                                <div>
                                    <p class="text-lg font-semibold text-slate-100">
                                        #SOL-9840: Batch-B Calibration
                                    </p>
                                    <p class="text-sm text-outline-variant">Completed Oct 28</p>
                                </div>
                                <span
                                    class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-deep-navy"
                                >
                                    <span class="material-symbols-outlined text-[16px]">check</span>
                                </span>
                            </article>
                        </div>
                    </section>
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
    deleteClient,
    getClientFormModelById,
    handleImportSelection,
    exportClients,
    hydrateClients,
} = useClientsModule()

const selectedIndustry = ref<string>('all')
const selectedStatus = ref<string>('all')
const selectedRegion = ref<string>('all')
const selectedClientId = ref<string>('')

const industryOptions = computed<AppSelectOption[]>(() => {
    const segments = [
        ...new Set(
            clientTableRows.value
                .map((row) => row.segment)
                .filter((segment) => segment.trim().length > 0),
        ),
    ]
    return [
        { label: 'ALL', value: 'all' },
        ...segments.map((segment) => ({ label: segment.toUpperCase(), value: segment })),
    ]
})

const statusOptions: AppSelectOption[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Activo', value: 'Activo' },
    { label: 'Prospecto', value: 'Prospecto' },
    { label: 'Inactivo', value: 'Inactivo' },
]

const regionOptions = computed<AppSelectOption[]>(() => {
    const regions = [
        ...new Set(
            clientTableRows.value
                .map((row) => {
                    const parts = row.location.split(',')
                    return parts[parts.length - 1]?.trim() ?? ''
                })
                .filter((region) => region.length > 0),
        ),
    ]

    return [
        { label: 'All Regions', value: 'all' },
        ...regions.map((region) => ({ label: region, value: region })),
    ]
})

const filteredRows = computed(() => {
    return clientTableRows.value.filter((clientRow) => {
        if (selectedIndustry.value !== 'all' && clientRow.segment !== selectedIndustry.value) {
            return false
        }

        if (selectedStatus.value !== 'all' && clientRow.status !== selectedStatus.value) {
            return false
        }

        if (selectedRegion.value !== 'all') {
            const region = clientRow.location.split(',').pop()?.trim() ?? ''
            if (region !== selectedRegion.value) {
                return false
            }
        }

        return true
    })
})

const selectedClientRow = computed(() => {
    return filteredRows.value[0] ?? null
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
const selectedClientStatusLabel = computed(() => selectedClientRow.value?.status ?? 'N/A')
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

const goToEditSelectedClient = () => {
    if (!selectedClientRow.value) {
        return
    }

    goToEditClient(selectedClientRow.value.id)
}

const resetFilters = () => {
    selectedIndustry.value = 'all'
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
