<template>
    <AppShellLayout screen-title="Bandeja Diseño">
        <section class="space-y-5">
            <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <article
                    class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3"
                >
                    <p class="text-xs uppercase tracking-[0.12em] text-outline-variant">Artes</p>
                    <p class="mt-1 text-3xl font-semibold text-white">{{ artsCount }}</p>
                </article>
                <article
                    class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3"
                >
                    <p class="text-xs uppercase tracking-[0.12em] text-outline-variant">Dummies</p>
                    <p class="mt-1 text-3xl font-semibold text-white">{{ dummiesCount }}</p>
                </article>
                <article
                    class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3"
                >
                    <p class="text-xs uppercase tracking-[0.12em] text-outline-variant">
                        Mecánicos
                    </p>
                    <p class="mt-1 text-3xl font-semibold text-white">{{ mechanicsCount }}</p>
                </article>
                <article
                    class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3"
                >
                    <p class="text-xs uppercase tracking-[0.12em] text-outline-variant">
                        Pendientes Calidad
                    </p>
                    <p class="mt-1 text-3xl font-semibold text-white">{{ pendingQualityCount }}</p>
                </article>
            </div>

            <article
                class="overflow-hidden rounded-xl border border-outline/20 bg-surface-container-lowest/5"
            >
                <header
                    class="flex items-center justify-between border-b border-outline/20 px-4 py-3"
                >
                    <h2 class="text-xs uppercase tracking-[0.12em] text-secondary-container">
                        Solicitudes en Proceso
                    </h2>
                    <AppButton size="sm" variant="ghost" @click="triggerImport">
                        Filtros
                    </AppButton>
                </header>

                <div class="px-4 py-3">
                    <RequestsDataTable
                        :can-assign-designer="isDesignLead()"
                        :can-review-quality="isQuality()"
                        :can-submit-to-quality="isDesigner() || isDesignLead()"
                        :current-designer-id="sessionUser?.id ?? null"
                        :rows="tableRows"
                        @approve-request="handleApprove"
                        @assign-designer="openAssignModal"
                        @duplicate-request="duplicateRequest"
                        @edit-request="goToEditRequest"
                        @reject-request="openRejectModal"
                        @submit-to-quality="handleSubmitToQuality"
                    />
                </div>
            </article>

            <div class="flex items-center justify-between">
                <h3 class="text-3xl font-semibold text-white">
                    Expediente de Solicitud:
                    <span class="text-amber-300">{{
                        selectedRow?.requestCode || 'SOL-0000-000'
                    }}</span>
                </h3>
                <AppButton
                    icon="print"
                    icon-position="left"
                    size="md"
                    variant="ghost"
                    @click="exportRequests"
                >
                    Imprimir Expediente
                </AppButton>
            </div>

            <section class="grid gap-4 xl:grid-cols-3">
                <article
                    class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 p-4"
                >
                    <h4 class="mb-3 text-xs uppercase tracking-[0.12em] text-secondary-container">
                        Historial de Comentarios
                    </h4>
                    <ol class="relative space-y-3 pl-5">
                        <span
                            class="pointer-events-none absolute bottom-2 left-[7px] top-2 w-px bg-white/70"
                        />
                        <li class="relative">
                            <span
                                class="absolute -left-5 top-2 h-3 w-3 rounded-full bg-primary ring-2 ring-deep-navy"
                            />
                            <article
                                class="rounded-lg border border-outline/20 bg-surface-container-lowest/25 p-3 text-sm text-outline-variant"
                            >
                                <p class="font-semibold text-white">Ing. Carlos Ruiz</p>
                                <p
                                    class="text-[11px] uppercase tracking-[0.08em] text-primary-fixed-dim"
                                >
                                    24/05/2024 · 10:30 AM
                                </p>
                                <p class="mt-1">
                                    Revisión de material aprobada. Proceder con el arte final.
                                </p>
                            </article>
                        </li>
                        <li class="relative">
                            <span
                                class="absolute -left-5 top-2 h-3 w-3 rounded-full bg-white/70 ring-2 ring-deep-navy"
                            />
                            <article
                                class="rounded-lg border border-outline/20 bg-surface-container-lowest/25 p-3 text-sm text-outline-variant"
                            >
                                <p class="font-semibold text-white">Arq. Sofía Méndez</p>
                                <p
                                    class="text-[11px] uppercase tracking-[0.08em] text-primary-fixed-dim"
                                >
                                    23/05/2024 · 04:15 PM
                                </p>
                                <p class="mt-1">
                                    Se requiere confirmación del acabado para impresión.
                                </p>
                            </article>
                        </li>
                    </ol>
                </article>

                <article
                    class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 p-4"
                >
                    <h4 class="mb-3 text-xs uppercase tracking-[0.12em] text-secondary-container">
                        Verificaciones de Calidad
                    </h4>
                    <ol class="relative space-y-3 pl-5">
                        <span
                            class="pointer-events-none absolute bottom-2 left-[7px] top-2 w-px bg-white/70"
                        />
                        <li class="relative">
                            <span
                                class="absolute -left-5 top-2 h-3 w-3 rounded-full bg-emerald-300 ring-2 ring-deep-navy"
                            />
                            <article
                                class="flex items-center justify-between rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-3 text-[0.95rem] text-emerald-200"
                            >
                                <span class="inline-flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px]"
                                        >straighten</span
                                    >
                                    <span>Validación de Medidas</span>
                                </span>
                                <span class="text-xs font-semibold uppercase tracking-[0.08em]"
                                    >Aprobado</span
                                >
                            </article>
                        </li>
                        <li class="relative">
                            <span
                                class="absolute -left-5 top-2 h-3 w-3 rounded-full bg-emerald-300 ring-2 ring-deep-navy"
                            />
                            <article
                                class="flex items-center justify-between rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-3 text-[0.95rem] text-emerald-200"
                            >
                                <span class="inline-flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px]"
                                        >layers</span
                                    >
                                    <span>Gramaje de Sustrato</span>
                                </span>
                                <span class="text-xs font-semibold uppercase tracking-[0.08em]"
                                    >Aprobado</span
                                >
                            </article>
                        </li>
                        <li class="relative">
                            <span
                                class="absolute -left-5 top-2 h-3 w-3 rounded-full bg-amber-300 ring-2 ring-deep-navy"
                            />
                            <article
                                class="flex items-center justify-between rounded-lg border border-amber-500/35 bg-amber-500/10 px-3.5 py-3 text-[0.95rem] text-amber-200"
                            >
                                <span class="inline-flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px]"
                                        >palette</span
                                    >
                                    <span>Prueba de Color CMYK</span>
                                </span>
                                <span class="text-xs font-semibold uppercase tracking-[0.08em]"
                                    >Pendiente</span
                                >
                            </article>
                        </li>
                    </ol>
                </article>

                <article
                    class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 p-4"
                >
                    <h4 class="mb-3 text-xs uppercase tracking-[0.12em] text-secondary-container">
                        Trazabilidad del Proceso
                    </h4>
                    <ol class="space-y-5">
                        <li class="relative flex gap-3">
                            <div class="relative flex w-10 shrink-0 justify-center">
                                <span
                                    class="z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
                                    >1</span
                                >
                                <span class="absolute top-8 h-[56px] w-px bg-primary/30" />
                            </div>
                            <div class="pt-0.5">
                                <p class="font-semibold text-white">Solicitud Creada</p>
                                <p class="text-xs text-outline-variant">
                                    20/05/2024 - Sistema Central
                                </p>
                                <p class="mt-1 text-sm text-outline-variant">
                                    Ingreso manual por Depto. ventas.
                                </p>
                            </div>
                        </li>

                        <li class="relative flex gap-3">
                            <div class="relative flex w-10 shrink-0 justify-center">
                                <span
                                    class="z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
                                    >2</span
                                >
                                <span class="absolute top-8 h-[56px] w-px bg-primary/30" />
                            </div>
                            <div class="pt-0.5">
                                <p class="font-semibold text-white">Asignación a Diseño</p>
                                <p class="text-xs text-outline-variant">
                                    21/05/2024 - Ing. Carlos Ruiz
                                </p>
                                <p class="mt-1 text-sm text-outline-variant">
                                    Asignado a Equipo de Artes Finales.
                                </p>
                            </div>
                        </li>

                        <li class="relative flex gap-3">
                            <div class="relative flex w-10 shrink-0 justify-center">
                                <span
                                    class="z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-sm font-semibold text-white"
                                    >3</span
                                >
                            </div>
                            <div class="pt-0.5">
                                <p class="font-semibold text-white">En Desarrollo</p>
                                <p class="text-xs uppercase tracking-[0.08em] text-amber-300">
                                    Proceso actual
                                </p>
                                <p class="mt-1 text-sm text-outline-variant">
                                    Fase de maquetación y dummie físico.
                                </p>
                            </div>
                        </li>
                    </ol>
                </article>
            </section>

            <input
                ref="importInputRef"
                accept=".csv,.xlsx,.xls"
                class="hidden"
                type="file"
                @change="handleImportSelection"
            />

            <AssignDesignerModal
                ref="assignModalRef"
                :initial-designer-id="assignRequestSnapshot?.assignedDesignerId ?? null"
                :open="isAssignModalOpen"
                :request-code="assignRequestSnapshot?.requestCode ?? ''"
                @close="closeAssignModal"
                @confirm="confirmAssignment"
            />

            <WorkflowDecisionModal
                confirm-label="Aprobar solicitud"
                confirm-tone="primary"
                :description="`Confirma la aprobación de calidad${reviewModalTitleSuffix}.`"
                :open="isApproveModalOpen"
                title="Aprobar en calidad"
                @close="closeApproveModal"
                @confirm="confirmApprove"
            />

            <WorkflowDecisionModal
                confirm-label="Rechazar y crear nueva versión"
                confirm-tone="danger"
                :description="`Indica el motivo de rechazo${reviewModalTitleSuffix}. Se creará una nueva versión y volverá al diseñador.`"
                :open="isRejectModalOpen"
                require-comment
                title="Rechazar en calidad"
                @close="closeRejectModal"
                @confirm="confirmReject"
            />
        </section>
    </AppShellLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'
import AssignDesignerModal from '~/presentation/requests/components/AssignDesignerModal.vue'
import RequestsDataTable from '~/presentation/requests/components/RequestsDataTable.vue'
import WorkflowDecisionModal from '~/presentation/request-workflow/components/WorkflowDecisionModal.vue'
import { useRequestsModule } from '~/presentation/requests/composables/useRequestsModule'
import { useSessionUser } from '~/presentation/shared/composables/useSessionUser'

defineOptions({
    name: 'DesignQueueView',
})

const router = useRouter()
const {
    importInputRef,
    pendingAssignmentRequests,
    inDesignRequests,
    highPriorityRequests,
    tableRows,
    triggerImport,
    handleImportSelection,
    exportRequests,
    hydrateRequests,
    assignDesigner,
    submitToQuality,
    approveRequest,
    rejectRequest,
    duplicateRequest,
    findRequestById,
} = useRequestsModule()

const { sessionUser, hydrateSession, isDesignLead, isDesigner, isQuality } = useSessionUser()

const selectedRow = computed(() => tableRows.value[0] ?? null)

const artsCount = computed(() => inDesignRequests.value)
const dummiesCount = computed(() => pendingAssignmentRequests.value)
const mechanicsCount = computed(() => highPriorityRequests.value)
const pendingQualityCount = computed(
    () => tableRows.value.filter((row) => row.status !== 'APPROVED').length,
)

const goToEditRequest = (requestId: string) => {
    void router.push(`/solicitudes/${requestId}/editar`)
}

const assignModalRef = ref<InstanceType<typeof AssignDesignerModal> | null>(null)
const isAssignModalOpen = ref(false)
const assignRequestId = ref<string>('')
const assignRequestSnapshot = computed(() =>
    assignRequestId.value ? findRequestById(assignRequestId.value) : null,
)

const openAssignModal = (requestId: string) => {
    assignRequestId.value = requestId
    isAssignModalOpen.value = true
}

const closeAssignModal = () => {
    isAssignModalOpen.value = false
    assignRequestId.value = ''
    assignModalRef.value?.resetSubmitting()
}

const confirmAssignment = async (designerId: string) => {
    if (!assignRequestId.value) {
        closeAssignModal()
        return
    }

    const succeeded = await assignDesigner(assignRequestId.value, designerId)
    assignModalRef.value?.resetSubmitting()

    if (succeeded) {
        closeAssignModal()
    }
}

const isApproveModalOpen = ref(false)
const isRejectModalOpen = ref(false)
const reviewRequestId = ref<string>('')
const reviewRequestSnapshot = computed(() =>
    reviewRequestId.value ? findRequestById(reviewRequestId.value) : null,
)
const reviewModalTitleSuffix = computed(() =>
    reviewRequestSnapshot.value ? ` · ${reviewRequestSnapshot.value.requestCode}` : '',
)

const handleSubmitToQuality = async (requestId: string) => {
    await submitToQuality(requestId)
}

const handleApprove = (requestId: string) => {
    reviewRequestId.value = requestId
    isApproveModalOpen.value = true
}

const closeApproveModal = () => {
    isApproveModalOpen.value = false
    reviewRequestId.value = ''
}

const confirmApprove = async (comment: string) => {
    if (!reviewRequestId.value) {
        closeApproveModal()
        return
    }
    const succeeded = await approveRequest(reviewRequestId.value, comment)
    if (succeeded) {
        closeApproveModal()
    }
}

const openRejectModal = (requestId: string) => {
    reviewRequestId.value = requestId
    isRejectModalOpen.value = true
}

const closeRejectModal = () => {
    isRejectModalOpen.value = false
    reviewRequestId.value = ''
}

const confirmReject = async (comment: string) => {
    if (!reviewRequestId.value) {
        closeRejectModal()
        return
    }
    const succeeded = await rejectRequest(reviewRequestId.value, comment, '')
    if (succeeded) {
        closeRejectModal()
    }
}

onMounted(() => {
    void hydrateSession()
    void hydrateRequests()
})

useHead(() => ({
    title: 'RUASA ERP - Bandeja Diseño',
    htmlAttrs: {
        lang: 'es',
    },
    bodyAttrs: {
        class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
    },
}))
</script>
