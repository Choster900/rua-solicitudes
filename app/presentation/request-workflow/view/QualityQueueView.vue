<template>
    <AppShellLayout screen-title="Bandeja Calidad">
        <section class="grid min-h-[calc(100vh-112px)] grid-cols-1 gap-4 xl:grid-cols-[70%_30%]">
            <div class="space-y-4">
                <header class="flex items-start justify-between gap-4">
                    <div>
                        <h1 class="text-4xl font-semibold leading-tight text-white">
                            Bandeja de Revisiones Técnicas
                        </h1>
                        <p class="mt-1 max-w-xl text-2xl text-outline-variant">
                            Validación de artes y especificaciones industriales.
                        </p>
                    </div>

                    <AppButton
                        icon="filter_alt"
                        size="md"
                        variant="ghost"
                        @click="workflowStore.setQualityFilters({ priority: 'ALL', query: '' })"
                    >
                        Filtrar
                    </AppButton>
                </header>

                <article
                    class="overflow-hidden rounded-xl border border-outline/20 bg-surface-container-lowest/5"
                >
                    <header
                        class="grid grid-cols-[24%_32%_18%_26%] border-b border-outline/20 bg-surface-container-low/20 px-4 py-2 text-xs uppercase tracking-[0.12em] text-secondary-container"
                    >
                        <p>ID Solicitud</p>
                        <p>Cliente / Producto</p>
                        <p>Estado</p>
                        <p>Acciones</p>
                    </header>

                    <div v-if="displayRows.length" class="divide-y divide-outline/15">
                        <template v-for="row in displayRows" :key="row.id">
                            <button
                                class="grid w-full grid-cols-[24%_32%_18%_26%] items-center px-4 py-4 text-left transition-colors hover:bg-surface-container-low/20"
                                :class="
                                    selectedRequestId === row.id
                                        ? 'border-l-2 border-primary bg-primary/10'
                                        : ''
                                "
                                type="button"
                                @click="openRequestDetail(row.id)"
                            >
                                <p class="text-2xl font-semibold text-primary-fixed">
                                    {{ row.requestCode }}
                                </p>
                                <div>
                                    <p class="text-4xl leading-tight text-white">
                                        {{ row.clientName }}
                                    </p>
                                    <p class="text-3xl leading-tight text-outline-variant">
                                        {{ row.productName }}
                                    </p>
                                </div>
                                <div>
                                    <span
                                        class="inline-flex rounded-md border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
                                        :class="stageChipClass(row.id)"
                                    >
                                        {{ stageChipLabel(row.id) }}
                                    </span>
                                </div>
                                <div class="flex justify-end">
                                    <span class="material-symbols-outlined text-primary">
                                        {{
                                            expandedRowId === row.id ? 'expand_less' : 'expand_more'
                                        }}
                                    </span>
                                </div>
                            </button>

                            <section
                                v-if="expandedRowId === row.id && selectedRequest"
                                class="grid gap-4 border-t border-outline/10 bg-surface-container-lowest/20 px-4 py-4 lg:grid-cols-[40%_60%]"
                            >
                                <div>
                                    <h3
                                        class="mb-3 text-xs uppercase tracking-[0.12em] text-secondary-container"
                                    >
                                        Checklist de validación
                                    </h3>
                                    <div
                                        class="space-y-2 rounded-lg border border-outline/15 bg-surface-container-lowest/20 p-2.5"
                                    >
                                        <article
                                            v-for="item in checklistRows"
                                            :key="item.label"
                                            class="flex items-center justify-between rounded-md bg-surface-container-low/30 px-2.5 py-2"
                                        >
                                            <p
                                                class="inline-flex items-center gap-2 text-sm text-white"
                                            >
                                                <span
                                                    class="inline-block h-2.5 w-2.5 rounded-full"
                                                    :class="item.dotClass"
                                                />
                                                {{ item.label }}
                                            </p>
                                            <span
                                                class="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
                                                :class="item.statusClass"
                                            >
                                                {{ item.status }}
                                            </span>
                                        </article>
                                    </div>
                                </div>

                                <div>
                                    <h3
                                        class="mb-3 text-xs uppercase tracking-[0.12em] text-secondary-container"
                                    >
                                        Observaciones técnicas
                                    </h3>
                                    <textarea
                                        v-model="qualityObservation"
                                        class="h-[130px] w-full rounded-lg border border-outline/25 bg-surface-container-low/35 px-3 py-2 text-sm text-white outline-none placeholder:text-outline-variant focus:border-primary/60"
                                        placeholder="Añadir comentarios específicos para los puntos de validación..."
                                    />

                                    <div class="mt-3 flex flex-wrap justify-end gap-2">
                                        <AppButton
                                            v-if="selectedRequest.stage === 'QUALITY_IN_REVIEW'"
                                            icon="cancel"
                                            size="md"
                                            variant="danger"
                                            @click="rejectModalOpen = true"
                                        >
                                            Rechazar con observaciones
                                        </AppButton>

                                        <AppButton
                                            v-if="selectedRequest.stage === 'READY_FOR_QUALITY'"
                                            icon="fact_check"
                                            size="md"
                                            variant="secondary"
                                            @click="handleStartQualityReview"
                                        >
                                            Iniciar revisión
                                        </AppButton>

                                        <AppButton
                                            v-if="selectedRequest.stage === 'QUALITY_IN_REVIEW'"
                                            icon="task_alt"
                                            size="md"
                                            variant="primary"
                                            @click="approveModalOpen = true"
                                        >
                                            Aprobar revisión
                                        </AppButton>
                                    </div>
                                </div>
                            </section>
                        </template>
                    </div>

                    <div v-else class="px-4 py-8 text-center text-sm text-outline-variant">
                        No hay solicitudes en calidad con los filtros actuales.
                    </div>
                </article>
            </div>

            <aside
                class="flex h-full flex-col overflow-hidden rounded-xl border border-outline/20 bg-surface-container-low/35"
            >
                <header class="border-b border-outline/20 px-4 py-4">
                    <h2 class="inline-flex items-center gap-2 text-3xl font-semibold text-white">
                        <span class="material-symbols-outlined text-[18px] text-primary"
                            >confirmation_number</span
                        >
                        Centro de Casos Consultados
                    </h2>
                    <p class="mt-1 text-sm text-outline-variant">
                        Tickets de preventa y factibilidad técnica.
                    </p>
                </header>

                <div class="flex-1 space-y-1 overflow-y-auto py-0">
                    <article
                        v-for="(ticket, index) in consultedCases"
                        :key="ticket.code"
                        class="border-l-2 px-4 py-4 transition-colors"
                        :class="
                            index === 0
                                ? 'border-primary bg-primary/10'
                                : 'border-transparent hover:bg-surface-container-lowest/20'
                        "
                    >
                        <div class="flex items-start justify-between gap-2">
                            <p class="text-sm font-semibold tracking-[0.04em] text-primary-fixed">
                                {{ ticket.code }}
                            </p>
                            <span
                                class="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
                                :class="ticket.statusClass"
                            >
                                {{ ticket.status }}
                            </span>
                        </div>
                        <p class="mt-2 text-4xl leading-tight text-white">
                            {{ ticket.title }}
                        </p>
                        <div
                            class="mt-2 flex items-center justify-between text-xs text-outline-variant"
                        >
                            <p class="inline-flex items-center gap-1">
                                <span class="material-symbols-outlined text-[14px]">person</span>
                                {{ ticket.owner }}
                            </p>
                            <p class="uppercase tracking-[0.08em]">
                                {{ ticket.area }}
                            </p>
                        </div>
                    </article>
                </div>

                <footer class="border-t border-outline/20 p-4">
                    <button
                        class="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-outline/25 bg-surface-container-lowest/20 px-4 py-2.5 text-sm text-white transition-colors hover:bg-surface-container-lowest/35"
                        type="button"
                    >
                        <span class="material-symbols-outlined text-[16px]">history</span>
                        Ver Historial de Casos
                    </button>
                </footer>
            </aside>
        </section>

        <WorkflowDecisionModal
            confirm-label="Aprobar"
            description="Puedes agregar un comentario opcional para dejar constancia de la aprobación."
            :open="approveModalOpen"
            title="Aprobar solicitud"
            @close="approveModalOpen = false"
            @confirm="handleApprove"
        />

        <WorkflowDecisionModal
            confirm-label="Rechazar"
            confirm-tone="danger"
            description="La observación es obligatoria y la solicitud volverá a Diseño."
            :open="rejectModalOpen"
            :require-comment="true"
            title="Rechazar solicitud"
            @close="rejectModalOpen = false"
            @confirm="handleReject"
        />
    </AppShellLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'
import WorkflowDecisionModal from '~/presentation/request-workflow/components/WorkflowDecisionModal.vue'
import { useRequestWorkflowModule } from '~/presentation/request-workflow/composables/useRequestWorkflowModule'
import type { WorkflowChecklistState } from '~/presentation/interfaces/request-workflow/workflow-request.interface'

defineOptions({
    name: 'QualityQueueView',
})

const { workflowStore, qualityQueue, qualityRows, notifyActionResult } = useRequestWorkflowModule()

const selectedRequestId = ref('')
const expandedRowId = ref('')
const approveModalOpen = ref(false)
const rejectModalOpen = ref(false)
const qualityObservation = ref('')

const activeChecklist = ref<WorkflowChecklistState>({
    briefValidated: false,
    technicalSpecsValidated: false,
    assetsValidated: false,
    legalValidated: false,
})

const selectedRequest = computed(() => {
    if (!selectedRequestId.value) {
        return null
    }

    return workflowStore.requestById(selectedRequestId.value)
})

const stageByRequestId = computed(() => {
    const map: Record<
        string,
        | 'NEW'
        | 'DESIGN_IN_PROGRESS'
        | 'READY_FOR_QUALITY'
        | 'QUALITY_IN_REVIEW'
        | 'REJECTED_BY_QUALITY'
        | 'APPROVED'
    > = {}

    workflowStore.allRequests.forEach((request) => {
        map[request.id] = request.stage
    })

    return map
})

const syncChecklistFromRequest = () => {
    if (!selectedRequest.value) {
        return
    }

    activeChecklist.value = {
        ...selectedRequest.value.checklist,
    }
}

const openRequestDetail = (requestId: string) => {
    selectedRequestId.value = requestId
    expandedRowId.value = expandedRowId.value === requestId ? '' : requestId
    syncChecklistFromRequest()
}

const handleStartQualityReview = () => {
    if (!selectedRequest.value) {
        return
    }

    const result = workflowStore.startQualityReview(selectedRequest.value.id)
    notifyActionResult(result)
}

const handleApprove = (comment: string) => {
    approveModalOpen.value = false

    if (!selectedRequest.value) {
        return
    }

    const result = workflowStore.approveInQuality(
        selectedRequest.value.id,
        'Equipo Calidad',
        comment,
    )
    notifyActionResult(result)
}

const handleReject = (comment: string) => {
    rejectModalOpen.value = false

    if (!selectedRequest.value) {
        return
    }

    const result = workflowStore.rejectInQuality(
        selectedRequest.value.id,
        comment,
        'Equipo Calidad',
    )
    notifyActionResult(result)
}

const displayRows = computed(() => qualityRows.value.slice(0, 6))

const stageChipLabel = (requestId: string) => {
    const stage = stageByRequestId.value[requestId]

    if (stage === 'READY_FOR_QUALITY') {
        return 'Pendiente'
    }

    if (stage === 'QUALITY_IN_REVIEW') {
        return 'En proceso'
    }

    return 'Revisión'
}

const stageChipClass = (requestId: string) => {
    const stage = stageByRequestId.value[requestId]

    if (stage === 'READY_FOR_QUALITY') {
        return 'border-amber-500/35 bg-amber-500/10 text-amber-200'
    }

    if (stage === 'QUALITY_IN_REVIEW') {
        return 'border-primary/35 bg-primary/10 text-primary-fixed-dim'
    }

    return 'border-outline/30 bg-surface-container-lowest/20 text-outline-variant'
}

const checklistRows = computed(() => {
    const source = activeChecklist.value
    const allOk = Object.values(source).every(Boolean)

    const toItem = (label: string, done: boolean, pendingText = 'Revisando') => {
        if (done) {
            return {
                label,
                status: 'OK',
                dotClass: 'bg-emerald-400',
                statusClass: 'bg-emerald-500/20 text-emerald-200',
            }
        }

        return {
            label,
            status: pendingText,
            dotClass: 'bg-amber-300',
            statusClass: 'bg-amber-500/20 text-amber-200',
        }
    }

    return [
        toItem('Validación de Medidas', source.briefValidated),
        toItem('Gramaje de Sustrato', source.technicalSpecsValidated),
        toItem('Verificación de Dummie', source.assetsValidated),
        source.legalValidated
            ? toItem('Verificación de Mecánico', true)
            : {
                  label: 'Verificación de Mecánico',
                  status: 'Ajuste req.',
                  dotClass: 'bg-rose-400',
                  statusClass: 'bg-rose-500/20 text-rose-200',
              },
        toItem('Prueba de Color', source.technicalSpecsValidated, 'Revisando'),
        toItem('Datos Generales', allOk),
    ]
})

const consultedCases = computed(() => {
    return displayRows.value.slice(0, 3).map((row, index) => ({
        code: `CASE-${row.requestCode.replace('SOL-', '')}`,
        title: row.clientName.toUpperCase(),
        owner: row.requestedBy,
        area: index === 0 ? 'Producción' : index === 1 ? 'Materiales' : 'Diseño',
        status: index === 0 ? 'Abierto' : index === 1 ? 'Urgente' : 'Resuelto',
        statusClass:
            index === 0
                ? 'bg-primary/20 text-primary-fixed'
                : index === 1
                  ? 'bg-amber-500/20 text-amber-200'
                  : 'bg-emerald-500/20 text-emerald-200',
    }))
})

onMounted(async () => {
    await workflowStore.hydrate()

    const firstRequest = qualityQueue.value[0]

    if (firstRequest) {
        selectedRequestId.value = firstRequest.id
        expandedRowId.value = firstRequest.id
        syncChecklistFromRequest()
    }
})

useHead(() => ({
    title: 'RUASA ERP - Bandeja Calidad',
    htmlAttrs: {
        lang: 'es',
    },
    bodyAttrs: {
        class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
    },
}))
</script>
