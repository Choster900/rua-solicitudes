<template>
  <AppShellLayout screen-title="Bandeja Calidad">
    <section class="space-y-5">
      <WorkflowQueueToolbar
        description="Realiza control final de arte y define aprobación o devolución a Diseño."
        :metrics="metrics"
        :priority="qualityFilters.priority"
        :priority-options="priorityOptions"
        :query="qualityFilters.query"
        title="Bandeja Calidad"
        @update:priority="workflowStore.setQualityFilters({ priority: $event })"
        @update:query="workflowStore.setQualityFilters({ query: $event })"
      />

      <div class="grid gap-4 xl:grid-cols-[60%_minmax(0,1fr)]">
        <WorkflowQueueTable
          :priority-tone-map="priorityToneMap"
          :request-priority-by-id="priorityByRequestId"
          :request-stage-by-id="stageByRequestId"
          :rows="qualityRows"
          :selected-request-id="selectedRequestId"
          :stage-tone-map="stageToneMap"
          @view="openRequestDetail"
        />

        <section class="space-y-4">
          <WorkflowDetailPanel
            :checklist="activeChecklist"
            :checklist-labels="checklistFieldLabels"
            :request="selectedRequest"
            :stage-label="selectedRequest ? stageLabelMap[selectedRequest.stage] : 'Sin selección'"
            :stage-tone="selectedRequest ? stageToneMap[selectedRequest.stage] : 'neutral'"
          />

          <article
            v-if="selectedRequest"
            class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-4"
          >
            <h3 class="text-sm font-semibold text-white">
              Decisión de calidad
            </h3>
            <p class="mt-1 text-xs text-outline-variant">
              Etapa actual: {{ stageLabelMap[selectedRequest.stage] }}
            </p>

            <div class="mt-3 grid gap-2">
              <AppButton
                icon="open_in_new"
                variant="ghost"
                @click="goToWorkflowDetail"
              >
                Abrir detalle completo
              </AppButton>

              <AppButton
                v-if="selectedRequest.stage === 'READY_FOR_QUALITY'"
                icon="fact_check"
                variant="secondary"
                @click="handleStartQualityReview"
              >
                Iniciar revisión de calidad
              </AppButton>

              <AppButton
                v-if="selectedRequest.stage === 'QUALITY_IN_REVIEW'"
                icon="task_alt"
                variant="primary"
                @click="approveModalOpen = true"
              >
                Aprobar solicitud
              </AppButton>

              <AppButton
                v-if="selectedRequest.stage === 'QUALITY_IN_REVIEW'"
                icon="assignment_late"
                variant="danger"
                @click="rejectModalOpen = true"
              >
                Rechazar y devolver a diseño
              </AppButton>
            </div>
          </article>
        </section>
      </div>
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
import WorkflowDetailPanel from '~/presentation/request-workflow/components/WorkflowDetailPanel.vue'
import WorkflowQueueTable from '~/presentation/request-workflow/components/WorkflowQueueTable.vue'
import WorkflowQueueToolbar from '~/presentation/request-workflow/components/WorkflowQueueToolbar.vue'
import { useRequestWorkflowModule } from '~/presentation/request-workflow/composables/useRequestWorkflowModule'
import type { WorkflowChecklistState } from '~/presentation/interfaces/request-workflow/workflow-request.interface'

defineOptions({
  name: 'QualityQueueView',
})

const {
  workflowStore,
  qualityQueue,
  metrics,
  qualityRows,
  qualityFilters,
  priorityOptions,
  stageLabelMap,
  stageToneMap,
  priorityToneMap,
  checklistFieldLabels,
  notifyActionResult,
} = useRequestWorkflowModule()
const router = useRouter()

const selectedRequestId = ref('')
const approveModalOpen = ref(false)
const rejectModalOpen = ref(false)

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
  const map: Record<string, 'NEW' | 'DESIGN_IN_PROGRESS' | 'READY_FOR_QUALITY' | 'QUALITY_IN_REVIEW' | 'REJECTED_BY_QUALITY' | 'APPROVED'> = {}

  workflowStore.allRequests.forEach((request) => {
    map[request.id] = request.stage
  })

  return map
})

const priorityByRequestId = computed(() => {
  const map: Record<string, 'HIGH' | 'MEDIUM' | 'LOW'> = {}

  workflowStore.allRequests.forEach((request) => {
    map[request.id] = request.priority
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
  syncChecklistFromRequest()
}

const goToWorkflowDetail = () => {
  if (!selectedRequest.value) {
    return
  }

  void router.push(`/requests/workflow/${selectedRequest.value.id}`)
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

  const result = workflowStore.approveInQuality(selectedRequest.value.id, 'Equipo Calidad', comment)
  notifyActionResult(result)
}

const handleReject = (comment: string) => {
  rejectModalOpen.value = false

  if (!selectedRequest.value) {
    return
  }

  const result = workflowStore.rejectInQuality(selectedRequest.value.id, comment, 'Equipo Calidad')
  notifyActionResult(result)
}

onMounted(async () => {
  await workflowStore.hydrate()

  const firstRequest = qualityQueue.value[0]

  if (firstRequest) {
    openRequestDetail(firstRequest.id)
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
