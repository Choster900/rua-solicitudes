<template>
  <section class="grid gap-4 xl:grid-cols-[minmax(0,1fr),auto]">
    <article class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-5 shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.16em] text-secondary-container">
            Trámites Operativos
          </p>
          <h1 class="mt-1 text-2xl font-headline-md font-semibold text-white">
            {{ title }}
          </h1>
          <p class="mt-1 text-sm text-outline-variant">
            {{ description }}
          </p>
        </div>

        <div class="grid gap-2 sm:grid-cols-2">
          <AppTextField
            :model-value="query"
            icon="search"
            label="Buscar"
            @update:model-value="$emit('update:query', $event)"
          />

          <div class="space-y-1.5">
            <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
              Prioridad
            </label>
            <AppSelect
              :model-value="priority"
              :options="priorityOptions"
              :searchable="false"
              @update:model-value="handlePriorityChange"
            />
          </div>
        </div>
      </div>
    </article>

    <article class="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:w-[560px]">
      <WorkflowKpiCard
        label="Pendientes diseño"
        :value="metrics.designPending"
        tone="warning"
      />
      <WorkflowKpiCard
        label="Pendientes calidad"
        :value="metrics.qualityPending"
        tone="warning"
      />
      <WorkflowKpiCard
        label="Aprobadas"
        :value="metrics.approved"
        tone="success"
      />
      <WorkflowKpiCard
        label="Vencidas SLA"
        :value="metrics.overdue"
        tone="danger"
      />
      <WorkflowKpiCard
        class="col-span-2 sm:col-span-1"
        label="Total"
        :value="metrics.total"
      />
    </article>
  </section>
</template>

<script setup lang="ts">
import AppSelect from '~/presentation/shared/components/ui/AppSelect.vue'
import AppTextField from '~/presentation/shared/components/ui/AppTextField.vue'
import WorkflowKpiCard from '~/presentation/request-workflow/components/WorkflowKpiCard.vue'
import type { WorkflowPriority } from '~/presentation/request-workflow/interfaces/workflow-request.interface'

interface WorkflowQueueToolbarProps {
  title: string
  description: string
  query: string
  priority: 'ALL' | WorkflowPriority
  priorityOptions: Array<{ label: string, value: string }>
  metrics: {
    total: number
    designPending: number
    qualityPending: number
    approved: number
    overdue: number
  }
}

defineOptions({
  name: 'WorkflowQueueToolbar',
})

defineProps<WorkflowQueueToolbarProps>()

const emit = defineEmits<{
  'update:query': [value: string]
  'update:priority': [value: 'ALL' | WorkflowPriority]
}>()

const handlePriorityChange = (value: string | number | (string | number)[] | null) => {
  if (typeof value !== 'string') {
    return
  }

  emit('update:priority', value as 'ALL' | WorkflowPriority)
}
</script>
