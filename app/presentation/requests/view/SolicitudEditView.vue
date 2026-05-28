<template>
    <AppShellLayout screen-title="Solicitudes">
        <section class="h-full">
            <div class="grid h-full gap-0 xl:grid-cols-[minmax(0,65%),minmax(0,35%)]">
                <!-- ── Formulario de edición ──────────────────────────── -->
                <article class="min-h-0 overflow-auto border-r border-outline/20 px-6 py-4">
                    <button
                        class="mb-4 inline-flex items-center gap-1 rounded-lg border border-outline/30 px-3 py-2 text-sm text-outline-variant transition-colors hover:bg-surface-container-low/10 hover:text-white"
                        type="button"
                        @click="goBackToRequests"
                    >
                        <span class="material-symbols-outlined text-[18px]">arrow_back</span>
                        Volver a solicitudes
                    </button>

                    <!-- Cargando -->
                    <div
                        v-if="isLoading"
                        class="flex items-center gap-3 py-12 text-outline-variant"
                    >
                        <span class="material-symbols-outlined animate-spin text-[22px]"
                            >progress_activity</span
                        >
                        Cargando solicitud...
                    </div>

                    <!-- No encontrada -->
                    <div
                        v-else-if="!request"
                        class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-6"
                    >
                        <h2 class="text-lg font-semibold text-white">Solicitud no encontrada</h2>
                        <p class="mt-1 text-sm text-outline-variant">
                            La solicitud que intentas ver no existe o fue eliminada.
                        </p>
                    </div>

                    <!-- Formulario -->
                    <RequestFormCard
                        v-else
                        mode="edit"
                        :model="requestFormModel!"
                        @cancel="goBackToRequests"
                        @submit="handleUpdateRequest"
                    />
                </article>

                <!-- ── Expediente / Detalle ───────────────────────────── -->
                <aside
                    class="-mr-6 -my-6 flex h-[calc(100%+3rem)] flex-col self-stretch border-l border-outline/20 bg-surface-container-lowest/5"
                >
                    <header class="border-b border-outline/20 px-4 py-4">
                        <h2 class="text-xl font-semibold text-slate-200">Expediente</h2>
                        <div class="mt-2 flex items-center gap-2">
                            <p
                                class="inline-flex w-fit rounded bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary-fixed-dim"
                            >
                                {{ request?.requestCode || 'SOL-0000-000' }}
                            </p>
                            <span
                                v-if="request"
                                class="inline-flex rounded bg-secondary-container/20 px-2 py-0.5 font-mono text-xs text-secondary-container"
                            >
                                v{{ request.versionNumber }}
                            </span>
                        </div>
                        <p class="mt-1 text-base text-slate-300">
                            {{ request?.clientName || '—' }}
                        </p>
                    </header>

                    <div v-if="request" class="min-h-0 flex-1 space-y-4 overflow-auto px-4 py-4">
                        <!-- Estado y prioridad -->
                        <section>
                            <div class="flex flex-wrap gap-2">
                                <span
                                    class="inline-flex rounded-md border px-3 py-1 text-xs font-semibold"
                                    :class="resolveStatusClass(request.status)"
                                >
                                    {{ resolveStatusLabel(request.status) }}
                                </span>
                                <span
                                    class="inline-flex rounded-md border px-3 py-1 text-xs font-semibold"
                                    :class="resolvePriorityClass(request.priority)"
                                >
                                    {{ resolvePriorityLabel(request.priority) }}
                                </span>
                            </div>
                        </section>

                        <!-- Detalles -->
                        <section class="border-t border-outline/20 pt-3">
                            <h3
                                class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Detalles
                            </h3>
                            <div class="grid gap-2 text-sm">
                                <div v-if="request.title">
                                    <p class="text-[10px] uppercase text-outline-variant">Título</p>
                                    <p class="text-slate-200">{{ request.title }}</p>
                                </div>
                                <div v-if="request.productName">
                                    <p class="text-[10px] uppercase text-outline-variant">
                                        Producto
                                    </p>
                                    <p class="text-slate-200">{{ request.productName }}</p>
                                </div>
                                <div v-if="request.requestedBy">
                                    <p class="text-[10px] uppercase text-outline-variant">
                                        Solicitado por
                                    </p>
                                    <p class="text-slate-200">{{ request.requestedBy }}</p>
                                </div>
                                <div v-if="request.requiredDate">
                                    <p class="text-[10px] uppercase text-outline-variant">
                                        Entrega solicitada
                                    </p>
                                    <p class="text-slate-200">
                                        {{ formatDate(request.requiredDate) }}
                                    </p>
                                </div>
                                <div v-if="request.createdAt">
                                    <p class="text-[10px] uppercase text-outline-variant">Creada</p>
                                    <p class="text-slate-200">
                                        {{ formatDate(request.createdAt) }}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <!-- Especificaciones -->
                        <section
                            v-if="request.materialType || request.dimensions"
                            class="border-t border-outline/20 pt-3"
                        >
                            <h3
                                class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Especificaciones
                            </h3>
                            <div class="grid gap-1 text-xs">
                                <div
                                    v-if="request.dimensions"
                                    class="flex justify-between border-b border-outline/15 pb-1"
                                >
                                    <span class="text-outline-variant">Dimensiones</span>
                                    <span class="font-medium text-white">{{
                                        request.dimensions
                                    }}</span>
                                </div>
                                <div
                                    v-if="request.quantity"
                                    class="flex justify-between border-b border-outline/15 pb-1"
                                >
                                    <span class="text-outline-variant">Cantidad</span>
                                    <span class="font-medium text-white">{{
                                        request.quantity.toLocaleString('es-SV')
                                    }}</span>
                                </div>
                                <div
                                    v-if="request.materialType"
                                    class="flex justify-between border-b border-outline/15 pb-1"
                                >
                                    <span class="text-outline-variant">Material / Flauta</span>
                                    <span class="font-medium text-white"
                                        >{{ request.materialType }} ·
                                        {{ request.fluteType || '—' }}</span
                                    >
                                </div>
                                <div
                                    v-if="request.colorMode"
                                    class="flex justify-between border-b border-outline/15 pb-1"
                                >
                                    <span class="text-outline-variant">Color</span>
                                    <span class="font-medium text-white">
                                        {{ request.colorMode }}
                                        <span
                                            v-if="request.pantoneReferences"
                                            class="text-outline-variant"
                                        >
                                            · {{ request.pantoneReferences }}</span
                                        >
                                    </span>
                                </div>
                                <div
                                    v-if="request.finishingOptions?.length"
                                    class="flex justify-between border-b border-outline/15 pb-1"
                                >
                                    <span class="text-outline-variant">Acabados</span>
                                    <span class="text-right font-medium text-white">{{
                                        request.finishingOptions.join(', ')
                                    }}</span>
                                </div>
                                <div class="flex justify-between border-b border-outline/15 pb-1">
                                    <span class="text-outline-variant">Troquel</span>
                                    <span
                                        :class="
                                            request.requireDieCut
                                                ? 'text-primary-fixed-dim'
                                                : 'text-outline-variant'
                                        "
                                    >
                                        {{ request.requireDieCut ? 'Sí' : 'No' }}
                                    </span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-outline-variant">Mockup</span>
                                    <span
                                        :class="
                                            request.requireMockup
                                                ? 'text-primary-fixed-dim'
                                                : 'text-outline-variant'
                                        "
                                    >
                                        {{ request.requireMockup ? 'Sí' : 'No' }}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <!-- Checklist diseño -->
                        <section class="border-t border-outline/20 pt-3">
                            <h3
                                class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Checklist diseño
                            </h3>
                            <div class="grid gap-1.5 text-xs">
                                <p
                                    class="flex items-center justify-between border-b border-outline/20 pb-1"
                                    :class="
                                        request.artCompleted
                                            ? 'text-emerald-200'
                                            : 'text-outline-variant'
                                    "
                                >
                                    <span>Arte</span>
                                    <span>{{ request.artCompleted ? '✓' : '—' }}</span>
                                </p>
                                <p
                                    class="flex items-center justify-between border-b border-outline/20 pb-1"
                                    :class="
                                        request.mechanicalCompleted
                                            ? 'text-emerald-200'
                                            : 'text-outline-variant'
                                    "
                                >
                                    <span>Mecánico</span>
                                    <span>{{ request.mechanicalCompleted ? '✓' : '—' }}</span>
                                </p>
                                <p
                                    class="flex items-center justify-between"
                                    :class="
                                        request.dummyCompleted
                                            ? 'text-emerald-200'
                                            : 'text-outline-variant'
                                    "
                                >
                                    <span>Dummy</span>
                                    <span>{{ request.dummyCompleted ? '✓' : '—' }}</span>
                                </p>
                            </div>
                        </section>

                        <!-- Diseñadores asignados -->
                        <section class="border-t border-outline/20 pt-3">
                            <h3
                                class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Diseñadores asignados
                            </h3>
                            <div
                                v-if="!request.assignedDesigners.length"
                                class="text-xs text-outline-variant"
                            >
                                Sin asignar
                            </div>
                            <ul v-else class="space-y-1">
                                <li
                                    v-for="d in request.assignedDesigners"
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

                        <!-- Instrucciones -->
                        <section
                            v-if="request.designInstructions"
                            class="border-t border-outline/20 pt-3"
                        >
                            <h3
                                class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Instrucciones
                            </h3>
                            <p
                                class="rounded-lg border border-outline/20 bg-surface-container-lowest/20 px-3 py-2 text-xs italic text-outline-variant"
                            >
                                {{ request.designInstructions }}
                            </p>
                        </section>

                        <!-- Archivos del vendedor -->
                        <section
                            v-if="request.sampleFiles?.length"
                            class="border-t border-outline/20 pt-3"
                        >
                            <h3
                                class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Archivos del vendedor ({{ request.sampleFiles.length }})
                            </h3>
                            <ul class="space-y-2">
                                <li
                                    v-for="f in request.sampleFiles"
                                    :key="f.id"
                                    class="overflow-hidden rounded-md border border-outline/20"
                                >
                                    <img
                                        v-if="f.mimeType.startsWith('image/')"
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

                        <!-- Archivos del diseñador -->
                        <section
                            v-if="request.attachments?.length"
                            class="border-t border-outline/20 pt-3"
                        >
                            <h3
                                class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Archivos del diseñador ({{ request.attachments.length }})
                            </h3>
                            <ul class="space-y-2">
                                <li
                                    v-for="f in request.attachments"
                                    :key="f.id"
                                    class="overflow-hidden rounded-md border border-outline/20"
                                >
                                    <img
                                        v-if="f.mimeType.startsWith('image/')"
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
                    </div>

                    <!-- Placeholder vacío -->
                    <div
                        v-else-if="!isLoading"
                        class="flex flex-1 flex-col items-center justify-center py-12 text-center"
                    >
                        <span class="material-symbols-outlined text-3xl text-outline-variant"
                            >article</span
                        >
                        <p class="mt-2 text-xs text-outline-variant">Solicitud no disponible.</p>
                    </div>
                </aside>
            </div>
        </section>
    </AppShellLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import RequestFormCard from '~/presentation/requests/components/RequestFormCard.vue'
import { useRequestsModule } from '~/presentation/requests/composables/useRequestsModule'
import { useApiClient } from '~/presentation/shared/composables/useApiClient'
import type {
    DesignRequest,
    RequestStatus,
    RequestPriority,
} from '~/presentation/interfaces/requests/request.interface'
import type { DesignRequestFormModel } from '~/presentation/interfaces/requests/request-form.interface'
import {
    REQUEST_STATUS_LABELS,
    REQUEST_PRIORITY_LABELS,
} from '~/presentation/interfaces/requests/request.interface'

defineOptions({ name: 'SolicitudEditView' })

const route = useRoute()
const router = useRouter()
const apiClient = useApiClient()
const { updateRequest } = useRequestsModule()

const requestId = computed(() => String(route.params.id ?? ''))
const request = ref<DesignRequest | null>(null)
const isLoading = ref(true)

const requestFormModel = computed<DesignRequestFormModel | null>(() => {
    if (!request.value) return null
    const r = request.value
    const parts = r.materialWeight?.split('/').map((s: string) => s.trim()) ?? []
    return {
        clientId: r.clientId,
        title: r.title,
        brandName: r.brandName,
        productName: r.productName,
        priority: r.priority,
        requiredDate: r.requiredDate ?? '',
        materialType: r.materialType,
        materialWeight: r.materialWeight,
        fluteType: r.fluteType,
        fluteDirection: r.fluteDirection,
        closureType: r.closureType,
        outerLiner: r.outerLiner,
        innerLiner: r.innerLiner,
        colorMode: r.colorMode,
        pantoneReferences: r.pantoneReferences,
        length: r.length?.toString() ?? '',
        width: r.width?.toString() ?? '',
        height: r.height?.toString() ?? '',
        dimensionUnit: 'cm',
        quantity: r.quantity?.toString() ?? '',
        finishingOptions: [...(r.finishingOptions ?? [])],
        deliverables: [...(r.deliverables ?? [])],
        designInstructions: r.designInstructions,
        requireDieCut: r.requireDieCut,
        requireMockup: r.requireMockup,
        sampleFiles: [],
    }
})

const formatDate = (iso: string | null) => {
    if (!iso) return '—'
    return new Intl.DateTimeFormat('es-SV', { dateStyle: 'medium' }).format(new Date(iso))
}

const STATUS_LABELS = REQUEST_STATUS_LABELS
const PRIORITY_LABELS = REQUEST_PRIORITY_LABELS

const resolveStatusLabel = (status: string) => STATUS_LABELS[status as RequestStatus] ?? status
const resolvePriorityLabel = (priority: string) =>
    PRIORITY_LABELS[priority as RequestPriority] ?? priority

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

const goBackToRequests = () => void router.push('/solicitudes')

const handleUpdateRequest = async (formModel: DesignRequestFormModel) => {
    if (!requestId.value) return
    const updated = await updateRequest(requestId.value, formModel)
    if (updated) {
        await loadRequest()
    }
}

const loadRequest = async () => {
    if (!requestId.value) return
    isLoading.value = true
    try {
        const response = await apiClient.get<DesignRequest>(`/requests/${requestId.value}`)
        request.value = response.data
    } catch {
        request.value = null
    } finally {
        isLoading.value = false
    }
}

onMounted(() => void loadRequest())

useHead(() => ({
    title: `RUASA ERP - ${request.value?.requestCode ?? 'Solicitud'}`,
    htmlAttrs: { lang: 'es' },
    bodyAttrs: { class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant' },
}))
</script>
