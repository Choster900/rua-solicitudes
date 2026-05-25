<template>
  <AppShellLayout screen-title="Bandeja Diseño">
    <section class="space-y-5">
      <WorkflowQueueToolbar
        description="Toma solicitudes nuevas, valida expediente y prepara el pase a Calidad."
        :metrics="metrics"
        :priority="designFilters.priority"
        :priority-options="priorityOptions"
        :query="designFilters.query"
        title="Bandeja Diseño"
        @update:priority="workflowStore.setDesignFilters({ priority: $event })"
        @update:query="workflowStore.setDesignFilters({ query: $event })"
      />

      <div class="grid gap-4 xl:grid-cols-[60%_minmax(0,1fr)]">
        <WorkflowQueueTable
          :priority-tone-map="priorityToneMap"
          :request-priority-by-id="priorityByRequestId"
          :request-stage-by-id="stageByRequestId"
          :rows="designRows"
          :selected-request-id="selectedRequestId"
          :stage-tone-map="stageToneMap"
          @view="openRequestDetail"
        />

        <section class="space-y-4">
          <WorkflowDetailPanel
            :checklist="activeChecklist"
            :checklist-error="checklistError"
            :checklist-labels="checklistFieldLabels"
            :editable-checklist="selectedRequest?.stage === 'DESIGN_IN_PROGRESS'"
            :request="selectedRequest"
            :stage-label="selectedRequest ? stageLabelMap[selectedRequest.stage] : 'Sin selección'"
            :stage-tone="selectedRequest ? stageToneMap[selectedRequest.stage] : 'neutral'"
            @update-checklist="activeChecklist = $event"
          />

          <article
            v-if="selectedRequest"
            class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-4"
          >
            <h3 class="text-sm font-semibold text-white">
              Acciones de etapa
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
                v-if="selectedRequest.stage === 'NEW'"
                icon="play_arrow"
                variant="primary"
                @click="handleStartDesign"
              >
                Tomar solicitud en Diseño
              </AppButton>

              <AppButton
                v-if="selectedRequest.stage === 'DESIGN_IN_PROGRESS'"
                icon="east"
                variant="secondary"
                @click="openSendToQualityDecision"
              >
                Enviar a Calidad
              </AppButton>

              <AppButton
                v-if="selectedRequest.stage === 'REJECTED_BY_QUALITY'"
                icon="restart_alt"
                variant="secondary"
                @click="openReturnToDesignDecision"
              >
                Retomar corrección
              </AppButton>
            </div>
          </article>
        </section>
      </div>
    </section>

    <WorkflowDecisionModal
      confirm-label="Confirmar envío"
      description="Agrega una nota opcional para el equipo de Calidad antes de enviar."
      :open="sendToQualityModalOpen"
      title="Enviar solicitud a Calidad"
      @close="sendToQualityModalOpen = false"
      @confirm="handleSendToQuality"
    />

    <WorkflowDecisionModal
      confirm-label="Retomar en diseño"
      description="Agrega una nota opcional para registrar la corrección iniciada."
      :open="returnToDesignModalOpen"
      title="Retornar a Diseño"
      @close="returnToDesignModalOpen = false"
      @confirm="handleReturnToDesign"
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
  name: 'DesignQueueView',
})

const {
  workflowStore,
  designQueue,
  metrics,
  designRows,
  designFilters,
  priorityOptions,
  stageLabelMap,
  stageToneMap,
  priorityToneMap,
  checklistFieldLabels,
  notifyActionResult,
} = useRequestWorkflowModule()
const router = useRouter()

const selectedRequestId = ref('')
const checklistError = ref('')
const sendToQualityModalOpen = ref(false)
const returnToDesignModalOpen = ref(false)

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
  checklistError.value = ''
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

const handleStartDesign = () => {
  if (!selectedRequest.value) {
    return
  }

  const result = workflowStore.startDesignReview(selectedRequest.value.id)
  notifyActionResult(result)
  syncChecklistFromRequest()
}

const openSendToQualityDecision = () => {
  if (!selectedRequest.value) {
    return
  }

  sendToQualityModalOpen.value = true
}

const handleSendToQuality = (comment: string) => {
  sendToQualityModalOpen.value = false

  if (!selectedRequest.value) {
    return
  }

  const result = workflowStore.sendToQuality(
    selectedRequest.value.id,
    activeChecklist.value,
    'Equipo Diseño',
    comment,
  )

  if (!result.success && result.message.includes('checklist')) {
    checklistError.value = result.message
  }

  notifyActionResult(result)
}

const openReturnToDesignDecision = () => {
  if (!selectedRequest.value) {
    return
  }

  returnToDesignModalOpen.value = true
}

const handleReturnToDesign = (comment: string) => {
  returnToDesignModalOpen.value = false

  if (!selectedRequest.value) {
    return
  }

  const result = workflowStore.returnToDesign(selectedRequest.value.id, 'Equipo Diseño', comment)
  notifyActionResult(result)
}

onMounted(async () => {
  await workflowStore.hydrate()

  const firstRequest = designQueue.value[0]

  if (firstRequest) {
    openRequestDetail(firstRequest.id)
  }
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
