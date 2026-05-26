<template>
    <AppDataTable
        :columns="columns"
        :rows="rows"
        empty-description="No hay solicitudes que coincidan con los filtros aplicados."
        empty-title="Sin solicitudes para mostrar"
        row-key="id"
    >
        <template #cell-priority="{ value }">
            <AppStatusBadge :label="String(value)" :tone="resolvePriorityTone(String(value))" />
        </template>

        <template #cell-status="{ value }">
            <AppStatusBadge
                :label="resolveStatusLabel(String(value))"
                :tone="resolveStatusTone(String(value))"
            />
        </template>

        <template #cell-attachmentsCount="{ value }">
            <span
                class="inline-flex items-center gap-1 rounded-full border border-outline/20 bg-surface-container-low/20 px-2.5 py-1 text-xs font-semibold text-outline-variant"
            >
                <span class="material-symbols-outlined text-[15px]">attach_file</span>
                {{ value }}
            </span>
        </template>

        <template #cell-actions="{ rowKeyValue }">
            <div class="relative flex items-center justify-end" data-actions-menu>
                <button
                    class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline/20 text-outline-variant transition-colors hover:bg-surface-container-low/10 hover:text-white"
                    type="button"
                    title="Más acciones"
                    @click.stop="toggleActionsMenu(String(rowKeyValue))"
                >
                    <span class="material-symbols-outlined text-[20px]">more_vert</span>
                </button>

                <div
                    v-if="openActionsMenuRowId === String(rowKeyValue)"
                    class="absolute right-0 top-11 z-30 min-w-[210px] overflow-hidden rounded-xl border border-outline/30 bg-deep-navy shadow-xl"
                >
                    <button
                        class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-blue-200 transition-colors hover:bg-blue-500/15 hover:text-blue-100"
                        type="button"
                        @click="handleEdit(String(rowKeyValue))"
                    >
                        <span class="material-symbols-outlined text-[18px]">edit</span>
                        Editar solicitud
                    </button>
                    <button
                        v-if="props.canAssignDesigner && isAssignable(String(rowKeyValue))"
                        class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-sky-200 transition-colors hover:bg-sky-500/15 hover:text-sky-100"
                        type="button"
                        @click="handleAssign(String(rowKeyValue))"
                    >
                        <span class="material-symbols-outlined text-[18px]">person_add</span>
                        {{
                            isReassignable(String(rowKeyValue))
                                ? 'Reasignar diseñador'
                                : 'Asignar diseñador'
                        }}
                    </button>
                    <button
                        v-if="canSubmitRow(String(rowKeyValue))"
                        class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-amber-200 transition-colors hover:bg-amber-500/15 hover:text-amber-100"
                        type="button"
                        @click="handleSubmitToQuality(String(rowKeyValue))"
                    >
                        <span class="material-symbols-outlined text-[18px]">send</span>
                        Enviar a calidad
                    </button>
                    <button
                        v-if="canReviewRow(String(rowKeyValue))"
                        class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-emerald-200 transition-colors hover:bg-emerald-500/15 hover:text-emerald-100"
                        type="button"
                        @click="handleApprove(String(rowKeyValue))"
                    >
                        <span class="material-symbols-outlined text-[18px]">check_circle</span>
                        Aprobar
                    </button>
                    <button
                        v-if="canReviewRow(String(rowKeyValue))"
                        class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-rose-200 transition-colors hover:bg-rose-500/15 hover:text-rose-100"
                        type="button"
                        @click="handleReject(String(rowKeyValue))"
                    >
                        <span class="material-symbols-outlined text-[18px]">cancel</span>
                        Rechazar
                    </button>
                    <button
                        class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-emerald-200 transition-colors hover:bg-emerald-500/15 hover:text-emerald-100"
                        type="button"
                        @click="handleDuplicate(String(rowKeyValue))"
                    >
                        <span class="material-symbols-outlined text-[18px]">content_copy</span>
                        Duplicar solicitud
                    </button>
                    <button
                        class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-rose-200 transition-colors hover:bg-rose-500/15 hover:text-rose-100"
                        type="button"
                        @click="handleDelete(String(rowKeyValue))"
                    >
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                        Eliminar solicitud
                    </button>
                </div>
            </div>
        </template>
    </AppDataTable>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import AppDataTable from '~/presentation/shared/components/ui/AppDataTable.vue'
import AppStatusBadge from '~/presentation/shared/components/ui/AppStatusBadge.vue'
import type { AppDataTableColumn } from '~/presentation/interfaces/shared/ui/app-data-table.interface'
import type { DesignRequestTableRow } from '~/presentation/interfaces/requests/request-table-row.interface'
import {
    REQUEST_STATUS_LABELS,
    type RequestStatus,
} from '~/presentation/interfaces/requests/request.interface'

interface RequestsDataTableProps {
    rows: DesignRequestTableRow[]
    canAssignDesigner?: boolean
    canSubmitToQuality?: boolean
    canReviewQuality?: boolean
    currentDesignerId?: string | null
}

defineOptions({
    name: 'RequestsDataTable',
})

const props = withDefaults(defineProps<RequestsDataTableProps>(), {
    canAssignDesigner: false,
    canSubmitToQuality: false,
    canReviewQuality: false,
    currentDesignerId: null,
})

const emit = defineEmits<{
    editRequest: [requestId: string]
    duplicateRequest: [requestId: string]
    deleteRequest: [requestId: string]
    assignDesigner: [requestId: string]
    submitToQuality: [requestId: string]
    approveRequest: [requestId: string]
    rejectRequest: [requestId: string]
}>()

const openActionsMenuRowId = ref<string | null>(null)
let outsideClickHandler: ((event: MouseEvent) => void) | null = null

const columns: AppDataTableColumn[] = [
    { key: 'requestCode', label: 'Solicitud' },
    { key: 'clientName', label: 'Cliente' },
    { key: 'productName', label: 'Producto' },
    { key: 'materialType', label: 'Material' },
    { key: 'printTechnique', label: 'Técnica' },
    { key: 'priority', label: 'Prioridad', align: 'center' },
    { key: 'status', label: 'Estado', align: 'center' },
    { key: 'requiredDateLabel', label: 'Entrega solicitada' },
    { key: 'attachmentsCount', label: 'Adjuntos', align: 'center' },
    { key: 'requestedBy', label: 'Solicitado por' },
    {
        key: 'actions',
        label: 'Acciones',
        searchable: false,
        align: 'right',
        headerClassName: 'w-[50px]',
        cellClassName: 'w-[50px]',
    },
]

const toggleActionsMenu = (rowId: string) => {
    openActionsMenuRowId.value = openActionsMenuRowId.value === rowId ? null : rowId
}

const closeActionsMenu = () => {
    openActionsMenuRowId.value = null
}

const handleEdit = (rowId: string) => {
    emit('editRequest', rowId)
    closeActionsMenu()
}

const findRowStatus = (rowId: string) => {
    return props.rows.find((row) => row.id === rowId)?.status ?? ''
}

const isAssignable = (rowId: string) => {
    const status = findRowStatus(rowId)
    return status === 'PENDING_ASSIGNMENT' || status === 'ASSIGNED' || status === 'REJECTED'
}

const isReassignable = (rowId: string) => {
    return findRowStatus(rowId) === 'ASSIGNED'
}

const findRow = (rowId: string) => props.rows.find((row) => row.id === rowId) ?? null

const canSubmitRow = (rowId: string) => {
    if (!props.canSubmitToQuality) {
        return false
    }
    const row = findRow(rowId)
    if (!row) {
        return false
    }
    const assignableStatus = ['ASSIGNED', 'IN_DESIGN', 'REJECTED'].includes(row.status)
    const ownsRow = !props.currentDesignerId || row.assignedDesignerId === props.currentDesignerId
    return assignableStatus && ownsRow
}

const canReviewRow = (rowId: string) => {
    if (!props.canReviewQuality) {
        return false
    }
    return findRowStatus(rowId) === 'IN_QUALITY_REVIEW'
}

const handleAssign = (rowId: string) => {
    emit('assignDesigner', rowId)
    closeActionsMenu()
}

const handleSubmitToQuality = (rowId: string) => {
    emit('submitToQuality', rowId)
    closeActionsMenu()
}

const handleApprove = (rowId: string) => {
    emit('approveRequest', rowId)
    closeActionsMenu()
}

const handleReject = (rowId: string) => {
    emit('rejectRequest', rowId)
    closeActionsMenu()
}

const handleDuplicate = (rowId: string) => {
    emit('duplicateRequest', rowId)
    closeActionsMenu()
}

const handleDelete = (rowId: string) => {
    emit('deleteRequest', rowId)
    closeActionsMenu()
}

const resolveStatusLabel = (status: string) => {
    return REQUEST_STATUS_LABELS[status as RequestStatus] ?? status
}

const resolveStatusTone = (status: string) => {
    if (status === 'APPROVED') {
        return 'success'
    }

    if (status === 'REJECTED') {
        return 'danger'
    }

    if (status === 'IN_DESIGN' || status === 'ASSIGNED') {
        return 'warning'
    }

    if (status === 'IN_QUALITY_REVIEW') {
        return 'info'
    }

    return 'neutral'
}

const resolvePriorityTone = (priority: string) => {
    if (priority === 'Alta') {
        return 'danger'
    }

    if (priority === 'Media') {
        return 'warning'
    }

    return 'neutral'
}

onMounted(() => {
    outsideClickHandler = (event: MouseEvent) => {
        const target = event.target as HTMLElement | null

        if (!target) {
            return
        }

        if (target.closest('[data-actions-menu]')) {
            return
        }

        closeActionsMenu()
    }

    document.addEventListener('click', outsideClickHandler)
})

onUnmounted(() => {
    if (outsideClickHandler) {
        document.removeEventListener('click', outsideClickHandler)
    }
})
</script>
