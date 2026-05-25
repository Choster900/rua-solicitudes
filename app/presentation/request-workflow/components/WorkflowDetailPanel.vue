<template>
  <section
    v-if="request"
    class="space-y-4"
  >
    <article class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-4">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.12em] text-secondary-container">
            {{ request.requestCode }}
          </p>
          <h3 class="mt-1 text-lg font-semibold text-white">
            {{ request.productName }}
          </h3>
          <p class="mt-1 text-sm text-outline-variant">
            {{ request.clientName }} · {{ request.requestType }}
          </p>
        </div>
        <AppStatusBadge
          :label="stageLabel"
          :tone="stageTone"
        />
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <div class="rounded-xl border border-outline/20 bg-surface-container-low/10 px-3 py-2.5">
          <p class="text-[11px] uppercase tracking-[0.12em] text-outline-variant">
            Solicitado por
          </p>
          <p class="mt-1 text-sm font-semibold text-white">
            {{ request.requestedBy }}
          </p>
        </div>
        <div class="rounded-xl border border-outline/20 bg-surface-container-low/10 px-3 py-2.5">
          <p class="text-[11px] uppercase tracking-[0.12em] text-outline-variant">
            Vendedor
          </p>
          <p class="mt-1 text-sm font-semibold text-white">
            {{ request.vendorName }}
          </p>
        </div>
        <div class="rounded-xl border border-outline/20 bg-surface-container-low/10 px-3 py-2.5">
          <p class="text-[11px] uppercase tracking-[0.12em] text-outline-variant">
            Entrega solicitada
          </p>
          <p class="mt-1 text-sm font-semibold text-white">
            {{ formatDate(request.requiredDate) }}
          </p>
        </div>
        <div class="rounded-xl border border-outline/20 bg-surface-container-low/10 px-3 py-2.5">
          <p class="text-[11px] uppercase tracking-[0.12em] text-outline-variant">
            Evidencias
          </p>
          <p class="mt-1 text-sm font-semibold text-white">
            {{ request.evidenceFiles.length }} archivo{{ request.evidenceFiles.length === 1 ? '' : 's' }}
          </p>
        </div>
      </div>
    </article>

    <WorkflowChecklistPanel
      :checklist="request.checklist"
      :disabled="!editableChecklist"
      :error="checklistError"
      :labels="checklistLabels"
      @update:checklist="emit('updateChecklist', $event)"
    />

    <article class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-4">
      <h3 class="text-sm font-semibold text-white">
        Evidencia adjunta
      </h3>

      <ul class="mt-3 space-y-2">
        <li
          v-for="file in request.evidenceFiles"
          :key="file.id"
          class="flex items-center justify-between rounded-lg border border-outline/20 bg-surface-container-low/10 px-3 py-2"
        >
          <div>
            <p class="text-sm font-semibold text-white">
              {{ file.name }}
            </p>
            <p class="text-xs text-outline-variant">
              .{{ file.extension }} · {{ file.sizeKb }} KB
            </p>
          </div>
          <span class="material-symbols-outlined text-outline-variant">attach_file</span>
        </li>
      </ul>
    </article>

    <WorkflowObservationsPanel :observations="request.observations" />
    <WorkflowStageTimeline :audit-trail="request.auditTrail" />
  </section>

  <article
    v-else
    class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-6"
  >
    <h3 class="text-base font-semibold text-white">
      Selecciona una solicitud
    </h3>
    <p class="mt-1 text-sm text-outline-variant">
      Elige una solicitud de la bandeja para revisar su expediente, checklist y trazabilidad.
    </p>
  </article>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import AppStatusBadge from '~/presentation/shared/components/ui/AppStatusBadge.vue'
import type { AppStatusBadgeTone } from '~/presentation/interfaces/request-workflow/workflow-ui.type'
import type { WorkflowChecklistState, WorkflowRequest } from '~/presentation/interfaces/request-workflow/workflow-request.interface'
import WorkflowChecklistPanel from '~/presentation/request-workflow/components/WorkflowChecklistPanel.vue'
import WorkflowObservationsPanel from '~/presentation/request-workflow/components/WorkflowObservationsPanel.vue'
import WorkflowStageTimeline from '~/presentation/request-workflow/components/WorkflowStageTimeline.vue'

interface WorkflowDetailPanelProps {
  request: WorkflowRequest | null
  stageLabel: string
  stageTone: AppStatusBadgeTone
  checklistLabels: Record<keyof WorkflowChecklistState, string>
  editableChecklist?: boolean
  checklistError?: string
}

defineOptions({
  name: 'WorkflowDetailPanel',
})

withDefaults(defineProps<WorkflowDetailPanelProps>(), {
  editableChecklist: false,
  checklistError: '',
})

const emit = defineEmits<{
  updateChecklist: [value: WorkflowChecklistState]
}>()

const formatDate = (sourceDate: string) => {
  if (!sourceDate) {
    return 'Sin fecha'
  }

  const parsedDate = dayjs(sourceDate)

  if (!parsedDate.isValid()) {
    return 'Fecha inválida'
  }

  return new Intl.DateTimeFormat('es-SV', { dateStyle: 'medium' }).format(parsedDate.toDate())
}
</script>
