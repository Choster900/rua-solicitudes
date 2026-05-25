<template>
  <AppShellLayout screen-title="Clientes">
    <section class="mx-auto w-full max-w-6xl space-y-4">
      <button
        class="inline-flex items-center gap-1 rounded-lg border border-outline/30 px-3 py-2 text-sm text-outline-variant transition-colors hover:bg-surface-container-low/10 hover:text-white"
        type="button"
        @click="goBackToClients"
      >
        <span class="material-symbols-outlined text-[18px]">arrow_back</span>
        Volver a clientes
      </button>

      <ClientFormCard
        mode="create"
        :model="clientFormModel"
        @cancel="goBackToClients"
        @submit="handleCreateClient"
      />
    </section>
  </AppShellLayout>
</template>

<script setup lang="ts">
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import ClientFormCard from '~/presentation/clients/components/ClientFormCard.vue'
import { useClientsModule } from '~/presentation/clients/composables/useClientsModule'
import type { ClientFormModel } from '~/presentation/interfaces/clients/client-form.interface'

defineOptions({
  name: 'ClienteCreateView',
})

const router = useRouter()
const { createEmptyClientFormModel, createClient } = useClientsModule()
const clientFormModel = createEmptyClientFormModel()

const goBackToClients = () => {
  void router.push('/clientes')
}

const handleCreateClient = (formModel: ClientFormModel) => {
  const created = createClient(formModel)

  if (created) {
    goBackToClients()
  }
}

useHead(() => ({
  title: 'RUASA ERP - Nuevo Cliente',
  htmlAttrs: {
    lang: 'es',
  },
  bodyAttrs: {
    class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
  },
}))
</script>
