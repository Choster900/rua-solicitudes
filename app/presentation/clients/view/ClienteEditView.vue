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

      <article
        v-if="!clientFormModel"
        class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-6"
      >
        <h2 class="text-lg font-semibold text-white">
          Cliente no encontrado
        </h2>
        <p class="mt-1 text-sm text-outline-variant">
          El cliente que intentas editar no existe o fue eliminado.
        </p>
      </article>

      <ClientFormCard
        v-else
        mode="edit"
        :model="clientFormModel"
        @cancel="goBackToClients"
        @submit="handleUpdateClient"
      />
    </section>
  </AppShellLayout>
</template>

<script setup lang="ts">
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import ClientFormCard from '~/presentation/clients/components/ClientFormCard.vue'
import { useClientsModule } from '~/presentation/clients/composables/useClientsModule'
import type { ClientFormModel } from '~/presentation/clients/interfaces/client-form.interface'

defineOptions({
  name: 'ClienteEditView',
})

const route = useRoute()
const router = useRouter()
const clientId = computed(() => String(route.params.id ?? ''))
const { getClientFormModelById, updateClient } = useClientsModule()

const clientFormModel = computed(() => {
  if (!clientId.value) {
    return null
  }

  return getClientFormModelById(clientId.value)
})

const goBackToClients = () => {
  void router.push('/clientes')
}

const handleUpdateClient = (formModel: ClientFormModel) => {
  if (!clientId.value) {
    return
  }

  const updated = updateClient(clientId.value, formModel)

  if (updated) {
    goBackToClients()
  }
}

useHead(() => ({
  title: 'RUASA ERP - Editar Cliente',
  htmlAttrs: {
    lang: 'es',
  },
  bodyAttrs: {
    class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
  },
}))
</script>
