<template>
    <AppShellLayout screen-title="Solicitudes">
        <section class="h-full">
            <div class="grid h-full gap-4 xl:grid-cols-[minmax(0,70%),minmax(0,30%)]">
                <!-- ── Lista ──────────────────────────────────────────── -->
                <article class="min-h-0 border-r border-outline/20 pr-0 xl:pr-0">
                    <header
                        class="flex flex-wrap items-start justify-between gap-4 border-b border-outline/20 px-4 py-4"
                    >
                        <div>
                            <h1 class="text-[1.8rem] font-headline-md font-semibold text-white">
                                Solicitudes
                            </h1>
                            <p
                                class="mt-2 text-xs uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Listado de Solicitudes
                            </p>
                            <p class="text-sm text-outline-variant">
                                {{ activeRows.length }} registros encontrados.
                            </p>
                        </div>
                        <div class="flex items-center gap-2">
                            <AppButton
                                icon="add"
                                size="md"
                                variant="secondary"
                                @click="goToCreateRequest"
                            >
                                Nueva
                            </AppButton>
                        </div>
                    </header>

                    <!-- Tabs -->
                    <div class="flex gap-1 border-b border-outline/20 px-4 pt-3">
                        <button
                            v-for="tab in tabs"
                            :key="tab.key"
                            :class="[
                                'flex items-center gap-1.5 rounded-t-lg px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors',
                                activeTab === tab.key
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-outline-variant hover:text-white',
                            ]"
                            type="button"
                            @click="selectTab(tab.key)"
                        >
                            {{ tab.label }}
                            <span
                                class="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                                :class="
                                    activeTab === tab.key
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-outline/20 text-outline-variant'
                                "
                            >
                                {{ tab.count }}
                            </span>
                        </button>
                    </div>

                    <div class="min-h-0 px-4 py-3">
                        <RequestsDataTable
                            :rows="activeRows"
                            row-clickable
                            :selected-row-key="selectedId"
                            @row-select="selectedId = $event"
                            @edit-request="goToEditRequest"
                            @delete-request="handleDeleteRequest"
                            @duplicate-request="handleDuplicateRequest"
                            @assign-designer="handleAssignDesigner"
                            @submit-to-quality="handleSubmitToQuality"
                            @approve-request="handleApproveRequest"
                            @reject-request="handleRejectRequest"
                        />
                    </div>
                </article>

                <!-- ── Expediente histórico ────────────────────────────── -->
                <aside
                    class="-mr-6 -my-6 flex h-[calc(100%+3rem)] flex-col self-stretch border-l border-outline/20 bg-surface-container-lowest/5"
                >
                    <header class="border-b border-outline/20 px-4 py-4">
                        <h2 class="text-xl font-semibold text-slate-200">Expediente Histórico</h2>
                        <div class="mt-2 grid gap-1.5">
                            <div class="flex items-center gap-2">
                                <p
                                    class="inline-flex w-fit rounded bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary-fixed-dim"
                                >
                                    {{ selected?.requestCode || 'SOL-0000-000' }}
                                </p>
                                <span
                                    v-if="selectedSummary"
                                    class="inline-flex rounded bg-secondary-container/20 px-2 py-0.5 font-mono text-xs text-secondary-container"
                                >
                                    v{{ selectedSummary.versionNumber }}
                                </span>
                            </div>
                            <p class="text-base text-slate-300">
                                {{ selected?.clientName || 'Selecciona una solicitud' }}
                            </p>
                        </div>
                    </header>

                    <div class="min-h-0 flex-1 space-y-4 overflow-auto px-4 py-4">
                        <!-- Estado y prioridad -->
                        <section v-if="selected">
                            <div class="flex flex-wrap gap-2">
                                <AppStatusBadge
                                    :label="resolveStatusLabel(selected.status)"
                                    :tone="resolveStatusTone(selected.status)"
                                />
                                <AppStatusBadge
                                    :label="resolvePriorityLabel(selected.priority)"
                                    :tone="resolvePriorityTone(selected.priority)"
                                />
                            </div>
                        </section>

                        <!-- Datos del cliente y solicitante -->
                        <section v-if="selected" class="border-t border-outline/20 pt-3">
                            <h3
                                class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Detalles
                            </h3>
                            <div class="grid gap-2 text-sm">
                                <div v-if="selected.productName">
                                    <p class="text-[10px] uppercase text-outline-variant">
                                        Producto
                                    </p>
                                    <p class="text-slate-200">{{ selected.productName }}</p>
                                </div>
                                <div v-if="selected.requestedBy">
                                    <p class="text-[10px] uppercase text-outline-variant">
                                        Solicitado por
                                    </p>
                                    <p class="text-slate-200">{{ selected.requestedBy }}</p>
                                </div>
                                <div v-if="selected.requiredDateLabel !== '—'">
                                    <p class="text-[10px] uppercase text-outline-variant">
                                        Entrega solicitada
                                    </p>
                                    <p class="text-slate-200">{{ selected.requiredDateLabel }}</p>
                                </div>
                            </div>
                        </section>

                        <!-- Diseñadores asignados -->
                        <section v-if="selected" class="border-t border-outline/20 pt-3">
                            <h3
                                class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Diseñadores asignados
                            </h3>
                            <div
                                v-if="selected.assignedDesigners.length === 0"
                                class="text-xs text-outline-variant"
                            >
                                Sin asignar
                            </div>
                            <ul v-else class="space-y-1">
                                <li
                                    v-for="d in selected.assignedDesigners"
                                    :key="d.designerId"
                                    class="flex items-center gap-2 text-sm text-slate-200"
                                >
                                    <span
                                        class="material-symbols-outlined text-[15px] text-primary-fixed-dim"
                                        >design_services</span
                                    >
                                    {{ d.designerName }}
                                </li>
                            </ul>
                        </section>

                        <!-- Verificación de Calidad (checklist) -->
                        <section v-if="selectedSummary" class="border-t border-outline/20 pt-3">
                            <h3
                                class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Verificación de Calidad
                            </h3>
                            <div class="grid gap-1.5 text-xs">
                                <p
                                    class="flex items-center justify-between border-b border-outline/20 pb-1"
                                    :class="
                                        selectedSummary.artCompleted
                                            ? 'text-emerald-200'
                                            : 'text-outline-variant'
                                    "
                                >
                                    <span>Arte</span>
                                    <span>{{ selectedSummary.artCompleted ? '✓' : '—' }}</span>
                                </p>
                                <p
                                    class="flex items-center justify-between border-b border-outline/20 pb-1"
                                    :class="
                                        selectedSummary.mechanicalCompleted
                                            ? 'text-emerald-200'
                                            : 'text-outline-variant'
                                    "
                                >
                                    <span>Mecánico</span>
                                    <span>{{
                                        selectedSummary.mechanicalCompleted ? '✓' : '—'
                                    }}</span>
                                </p>
                                <p
                                    class="flex items-center justify-between"
                                    :class="
                                        selectedSummary.dummyCompleted
                                            ? 'text-emerald-200'
                                            : 'text-outline-variant'
                                    "
                                >
                                    <span>Dummy</span>
                                    <span>{{ selectedSummary.dummyCompleted ? '✓' : '—' }}</span>
                                </p>
                            </div>
                        </section>

                        <!-- Fotos del vendedor -->
                        <section
                            v-if="selectedSummary?.sampleFiles?.length"
                            class="border-t border-outline/20 pt-3"
                        >
                            <h3
                                class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Archivos del vendedor ({{ selectedSummary.sampleFiles.length }})
                            </h3>
                            <div
                                v-if="filesLoading"
                                class="flex items-center gap-1.5 py-2 text-xs text-outline-variant"
                            >
                                <span class="material-symbols-outlined animate-spin text-[13px]"
                                    >progress_activity</span
                                >
                                Cargando archivos…
                            </div>
                            <ul v-else class="space-y-2">
                                <li
                                    v-for="f in selectedFiles?.sampleFiles ??
                                    selectedSummary.sampleFiles"
                                    :key="f.id"
                                    class="overflow-hidden rounded-md border border-outline/20"
                                >
                                    <img
                                        v-if="f.mimeType.startsWith('image/') && f.base64Content"
                                        :src="`data:${f.mimeType};base64,${f.base64Content}`"
                                        :alt="f.originalName"
                                        class="max-h-48 w-full bg-black/20 object-contain"
                                    />
                                    <div
                                        class="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300"
                                    >
                                        <span
                                            class="material-symbols-outlined text-[14px] text-primary-fixed-dim"
                                            >attach_file</span
                                        >
                                        <span class="truncate">{{ f.originalName }}</span>
                                        <span class="ml-auto shrink-0 text-outline-variant"
                                            >{{ Math.round(f.sizeBytes / 1024) }} KB</span
                                        >
                                    </div>
                                </li>
                            </ul>
                        </section>

                        <!-- Fotos del diseñador -->
                        <section
                            v-if="selectedSummary?.attachments?.length"
                            class="border-t border-outline/20 pt-3"
                        >
                            <h3
                                class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Archivos del diseñador ({{ selectedSummary.attachments.length }})
                            </h3>
                            <div
                                v-if="filesLoading"
                                class="flex items-center gap-1.5 py-2 text-xs text-outline-variant"
                            >
                                <span class="material-symbols-outlined animate-spin text-[13px]"
                                    >progress_activity</span
                                >
                                Cargando archivos…
                            </div>
                            <ul v-else class="space-y-2">
                                <li
                                    v-for="f in selectedFiles?.attachments ??
                                    selectedSummary.attachments"
                                    :key="f.id"
                                    class="overflow-hidden rounded-md border border-outline/20"
                                >
                                    <img
                                        v-if="f.mimeType.startsWith('image/') && f.base64Content"
                                        :src="`data:${f.mimeType};base64,${f.base64Content}`"
                                        :alt="f.originalName"
                                        class="max-h-48 w-full bg-black/20 object-contain"
                                    />
                                    <div
                                        class="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300"
                                    >
                                        <span
                                            class="material-symbols-outlined text-[14px] text-secondary-container"
                                            >design_services</span
                                        >
                                        <span class="truncate">{{ f.originalName }}</span>
                                        <span class="ml-auto shrink-0 text-outline-variant"
                                            >{{ Math.round(f.sizeBytes / 1024) }} KB</span
                                        >
                                    </div>
                                </li>
                            </ul>
                        </section>

                        <!-- Placeholder vacío -->
                        <div
                            v-if="!selected"
                            class="flex flex-col items-center justify-center py-12 text-center"
                        >
                            <span class="material-symbols-outlined text-3xl text-outline-variant"
                                >article</span
                            >
                            <p class="mt-2 text-xs text-outline-variant">
                                Selecciona una solicitud para ver su expediente.
                            </p>
                        </div>
                    </div>

                    <footer class="grid grid-cols-2 gap-2 border-t border-outline/20 px-4 py-3">
                        <AppButton
                            size="md"
                            variant="ghost"
                            :disabled="!selected"
                            @click="goToEditRequest(selected?.id ?? '')"
                        >
                            Ver detalle
                        </AppButton>
                        <AppButton
                            icon="add"
                            icon-position="left"
                            size="md"
                            variant="primary"
                            @click="goToCreateRequest"
                        >
                            Nueva
                        </AppButton>
                    </footer>
                </aside>
            </div>
        </section>
    </AppShellLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'
import AppStatusBadge from '~/presentation/shared/components/ui/AppStatusBadge.vue'
import RequestsDataTable from '~/presentation/requests/components/RequestsDataTable.vue'
import { useRequestsByStatus } from '~/presentation/requests/composables/useRequestsByStatus'
import { useApiClient } from '~/presentation/shared/composables/useApiClient'
import type { DesignRequestTableRow } from '~/presentation/interfaces/requests/request-table-row.interface'
import type { RequestSummary } from '~/presentation/interfaces/requests/request-summary.interface'
import {
    REQUEST_STATUS_LABELS,
    REQUEST_PRIORITY_LABELS,
    type RequestStatus,
    type RequestPriority,
    type RequestSampleFile,
    type RequestAttachment,
} from '~/presentation/interfaces/requests/request.interface'

defineOptions({ name: 'SolicitudesView' })

const router = useRouter()
const { grouped, allRequests, totalCount, isLoading, hydrate, countByStatus } =
    useRequestsByStatus()

const selectedId = ref('')

// ── Tabs ──────────────────────────────────────────────────────────────────────

type TabKey = 'all' | 'unassigned' | 'done'

const activeTab = ref<TabKey>('all')

const tabs = computed(() => [
    { key: 'all' as TabKey, label: 'Todas', count: totalCount.value },
    {
        key: 'unassigned' as TabKey,
        label: 'Sin asignar',
        count: countByStatus(['CREATED', 'PENDING_DESIGN_REVIEW']).value,
    },
    {
        key: 'done' as TabKey,
        label: 'Completadas',
        count: countByStatus(['QUALITY_APPROVED', 'DELIVERED_TO_SALES']).value,
    },
])

const TAB_STATUSES: Record<TabKey, RequestStatus[]> = {
    all: [
        'CREATED',
        'PENDING_DESIGN_REVIEW',
        'ASSIGNED_TO_DESIGNER',
        'IN_DESIGN',
        'SENT_TO_QUALITY',
        'QUALITY_REJECTED',
        'QUALITY_APPROVED',
        'DELIVERED_TO_SALES',
        'CANCELLED',
    ],
    unassigned: ['CREATED', 'PENDING_DESIGN_REVIEW'],
    done: ['QUALITY_APPROVED', 'DELIVERED_TO_SALES'],
}

// ── Mapeo RequestSummary → DesignRequestTableRow ──────────────────────────────

const formatDate = (iso: string | null) => {
    if (!iso) return '—'
    return new Intl.DateTimeFormat('es-SV', { dateStyle: 'medium' }).format(new Date(iso))
}

const toTableRow = (req: RequestSummary): DesignRequestTableRow => ({
    id: req.id,
    requestCode: req.code,
    versionNumber: req.versionNumber,
    clientName: req.clientName,
    productName: req.productName || req.brandName || '—',
    materialType: '—',
    printTechnique: '—',
    priority: req.priority,
    status: req.status,
    requiredDateLabel: formatDate(req.requiredDate),
    attachmentsCount: String((req.sampleFiles?.length ?? 0) + (req.attachments?.length ?? 0)),
    requestedBy: req.sellerName,
    assignedDesigners: req.assignedDesigners.map((d) => ({
        designerId: d.designerId,
        designerName: d.designerName,
    })),
})

const activeRows = computed<DesignRequestTableRow[]>(() =>
    TAB_STATUSES[activeTab.value].flatMap((s) => grouped.value[s] ?? []).map(toTableRow),
)

// ── Selección y expediente ────────────────────────────────────────────────────

const selectedSummary = computed<RequestSummary | null>(() => {
    if (!selectedId.value)
        return activeRows.value.length > 0
            ? (allRequests.value.find((r) => r.id === activeRows.value[0]!.id) ?? null)
            : null
    return allRequests.value.find((r) => r.id === selectedId.value) ?? null
})

const selected = computed<DesignRequestTableRow | null>(() => {
    const summary = selectedSummary.value
    return summary ? toTableRow(summary) : null
})

// ── Archivos con preview (carga diferida al seleccionar) ──────────────────────

const apiClient = useApiClient()

interface LoadedFiles {
    sampleFiles: RequestSampleFile[]
    attachments: RequestAttachment[]
}

const filesLoading = ref(false)
const selectedFiles = ref<LoadedFiles | null>(null)
const filesCache = new Map<string, LoadedFiles>()

watch(
    () => selectedSummary.value?.id,
    async (id) => {
        if (!id) {
            selectedFiles.value = null
            return
        }
        if (filesCache.has(id)) {
            selectedFiles.value = filesCache.get(id)!
            return
        }
        filesLoading.value = true
        selectedFiles.value = null
        try {
            const { data } = await apiClient.get<LoadedFiles>(`/requests/${id}`)
            const payload: LoadedFiles = {
                sampleFiles: data.sampleFiles ?? [],
                attachments: data.attachments ?? [],
            }
            filesCache.set(id, payload)
            selectedFiles.value = payload
        } catch {
            selectedFiles.value = null
        } finally {
            filesLoading.value = false
        }
    },
    { immediate: true },
)

// ── Labels / tones ────────────────────────────────────────────────────────────

const resolveStatusLabel = (status: string) =>
    REQUEST_STATUS_LABELS[status as RequestStatus] ?? status

const resolveStatusTone = (
    status: string,
): 'success' | 'warning' | 'danger' | 'info' | 'neutral' => {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
        QUALITY_APPROVED: 'success',
        DELIVERED_TO_SALES: 'success',
        QUALITY_REJECTED: 'danger',
        CANCELLED: 'danger',
        SENT_TO_QUALITY: 'warning',
        PENDING_DESIGN_REVIEW: 'warning',
        ASSIGNED_TO_DESIGNER: 'info',
        IN_DESIGN: 'info',
        CREATED: 'neutral',
    }
    return map[status] ?? 'neutral'
}

const resolvePriorityLabel = (priority: string) =>
    REQUEST_PRIORITY_LABELS[priority as RequestPriority] ?? priority

const resolvePriorityTone = (
    priority: string,
): 'success' | 'warning' | 'danger' | 'info' | 'neutral' => {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
        URGENT: 'danger',
        HIGH: 'warning',
        MEDIUM: 'info',
        LOW: 'neutral',
    }
    return map[priority] ?? 'neutral'
}

// ── Actions ───────────────────────────────────────────────────────────────────

const selectTab = (key: TabKey) => {
    activeTab.value = key
    selectedId.value = ''
}

const goToCreateRequest = () => void router.push('/solicitudes/nueva')
const goToEditRequest = (id: string) => {
    if (id) void router.push(`/solicitudes/${id}/editar`)
}

const handleDeleteRequest = (id: string) => {
    console.log('delete', id)
}
const handleDuplicateRequest = (id: string) => {
    console.log('duplicate', id)
}
const handleAssignDesigner = (id: string) => {
    console.log('assign', id)
}
const handleSubmitToQuality = (id: string) => {
    console.log('submit quality', id)
}
const handleApproveRequest = (id: string) => {
    console.log('approve', id)
}
const handleRejectRequest = (id: string) => {
    console.log('reject', id)
}

onMounted(() => void hydrate())

useHead(() => ({
    title: 'RUASA ERP - Solicitudes',
    htmlAttrs: { lang: 'es' },
    bodyAttrs: { class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant' },
}))
</script>
