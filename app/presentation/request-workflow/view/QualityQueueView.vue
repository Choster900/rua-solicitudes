<template>
    <AppShellLayout screen-title="Bandeja Calidad">
        <section
            class="grid min-h-0 grid-cols-1 gap-3 lg:min-h-[calc(100vh-112px)] lg:grid-cols-[65%_35%]"
        >
            <!-- Lista de solicitudes -->
            <div class="space-y-3">
                <header class="flex items-start justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-semibold leading-tight text-white">
                            Revisiones de Calidad
                        </h1>
                        <p class="mt-1 text-sm text-outline-variant">
                            {{ qualityRows.length }} solicitudes en revisión
                        </p>
                    </div>
                </header>

                <article
                    class="overflow-hidden rounded-xl border border-outline/20 bg-surface-container-lowest/5"
                >
                    <div class="overflow-x-auto">
                        <header
                            class="grid min-w-[480px] grid-cols-[28%_36%_18%_18%] border-b border-outline/20 bg-surface-container-low/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-secondary-container"
                        >
                            <p>ID Solicitud</p>
                            <p>Cliente / Producto</p>
                            <p>Prioridad</p>
                            <p>Estado</p>
                        </header>

                        <div v-if="displayRows.length" class="divide-y divide-outline/15">
                            <template v-for="row in displayRows" :key="row.id">
                                <button
                                    class="grid w-full min-w-[480px] grid-cols-[28%_36%_18%_18%] items-center px-3 py-2.5 text-left transition-colors hover:bg-surface-container-low/20"
                                    :class="
                                        selectedRequestId === row.id
                                            ? 'border-l-2 border-primary bg-primary/10'
                                            : ''
                                    "
                                    type="button"
                                    @click="openRequestDetail(row.id)"
                                >
                                    <div>
                                        <p
                                            class="font-mono text-sm font-semibold text-primary-fixed"
                                        >
                                            {{ row.requestCode }}
                                        </p>
                                        <span
                                            class="mt-0.5 inline-block rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] text-primary-fixed-dim"
                                        >
                                            v{{ row.versionNumber }}
                                        </span>
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium leading-tight text-white">
                                            {{ row.clientName }}
                                        </p>
                                        <p class="text-xs leading-tight text-outline-variant">
                                            {{ row.productName }}
                                        </p>
                                    </div>
                                    <span
                                        class="inline-flex w-fit rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
                                        :class="priorityChipClass(row.id)"
                                    >
                                        {{ row.priorityLabel }}
                                    </span>
                                    <span
                                        class="inline-flex w-fit rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] border-primary/35 bg-primary/10 text-primary-fixed-dim"
                                    >
                                        En revisión
                                    </span>
                                </button>
                            </template>
                        </div>

                        <div v-else class="px-3 py-8 text-center text-xs text-outline-variant">
                            No hay solicitudes en revisión de calidad.
                        </div>
                    </div>
                </article>
            </div>

            <!-- Panel de detalle -->
            <aside
                class="flex h-full flex-col overflow-hidden rounded-xl border border-outline/20 bg-surface-container-lowest/5"
            >
                <header class="border-b border-outline/20 px-4 py-3">
                    <div class="flex items-center gap-2">
                        <p
                            class="inline-flex w-fit rounded bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary-fixed-dim"
                        >
                            {{ selectedFullRequest?.requestCode ?? 'SOL-0000-000' }}
                        </p>
                        <span
                            v-if="selectedFullRequest"
                            class="inline-flex rounded bg-secondary-container/20 px-2 py-0.5 font-mono text-xs text-secondary-container"
                        >
                            v{{ selectedFullRequest.versionNumber }}
                        </span>
                    </div>
                    <h2 class="mt-1 text-base font-semibold text-white">
                        {{ selectedFullRequest?.clientName ?? 'Selecciona una solicitud' }}
                    </h2>
                    <p class="text-xs text-outline-variant">
                        {{ selectedFullRequest?.productName ?? '' }}
                    </p>
                </header>

                <div v-if="selectedFullRequest" class="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                    <!-- Especificaciones -->
                    <section>
                        <h3
                            class="mb-2 text-[10px] uppercase tracking-[0.12em] text-secondary-container"
                        >
                            Especificaciones
                        </h3>
                        <div class="grid gap-1 text-xs">
                            <div class="flex justify-between border-b border-outline/15 pb-1">
                                <span class="text-outline-variant">Dimensiones</span>
                                <span class="font-medium text-white">{{
                                    selectedFullRequest.dimensions
                                }}</span>
                            </div>
                            <div class="flex justify-between border-b border-outline/15 pb-1">
                                <span class="text-outline-variant">Cantidad</span>
                                <span class="font-medium text-white">{{
                                    selectedFullRequest.quantity.toLocaleString('es-SV')
                                }}</span>
                            </div>
                            <div class="flex justify-between border-b border-outline/15 pb-1">
                                <span class="text-outline-variant">Material</span>
                                <span class="font-medium text-white"
                                    >{{ selectedFullRequest.materialType }} ·
                                    {{ selectedFullRequest.materialWeight }}</span
                                >
                            </div>
                            <div class="flex justify-between border-b border-outline/15 pb-1">
                                <span class="text-outline-variant">Técnica</span>
                                <span class="font-medium text-white">{{
                                    selectedFullRequest.printTechnique
                                }}</span>
                            </div>
                            <div class="flex justify-between border-b border-outline/15 pb-1">
                                <span class="text-outline-variant">Color</span>
                                <span class="font-medium text-white">
                                    {{ selectedFullRequest.colorMode }}
                                    <span
                                        v-if="selectedFullRequest.pantoneReferences"
                                        class="text-outline-variant"
                                    >
                                        · {{ selectedFullRequest.pantoneReferences }}</span
                                    >
                                </span>
                            </div>
                            <div
                                v-if="selectedFullRequest.finishingOptions.length"
                                class="flex justify-between border-b border-outline/15 pb-1"
                            >
                                <span class="text-outline-variant">Acabados</span>
                                <span class="font-medium text-white text-right">{{
                                    selectedFullRequest.finishingOptions.join(', ')
                                }}</span>
                            </div>
                            <div class="flex justify-between border-b border-outline/15 pb-1">
                                <span class="text-outline-variant">Troquel</span>
                                <span
                                    :class="
                                        selectedFullRequest.requireDieCut
                                            ? 'text-primary-fixed-dim'
                                            : 'text-outline-variant'
                                    "
                                >
                                    {{ selectedFullRequest.requireDieCut ? 'Sí' : 'No' }}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-outline-variant">Mockup</span>
                                <span
                                    :class="
                                        selectedFullRequest.requireMockup
                                            ? 'text-primary-fixed-dim'
                                            : 'text-outline-variant'
                                    "
                                >
                                    {{ selectedFullRequest.requireMockup ? 'Sí' : 'No' }}
                                </span>
                            </div>
                        </div>
                    </section>

                    <!-- Instrucciones -->
                    <section v-if="selectedFullRequest.designInstructions">
                        <h3
                            class="mb-2 text-[10px] uppercase tracking-[0.12em] text-secondary-container"
                        >
                            Instrucciones de Diseño
                        </h3>
                        <p
                            class="rounded-lg border border-outline/20 bg-surface-container-lowest/20 px-3 py-2 text-xs italic text-outline-variant"
                        >
                            {{ selectedFullRequest.designInstructions }}
                        </p>
                    </section>

                    <!-- Diseñadores asignados -->
                    <section v-if="selectedFullRequest.assignedDesigners.length">
                        <h3
                            class="mb-2 text-[10px] uppercase tracking-[0.12em] text-secondary-container"
                        >
                            Diseñadores Asignados
                        </h3>
                        <div class="flex flex-wrap gap-1">
                            <span
                                v-for="d in selectedFullRequest.assignedDesigners"
                                :key="d.designerId"
                                class="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] text-primary-fixed-dim"
                            >
                                {{ d.designerName }}
                            </span>
                        </div>
                    </section>

                    <!-- Archivos del vendedor -->
                    <section v-if="selectedFullRequest.sampleFiles?.length">
                        <h3
                            class="mb-2 text-[10px] uppercase tracking-[0.12em] text-secondary-container"
                        >
                            Archivos del vendedor ({{ selectedFullRequest.sampleFiles.length }})
                        </h3>
                        <ul class="space-y-2">
                            <li
                                v-for="f in selectedFullRequest.sampleFiles"
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
                    <section v-if="selectedFullRequest.attachments?.length">
                        <h3
                            class="mb-2 text-[10px] uppercase tracking-[0.12em] text-secondary-container"
                        >
                            Archivos del diseñador ({{ selectedFullRequest.attachments.length }})
                        </h3>
                        <ul class="space-y-2">
                            <li
                                v-for="f in selectedFullRequest.attachments"
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

                    <!-- Checklist -->
                    <section>
                        <h3
                            class="mb-2 text-[10px] uppercase tracking-[0.12em] text-secondary-container"
                        >
                            Checklist de Validación
                        </h3>
                        <div class="space-y-1.5">
                            <article
                                v-for="item in checklistRows"
                                :key="item.label"
                                class="flex cursor-pointer items-center justify-between rounded-md bg-surface-container-low/30 px-2 py-1.5"
                                @click="toggleChecklist(item.key)"
                            >
                                <p class="inline-flex items-center gap-1.5 text-xs text-white">
                                    <span
                                        class="inline-block h-2.5 w-2.5 rounded-full"
                                        :class="item.dotClass"
                                    />
                                    {{ item.label }}
                                </p>
                                <span
                                    class="rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em]"
                                    :class="item.statusClass"
                                >
                                    {{ item.status }}
                                </span>
                            </article>
                        </div>
                    </section>

                    <!-- Observaciones -->
                    <section>
                        <h3
                            class="mb-2 text-[10px] uppercase tracking-[0.12em] text-secondary-container"
                        >
                            Observaciones
                        </h3>
                        <textarea
                            v-model="qualityObservation"
                            class="h-20 w-full rounded-lg border border-outline/25 bg-surface-container-low/10 px-2.5 py-2 text-xs text-white outline-none placeholder:text-outline-variant focus:border-primary/60"
                            placeholder="Comentarios para el equipo de diseño..."
                        />
                    </section>
                </div>

                <div
                    v-else
                    class="flex flex-1 items-center justify-center text-xs text-outline-variant"
                >
                    Selecciona una solicitud para ver el detalle.
                </div>

                <!-- Acciones -->
                <footer
                    v-if="selectedFullRequest?.status === 'SENT_TO_QUALITY'"
                    class="grid grid-cols-2 gap-2 border-t border-outline/20 px-4 py-3"
                >
                    <AppButton
                        icon="cancel"
                        size="md"
                        variant="danger"
                        @click="rejectModalOpen = true"
                    >
                        Rechazar
                    </AppButton>
                    <AppButton
                        icon="task_alt"
                        size="md"
                        variant="primary"
                        @click="approveModalOpen = true"
                    >
                        Aprobar
                    </AppButton>
                </footer>
            </aside>
        </section>

        <WorkflowDecisionModal
            confirm-label="Aprobar"
            description="La solicitud será marcada como aprobada y notificada al equipo."
            :open="approveModalOpen"
            title="Aprobar solicitud"
            @close="approveModalOpen = false"
            @confirm="handleApprove"
        />

        <WorkflowDecisionModal
            confirm-label="Rechazar"
            confirm-tone="danger"
            description="La solicitud volverá al equipo de diseño. La observación es obligatoria."
            :open="rejectModalOpen"
            :require-comment="true"
            title="Rechazar solicitud"
            @close="rejectModalOpen = false"
            @confirm="handleReject"
        />
    </AppShellLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'
import WorkflowDecisionModal from '~/presentation/request-workflow/components/WorkflowDecisionModal.vue'
import { useRequestWorkflowModule } from '~/presentation/request-workflow/composables/useRequestWorkflowModule'
import { useRequestsModule } from '~/presentation/requests/composables/useRequestsModule'
import type { WorkflowChecklistState } from '~/presentation/interfaces/request-workflow/workflow-request.interface'

defineOptions({
    name: 'QualityQueueView',
})

const { workflowStore, qualityQueue, qualityRows } = useRequestWorkflowModule()
const { findRequestById, approveQualityReview, rejectQualityReview, hydrateRequests } =
    useRequestsModule()

const selectedRequestId = ref('')
const approveModalOpen = ref(false)
const rejectModalOpen = ref(false)
const qualityObservation = ref('')

const activeChecklist = ref<WorkflowChecklistState>({
    briefValidated: false,
    technicalSpecsValidated: false,
    assetsValidated: false,
    legalValidated: false,
})

const selectedFullRequest = computed(() => {
    if (!selectedRequestId.value) return null
    return findRequestById(selectedRequestId.value)
})

const openRequestDetail = (requestId: string) => {
    selectedRequestId.value = requestId
    qualityObservation.value = ''
    const wfRequest = workflowStore.requestById(requestId)
    if (wfRequest) {
        activeChecklist.value = { ...wfRequest.checklist }
    }
}

const toggleChecklist = (key: keyof WorkflowChecklistState) => {
    activeChecklist.value = {
        ...activeChecklist.value,
        [key]: !activeChecklist.value[key],
    }
}

const handleApprove = async (comment: string) => {
    approveModalOpen.value = false
    if (!selectedRequestId.value) return
    const ok = await approveQualityReview(selectedRequestId.value, comment)
    if (ok) selectedRequestId.value = ''
}

const handleReject = async (comment: string) => {
    rejectModalOpen.value = false
    if (!selectedRequestId.value) return
    const ok = await rejectQualityReview(selectedRequestId.value, comment)
    if (ok) selectedRequestId.value = ''
}

const displayRows = computed(() => qualityRows.value)

const priorityChipClass = (requestId: string) => {
    const wfRequest = workflowStore.requestById(requestId)
    if (!wfRequest) return 'border-outline/30 text-outline-variant'
    if (wfRequest.priority === 'HIGH') return 'border-rose-500/35 bg-rose-500/10 text-rose-200'
    if (wfRequest.priority === 'MEDIUM') return 'border-amber-500/35 bg-amber-500/10 text-amber-200'
    return 'border-outline/30 bg-surface-container-lowest/20 text-outline-variant'
}

const checklistRows = computed(() => {
    const source = activeChecklist.value

    const toItem = (label: string, key: keyof WorkflowChecklistState, done: boolean) => ({
        key,
        label,
        status: done ? 'OK' : 'Pendiente',
        dotClass: done ? 'bg-emerald-400' : 'bg-amber-300',
        statusClass: done ? 'bg-emerald-500/20 text-emerald-200' : 'bg-amber-500/20 text-amber-200',
    })

    return [
        toItem('Brief validado', 'briefValidated', source.briefValidated),
        toItem(
            'Especificaciones técnicas',
            'technicalSpecsValidated',
            source.technicalSpecsValidated,
        ),
        toItem('Assets y archivos fuente', 'assetsValidated', source.assetsValidated),
        toItem('Revisión legal / etiquetas', 'legalValidated', source.legalValidated),
    ]
})

onMounted(async () => {
    await Promise.all([workflowStore.hydrate(), hydrateRequests()])
    const first = qualityQueue.value[0]
    if (first) openRequestDetail(first.id)
})

useHead(() => ({
    title: 'RUASA ERP - Bandeja Calidad',
    htmlAttrs: { lang: 'es' },
    bodyAttrs: { class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant' },
}))
</script>
