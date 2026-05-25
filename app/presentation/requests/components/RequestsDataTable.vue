<template>
  <AppDataTable
    :columns="columns"
    :rows="rows"
    empty-description="No hay solicitudes que coincidan con los filtros aplicados."
    empty-title="Sin solicitudes para mostrar"
    row-key="id"
  >
    <template #cell-priority="{ value }">
      <AppStatusBadge
        :label="String(value)"
        :tone="resolvePriorityTone(String(value))"
      />
    </template>

    <template #cell-status="{ value }">
      <AppStatusBadge
        :label="String(value)"
        :tone="resolveStatusTone(String(value))"
      />
    </template>

    <template #cell-attachmentsCount="{ value }">
      <span class="inline-flex items-center gap-1 rounded-full border border-outline/20 bg-surface-container-low/20 px-2.5 py-1 text-xs font-semibold text-outline-variant">
        <span class="material-symbols-outlined text-[15px]">attach_file</span>
        {{ value }}
      </span>
    </template>

    <template #cell-actions="{ rowKeyValue }">
      <div
        class="relative flex items-center justify-end"
        data-actions-menu
      >
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
            class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-amber-200 transition-colors hover:bg-amber-500/15 hover:text-amber-100"
            type="button"
            @click="handleSendToDesign(String(rowKeyValue))"
          >
            <span class="material-symbols-outlined text-[18px]">draw</span>
            Enviar a diseño
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

interface RequestsDataTableProps {
  rows: DesignRequestTableRow[]
}

defineOptions({
  name: 'RequestsDataTable',
})

defineProps<RequestsDataTableProps>()

const emit = defineEmits<{
  editRequest: [requestId: string]
  sendToDesign: [requestId: string]
  duplicateRequest: [requestId: string]
  deleteRequest: [requestId: string]
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

const handleSendToDesign = (rowId: string) => {
  emit('sendToDesign', rowId)
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

const resolveStatusTone = (status: string) => {
  if (status === 'Aprobada') {
    return 'success'
  }

  if (status === 'En diseño') {
    return 'warning'
  }

  if (status === 'En revisión') {
    return 'neutral'
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
