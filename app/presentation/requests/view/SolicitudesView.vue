<template>
    <AppShellLayout screen-title="Solicitudes">
        <section class="h-full">
            <div class="grid h-full gap-4 xl:grid-cols-[minmax(0,70%),minmax(0,30%)]">
                <article class="min-h-0 border-r border-outline/20 pr-0 xl:pr-0">
                    <header
                        class="flex flex-wrap items-start justify-between gap-4 border-b border-outline/20 px-4 py-4"
                    >
                        <div>
                            <h1 class="text-[1.8rem] font-headline-md font-semibold text-white">
                                {{ isVendedor ? 'Mis Solicitudes' : 'Historial General' }}
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
                                icon="print"
                                icon-position="left"
                                size="md"
                                variant="primary"
                                @click="exportRequests"
                            >
                                Imprimir Todo
                            </AppButton>
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

                    <!-- Tabs para vendedor -->
                    <div v-if="isVendedor" class="flex gap-1 border-b border-outline/20 px-4 pt-3">
                        <button
                            v-for="tab in vendedorTabs"
                            :key="tab.key"
                            :class="[
                                'flex items-center gap-1.5 rounded-t-lg px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors',
                                activeTab === tab.key
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-outline-variant hover:text-white',
                            ]"
                            type="button"
                            @click="activeTab = tab.key"
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
                            @delete-request="removeRequest"
                            @duplicate-request="duplicateRequest"
                            @edit-request="goToEditRequest"
                            @reject-request="openRejectModal"
                            @submit-to-quality="handleSubmitToQuality"
                        />
                    </div>
                </article>

                <aside
                    class="-mr-6 -my-6 flex h-[calc(100%+3rem)] flex-col self-stretch border-l border-outline/20 bg-surface-container-lowest/5"
                >
                    <header class="border-b border-outline/20 px-4 py-4">
                        <h2 class="text-xl font-semibold text-slate-200">Expediente Histórico</h2>
                        <div class="mt-2 grid gap-1.5">
                            <p
                                class="inline-flex w-fit rounded bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary-fixed-dim"
                            >
                                {{ selectedRow?.requestCode || 'SOL-0000-000' }}
                            </p>
                            <p class="text-base text-slate-300">
                                {{ selectedRow?.clientName || 'Cliente sin seleccionar' }}
                            </p>
                        </div>
                    </header>

                    <div class="min-h-0 flex-1 space-y-4 overflow-auto px-4 py-4">
                        <section>
                            <h3
                                class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Registro de Cambios
                            </h3>
                            <ol class="relative space-y-2.5">
                                <span
                                    class="pointer-events-none absolute bottom-1 left-[4px] top-1 w-px bg-white/70"
                                />
                                <li class="relative flex gap-2.5">
                                    <span
                                        class="relative z-10 mt-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-[#152A40]"
                                    />
                                    <div>
                                        <p class="text-sm text-slate-200">Cierre de Solicitud</p>
                                        <p class="text-xs text-outline-variant">
                                            Por:
                                            <span class="text-primary-fixed-dim">Admin_User</span>
                                        </p>
                                        <p
                                            class="text-[10px] uppercase tracking-[0.08em] text-outline-variant"
                                        >
                                            20 NOV 2023 · 14:30
                                        </p>
                                    </div>
                                </li>
                                <li class="relative flex gap-2.5">
                                    <span
                                        class="relative z-10 mt-1 h-2.5 w-2.5 rounded-full bg-white/70 ring-2 ring-[#152A40]"
                                    />
                                    <div>
                                        <p class="text-sm text-slate-300">
                                            Aprobación de Control de Calidad
                                        </p>
                                        <p class="text-xs text-outline-variant">
                                            Por:
                                            <span class="text-primary-fixed-dim"
                                                >C_Lead_Carlos</span
                                            >
                                        </p>
                                    </div>
                                </li>
                                <li class="relative flex gap-2.5">
                                    <span
                                        class="relative z-10 mt-1 h-2.5 w-2.5 rounded-full bg-white/70 ring-2 ring-[#152A40]"
                                    />
                                    <div>
                                        <p class="text-sm text-slate-300">
                                            Actualización de Arte Final v2.1
                                        </p>
                                        <p class="text-xs text-outline-variant">
                                            Por:
                                            <span class="text-primary-fixed-dim"
                                                >Design_Unit_04</span
                                            >
                                        </p>
                                    </div>
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3
                                class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Verificación de Calidad
                            </h3>
                            <article
                                class="mb-3 overflow-hidden rounded-lg border border-outline/25 bg-surface-container-lowest/25 p-2"
                            >
                                <div
                                    class="mb-1 text-[10px] uppercase tracking-[0.08em] text-outline-variant"
                                >
                                    ÚLTIMO ARTE REALIZADO
                                </div>
                                <div
                                    class="flex h-28 items-center justify-center rounded-md border border-outline/20 bg-[#0D1E2E]/75"
                                >
                                    <span
                                        class="material-symbols-outlined text-2xl text-outline-variant"
                                        >image</span
                                    >
                                </div>
                            </article>
                            <div class="grid gap-1.5 text-xs">
                                <p
                                    class="flex items-center justify-between border-b border-outline/20 pb-1 text-outline-variant"
                                >
                                    <span>Medidas</span>
                                    <span class="text-emerald-300">✓</span>
                                </p>
                                <p
                                    class="flex items-center justify-between border-b border-outline/20 pb-1 text-outline-variant"
                                >
                                    <span>Sustrato</span>
                                    <span class="text-emerald-300">✓</span>
                                </p>
                                <p
                                    class="flex items-center justify-between border-b border-outline/20 pb-1 text-outline-variant"
                                >
                                    <span>Dummie</span>
                                    <span class="text-emerald-300">✓</span>
                                </p>
                                <p class="flex items-center justify-between text-outline-variant">
                                    <span>Mecánico</span>
                                    <span class="text-emerald-300">✓</span>
                                </p>
                            </div>
                        </section>

                        <section>
                            <h3
                                class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Historial de Comentarios
                            </h3>
                            <article
                                class="rounded-lg border border-outline/25 bg-surface-container-lowest/25 p-2.5"
                            >
                                <p
                                    class="text-[10px] uppercase tracking-[0.08em] text-primary-fixed-dim"
                                >
                                    QC_Lead_Carlos · 19 NOV
                                </p>
                                <p class="mt-1 text-xs italic text-outline-variant">
                                    Se validaron las dimensiones del panel frontal. Todo cumple con
                                    la normativa ISO-9001.
                                </p>
                            </article>
                        </section>
                    </div>

                    <footer class="grid grid-cols-2 gap-2 border-t border-outline/20 px-4 py-3">
                        <AppButton size="md" variant="ghost" @click="triggerImport">
                            Ver Archivos
                        </AppButton>
                        <AppButton
                            icon="download"
                            icon-position="left"
                            size="md"
                            variant="primary"
                            @click="exportRequests"
                        >
                            Exportar PDF
                        </AppButton>
                    </footer>
                </aside>
            </div>

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
                :description="`Confirma la aprobación de calidad${reviewModalTitleSuffix}. Puedes agregar un comentario opcional.`"
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
import RequestsDataTable from '~/presentation/requests/components/RequestsDataTable.vue'
import AssignDesignerModal from '~/presentation/requests/components/AssignDesignerModal.vue'
import WorkflowDecisionModal from '~/presentation/request-workflow/components/WorkflowDecisionModal.vue'
import { useRequestsModule } from '~/presentation/requests/composables/useRequestsModule'
import { useSessionUser } from '~/presentation/shared/composables/useSessionUser'

defineOptions({
    name: 'SolicitudesView',
})

const router = useRouter()
const {
    importInputRef,
    isVendedor,
    totalRequests,
    tableRows,
    pendingAssignmentRows,
    completedRows,
    removeRequest,
    duplicateRequest,
    assignDesigner,
    submitToQuality,
    approveRequest,
    rejectRequest,
    findRequestById,
    triggerImport,
    handleImportSelection,
    exportRequests,
    hydrateRequests,
} = useRequestsModule()

const { sessionUser, hydrateSession, isDesignLead, isDesigner, isQuality } = useSessionUser()

type VendedorTab = 'pending' | 'completed'
const activeTab = ref<VendedorTab>('pending')

const vendedorTabs = computed(() => [
    {
        key: 'pending' as VendedorTab,
        label: 'Sin Asignar',
        count: pendingAssignmentRows.value.length,
    },
    { key: 'completed' as VendedorTab, label: 'Completadas', count: completedRows.value.length },
])

const activeRows = computed(() => {
    if (!isVendedor.value) return tableRows.value
    return activeTab.value === 'pending' ? pendingAssignmentRows.value : completedRows.value
})

const selectedRow = computed(() => activeRows.value[0] ?? null)

const goToCreateRequest = () => {
    void router.push('/solicitudes/nueva')
}

const goToEditRequest = (requestId: string) => {
    void router.push(`/solicitudes/${requestId}/editar`)
}

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
    title: 'RUASA ERP - Solicitudes',
    htmlAttrs: {
        lang: 'es',
    },
    bodyAttrs: {
        class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
    },
}))
</script>
