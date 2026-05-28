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
                    class="col-span-3 flex h-full flex-col gap-0 overflow-hidden border-l border-outline/20 bg-surface-container-low/15"
                >
                    <!-- Acciones -->
                    <div
                        class="flex shrink-0 items-center justify-between gap-1 border-b border-outline/20 px-3 py-2.5"
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
                        <span
                            class="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            :class="
                                selectedClientRow?.isActive
                                    ? 'bg-emerald-500/15 text-emerald-300'
                                    : 'bg-outline/15 text-outline-variant'
                            "
                        >
                            {{ selectedClientRow?.isActive ? 'Activo' : 'Inactivo' }}
                        </span>
                    </div>

                    <!-- Header cliente -->
                    <div class="shrink-0 border-b border-outline/20 px-3 py-3">
                        <h2 class="truncate text-base font-semibold text-slate-100">
                            {{ selectedClientName }}
                        </h2>
                        <p class="mt-0.5 font-mono text-xs text-outline-variant">
                            {{ selectedClientCode }}
                        </p>
                    </div>

                    <!-- Stats globales -->
                    <div class="grid shrink-0 grid-cols-3 border-b border-outline/20">
                        <div
                            class="border-r border-outline/20 bg-surface-container-low/20 px-2 py-2 text-center"
                        >
                            <p class="text-[0.6rem] uppercase tracking-wide text-outline-variant">
                                Total
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

                    <!-- Scroll area -->
                    <div class="min-h-0 flex-1 overflow-y-auto">
                        <!-- Contacto -->
                        <div class="space-y-2 border-b border-outline/20 px-3 py-3">
                            <p
                                class="text-[0.6rem] font-semibold uppercase tracking-wider text-primary-fixed-dim"
                            >
                                Contacto
                            </p>
                            <div class="grid gap-1.5 text-xs">
                                <div v-if="selectedClientContact !== 'N/A'">
                                    <p class="text-[0.6rem] uppercase text-outline-variant">
                                        Nombre
                                    </p>
                                    <p class="text-slate-100">{{ selectedClientContact }}</p>
                                </div>
                                <div v-if="selectedClientEmail !== 'N/A'">
                                    <p class="text-[0.6rem] uppercase text-outline-variant">
                                        Email
                                    </p>
                                    <p class="break-all text-slate-100">
                                        {{ selectedClientEmail }}
                                    </p>
                                </div>
                                <div v-if="selectedClientForm?.contactPhone">
                                    <p class="text-[0.6rem] uppercase text-outline-variant">
                                        Teléfono
                                    </p>
                                    <p class="text-slate-100">
                                        {{ selectedClientForm.contactPhone }}
                                    </p>
                                </div>
                                <div v-if="selectedClientForm?.taxId">
                                    <p class="text-[0.6rem] uppercase text-outline-variant">
                                        NIT / Tax ID
                                    </p>
                                    <p class="font-mono text-slate-100">
                                        {{ selectedClientForm.taxId }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Dirección -->
                        <div
                            v-if="selectedClientForm?.addressLine || selectedClientForm?.city"
                            class="space-y-2 border-b border-outline/20 px-3 py-3"
                        >
                            <p
                                class="text-[0.6rem] font-semibold uppercase tracking-wider text-primary-fixed-dim"
                            >
                                Ubicación
                            </p>
                            <div class="grid gap-1.5 text-xs">
                                <div
                                    v-if="
                                        selectedClientForm.country ||
                                        selectedClientForm.department ||
                                        selectedClientForm.city
                                    "
                                >
                                    <p class="text-[0.6rem] uppercase text-outline-variant">
                                        País / Depto / Ciudad
                                    </p>
                                    <p class="text-slate-100">
                                        {{
                                            [
                                                selectedClientForm.city,
                                                selectedClientForm.department,
                                                selectedClientForm.country,
                                            ]
                                                .filter(Boolean)
                                                .join(', ')
                                        }}
                                    </p>
                                </div>
                                <div v-if="selectedClientForm.addressLine">
                                    <p class="text-[0.6rem] uppercase text-outline-variant">
                                        Dirección
                                    </p>
                                    <p class="text-slate-100">
                                        {{ selectedClientForm.addressLine }}
                                    </p>
                                </div>
                                <div v-if="selectedClientForm.addressReference">
                                    <p class="text-[0.6rem] uppercase text-outline-variant">
                                        Referencia
                                    </p>
                                    <p class="italic text-outline-variant">
                                        {{ selectedClientForm.addressReference }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Notas -->
                        <div
                            v-if="selectedClientForm?.notes"
                            class="border-b border-outline/20 px-3 py-3"
                        >
                            <p
                                class="text-[0.6rem] font-semibold uppercase tracking-wider text-primary-fixed-dim"
                            >
                                Notas
                            </p>
                            <p class="mt-1.5 text-xs italic leading-relaxed text-slate-300">
                                {{ selectedClientForm.notes }}
                            </p>
                        </div>

                        <!-- Historial de solicitudes -->
                        <div class="px-3 py-3">
                            <div class="mb-2 flex items-center justify-between">
                                <p
                                    class="text-[0.6rem] font-semibold uppercase tracking-wider text-primary-fixed-dim"
                                >
                                    Solicitudes
                                    <span
                                        v-if="clientRequests.length"
                                        class="ml-1 rounded-full bg-primary/20 px-1.5 py-0.5 text-primary-fixed-dim"
                                    >
                                        {{ clientRequests.length }}
                                    </span>
                                </p>
                            </div>

                            <div
                                v-if="isLoadingRequests"
                                class="flex items-center gap-2 py-4 text-xs text-outline-variant"
                            >
                                <span class="material-symbols-outlined animate-spin text-[16px]"
                                    >progress_activity</span
                                >
                                Cargando solicitudes...
                            </div>

                            <div
                                v-else-if="!clientRequests.length"
                                class="py-4 text-center text-xs text-outline-variant"
                            >
                                Sin solicitudes registradas.
                            </div>

                            <ul v-else class="space-y-2">
                                <li
                                    v-for="req in clientRequests"
                                    :key="req.id"
                                    class="rounded-lg border border-outline/20 bg-surface-container-lowest/10 px-2.5 py-2"
                                >
                                    <div class="flex items-start justify-between gap-1">
                                        <div class="min-w-0">
                                            <div class="flex items-center gap-1.5">
                                                <span
                                                    class="font-mono text-[11px] font-semibold text-primary-fixed-dim"
                                                    >{{ req.code }}</span
                                                >
                                                <span
                                                    class="rounded bg-primary/15 px-1 py-0.5 font-mono text-[9px] text-primary-fixed-dim"
                                                    >v{{ req.versionNumber }}</span
                                                >
                                            </div>
                                            <p class="mt-0.5 truncate text-[11px] text-slate-300">
                                                {{ req.title || req.productName || '—' }}
                                            </p>
                                            <p class="mt-0.5 text-[10px] text-outline-variant">
                                                {{ formatDate(req.createdAt) }} ·
                                                {{ req.sellerName }}
                                            </p>
                                        </div>
                                        <div class="flex shrink-0 flex-col items-end gap-1">
                                            <span
                                                class="inline-flex rounded border px-1.5 py-0.5 text-[9px] font-semibold"
                                                :class="resolveStatusClass(req.status)"
                                            >
                                                {{ resolveStatusLabel(req.status) }}
                                            </span>
                                            <span
                                                class="inline-flex rounded border px-1.5 py-0.5 text-[9px] font-semibold"
                                                :class="resolvePriorityClass(req.priority)"
                                            >
                                                {{ req.priority }}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
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
import { useApiClient } from '~/presentation/shared/composables/useApiClient'
import {
    REQUEST_STATUS_LABELS,
    type RequestStatus,
    type RequestPriority,
} from '~/presentation/interfaces/requests/request.interface'

interface ClientRequest {
    id: string
    code: string
    title: string
    productName: string
    priority: RequestPriority
    status: RequestStatus
    versionNumber: number
    sellerName: string
    requiredDate: string | null
    createdAt: string
}

defineOptions({
    name: 'ClientesView',
})

const router = useRouter()
const apiClient = useApiClient()
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
const clientRequests = ref<ClientRequest[]>([])
const isLoadingRequests = ref(false)

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

const STATUS_CLASSES: Record<string, string> = {
    CREATED: 'border-outline/40 text-outline-variant',
    PENDING_DESIGN_REVIEW: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300',
    ASSIGNED_TO_DESIGNER: 'border-blue-400/40 bg-blue-400/10 text-blue-300',
    IN_DESIGN: 'border-primary/40 bg-primary/10 text-primary-fixed-dim',
    SENT_TO_QUALITY: 'border-purple-400/40 bg-purple-400/10 text-purple-300',
    QUALITY_REJECTED: 'border-red-400/40 bg-red-400/10 text-red-300',
    QUALITY_APPROVED: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
    DELIVERED_TO_SALES: 'border-teal-400/40 bg-teal-400/10 text-teal-300',
    CANCELLED: 'border-outline/30 bg-outline/5 text-outline-variant',
}

const PRIORITY_CLASSES: Record<string, string> = {
    URGENT: 'border-red-500/40 bg-red-500/10 text-red-300',
    HIGH: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    MEDIUM: 'border-blue-400/40 bg-blue-400/10 text-blue-300',
    LOW: 'border-outline/40 text-outline-variant',
}

const resolveStatusClass = (status: string) =>
    STATUS_CLASSES[status] ?? 'border-outline/40 text-outline-variant'
const resolvePriorityClass = (priority: string) =>
    PRIORITY_CLASSES[priority] ?? 'border-outline/40 text-outline-variant'
const resolveStatusLabel = (status: string) =>
    REQUEST_STATUS_LABELS[status as RequestStatus] ?? status

const formatDate = (iso: string | null) => {
    if (!iso) return '—'
    return new Intl.DateTimeFormat('es-SV', { dateStyle: 'short' }).format(new Date(iso))
}

const loadClientRequests = async (clientId: string) => {
    if (!clientId) {
        clientRequests.value = []
        return
    }
    isLoadingRequests.value = true
    try {
        const res = await apiClient.get<ClientRequest[]>(`/clients/${clientId}/requests`)
        clientRequests.value = res.data
    } catch {
        clientRequests.value = []
    } finally {
        isLoadingRequests.value = false
    }
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

watch(selectedClientId, (id) => void loadClientRequests(id), { immediate: true })

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
