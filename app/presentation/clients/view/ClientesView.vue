<template>
  <AppShellLayout screen-title="Clientes">
    <section class="space-y-5">
      <ClientsToolbar
        :active-clients="activeClients"
        :inactive-clients="inactiveClients"
        :prospect-clients="prospectClients"
        :total-clients="totalClients"
        @add-client="goToCreateClient"
        @download-template="downloadImportTemplate"
        @export-clients="exportClients"
        @import-clients="triggerImport"
      />

      <ClientsDataTable
        :rows="clientTableRows"
        @delete-client="deleteClient"
        @edit-client="goToEditClient"
      />

      <input
        ref="importInputRef"
        accept=".csv"
        class="hidden"
        type="file"
        @change="handleImportSelection"
      >
    </section>
  </AppShellLayout>
</template>

<script setup lang="ts">
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import ClientsDataTable from '~/presentation/clients/components/ClientsDataTable.vue'
import ClientsToolbar from '~/presentation/clients/components/ClientsToolbar.vue'
import { useClientsModule } from '~/presentation/clients/composables/useClientsModule'

defineOptions({
  name: 'ClientesView',
})

const router = useRouter()
const {
  importInputRef,
  totalClients,
  activeClients,
  prospectClients,
  inactiveClients,
  clientTableRows,
  deleteClient,
  triggerImport,
  handleImportSelection,
  exportClients,
  downloadImportTemplate,
} = useClientsModule()

const goToCreateClient = () => {
  void router.push('/clientes/nuevo')
}

const goToEditClient = (clientId: string) => {
  void router.push(`/clientes/${clientId}/editar`)
}

useHead(() => ({
  title: 'RUASA ERP - Clientes',
  htmlAttrs: {
    lang: 'es',
  },
  bodyAttrs: {
    class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
  },
}))
</script>
