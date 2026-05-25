<template>
  <article class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-4">
    <h3 class="text-sm font-semibold text-white">
      Trazabilidad
    </h3>

    <div class="relative mt-3 pl-5">
      <span class="pointer-events-none absolute bottom-2 left-[7px] top-2 w-px bg-outline/30" />

      <ol class="space-y-3">
        <li
          v-for="entry in auditTrail"
          :key="entry.id"
          class="relative rounded-lg border border-outline/20 bg-surface-container-low/10 px-3 py-2.5"
        >
          <span class="absolute -left-[19px] top-3 h-3 w-3 rounded-full border border-sky-300/60 bg-sky-200 shadow-[0_0_0_3px_rgba(11,17,32,0.95)]" />

          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="text-xs font-semibold text-white">
              {{ entry.action }}
            </p>
            <span class="text-[11px] text-outline-variant">
              {{ formatDateTime(entry.createdAt) }}
            </span>
          </div>
          <p class="mt-1 text-[11px] text-outline-variant">
            {{ entry.actorName }} · {{ entry.actorRole }}
          </p>
          <p class="mt-1 text-xs text-outline-variant">
            {{ entry.comment }}
          </p>
        </li>
      </ol>
    </div>
  </article>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { WorkflowAuditEntry } from '~/presentation/interfaces/request-workflow/workflow-request.interface'

interface WorkflowStageTimelineProps {
  auditTrail: WorkflowAuditEntry[]
}

defineOptions({
  name: 'WorkflowStageTimeline',
})

defineProps<WorkflowStageTimelineProps>()

const formatDateTime = (value: string) => {
  const parsedDate = dayjs(value)

  if (!parsedDate.isValid()) {
    return 'Fecha inválida'
  }

  return new Intl.DateTimeFormat('es-SV', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate.toDate())
}
</script>
