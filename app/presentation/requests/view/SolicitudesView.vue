<template>
  <AppShellLayout screen-title="Solicitudes">
    <section class="space-y-5">
      <RequestsToolbar
        :draft-requests="draftRequests"
        :high-priority-requests="highPriorityRequests"
        :in-design-requests="inDesignRequests"
        :total-requests="totalRequests"
        @create-request="goToCreateRequest"
        @export-requests="exportRequests"
        @import-requests="triggerImport"
      />

      <RequestsDataTable
        :rows="tableRows"
        @delete-request="removeRequest"
        @duplicate-request="duplicateRequest"
        @edit-request="goToEditRequest"
        @send-to-design="sendToDesign"
      />

      <input
        ref="importInputRef"
        accept=".csv,.xlsx,.xls"
        class="hidden"
        type="file"
        @change="handleImportSelection"
      >
    </section>
  </AppShellLayout>
</template>

<script setup lang="ts">
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import RequestsDataTable from '~/presentation/requests/components/RequestsDataTable.vue'
import RequestsToolbar from '~/presentation/requests/components/RequestsToolbar.vue'
import { useRequestsModule } from '~/presentation/requests/composables/useRequestsModule'

defineOptions({
  name: 'SolicitudesView',
})

const router = useRouter()
const {
  importInputRef,
  totalRequests,
  draftRequests,
  inDesignRequests,
  highPriorityRequests,
  tableRows,
  removeRequest,
  duplicateRequest,
  sendToDesign,
  triggerImport,
  handleImportSelection,
  exportRequests,
} = useRequestsModule()

const goToCreateRequest = () => {
  void router.push('/solicitudes/nueva')
}

const goToEditRequest = (requestId: string) => {
  void router.push(`/solicitudes/${requestId}/editar`)
}

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
