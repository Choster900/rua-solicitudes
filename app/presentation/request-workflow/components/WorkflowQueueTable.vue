<template>
  <AppDataTable
    :columns="columns"
    :row-clickable="true"
    :rows="rows"
    :selected-row-key="selectedRequestId"
    empty-description="No hay solicitudes en esta bandeja con los filtros actuales."
    empty-title="Sin solicitudes"
    row-key="id"
    @row-click="handleRowClick"
  >
    <template #cell-requestCode="{ row }">
      <button
        class="inline-flex items-center gap-1 rounded-md px-1.5 py-1 font-semibold text-sky-200"
        type="button"
        @click.stop="handleView(String(row.id))"
      >
        <span class="material-symbols-outlined text-[16px]">open_in_new</span>
        {{ row.requestCode }}
      </button>
    </template>

    <template #cell-priorityLabel="{ row }">
      <AppStatusBadge
        :label="String(row.priorityLabel)"
        :tone="resolvePriorityToneByRow(String(row.id))"
      />
    </template>

    <template #cell-stageLabel="{ row }">
      <AppStatusBadge
        :label="String(row.stageLabel)"
        :tone="resolveStageToneByRow(String(row.id))"
      />
    </template>

    <template #cell-slaLabel="{ value }">
      <span
        class="rounded-full border px-2.5 py-1 text-[11px] font-semibold"
        :class="String(value) === 'Vencido'
          ? 'border-rose-400/40 bg-rose-500/15 text-rose-200'
          : 'border-sky-400/40 bg-sky-500/15 text-sky-200'"
      >
        {{ value }}
      </span>
    </template>
  </AppDataTable>
</template>

<script setup lang="ts">
import AppDataTable from '~/presentation/shared/components/ui/AppDataTable.vue'
import AppStatusBadge from '~/presentation/shared/components/ui/AppStatusBadge.vue'
import type { AppDataTableColumn } from '~/presentation/shared/interfaces/ui/app-data-table.interface'
import type { WorkflowQueueRow } from '~/presentation/request-workflow/interfaces/workflow-queue-row.interface'
import type { AppStatusBadgeTone } from '~/presentation/request-workflow/interfaces/workflow-ui.type'
import type { WorkflowPriority, WorkflowStage } from '~/presentation/request-workflow/interfaces/workflow-request.interface'

interface WorkflowQueueTableProps {
  rows: WorkflowQueueRow[]
  selectedRequestId?: string
  requestStageById: Record<string, WorkflowStage>
  requestPriorityById: Record<string, WorkflowPriority>
  stageToneMap: Record<WorkflowStage, AppStatusBadgeTone>
  priorityToneMap: Record<WorkflowPriority, AppStatusBadgeTone>
}

defineOptions({
  name: 'WorkflowQueueTable',
})

const props = withDefaults(defineProps<WorkflowQueueTableProps>(), {
  selectedRequestId: '',
})

const emit = defineEmits<{
  view: [requestId: string]
}>()

const columns: AppDataTableColumn[] = [
  { key: 'requestCode', label: 'Solicitud' },
  { key: 'clientName', label: 'Cliente' },
  { key: 'productName', label: 'Producto' },
  { key: 'requestType', label: 'Tipo' },
  { key: 'requestedBy', label: 'Solicita' },
  { key: 'priorityLabel', label: 'Prioridad', align: 'center' },
  { key: 'stageLabel', label: 'Etapa', align: 'center' },
  { key: 'requiredDateLabel', label: 'Entrega' },
  { key: 'slaLabel', label: 'SLA', align: 'center' },
  { key: 'observationsCount', label: 'Obs.', align: 'center' },
]

const handleView = (requestId: string) => {
  emit('view', requestId)
}

const handleRowClick = (payload: { row: object, rowKeyValue: string | number }) => {
  handleView(String(payload.rowKeyValue))
}

const resolveStageToneByRow = (requestId: string): AppStatusBadgeTone => {
  const stage = props.requestStageById[requestId]

  if (!stage) {
    return 'neutral'
  }

  return props.stageToneMap[stage]
}

const resolvePriorityToneByRow = (requestId: string): AppStatusBadgeTone => {
  const priority = props.requestPriorityById[requestId]

  if (!priority) {
    return 'neutral'
  }

  return props.priorityToneMap[priority]
}
</script>
