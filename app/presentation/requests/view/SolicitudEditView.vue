<template>
  <AppShellLayout screen-title="Solicitudes">
    <section class="mx-auto w-full max-w-6xl space-y-4">
      <button
        class="inline-flex items-center gap-1 rounded-lg border border-outline/30 px-3 py-2 text-sm text-outline-variant transition-colors hover:bg-surface-container-low/10 hover:text-white"
        type="button"
        @click="goBackToRequests"
      >
        <span class="material-symbols-outlined text-[18px]">arrow_back</span>
        Volver a solicitudes
      </button>

      <article
        v-if="!requestFormModel"
        class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-6"
      >
        <h2 class="text-lg font-semibold text-white">
          Solicitud no encontrada
        </h2>
        <p class="mt-1 text-sm text-outline-variant">
          La solicitud que intentas editar no existe o fue eliminada.
        </p>
      </article>

      <RequestFormCard
        v-else
        mode="edit"
        :model="requestFormModel"
        @cancel="goBackToRequests"
        @submit="handleUpdateRequest"
      />
    </section>
  </AppShellLayout>
</template>

<script setup lang="ts">
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import RequestFormCard from '~/presentation/requests/components/RequestFormCard.vue'
import { useRequestsModule } from '~/presentation/requests/composables/useRequestsModule'
import type { DesignRequestFormModel } from '~/presentation/requests/interfaces/request-form.interface'

defineOptions({
  name: 'SolicitudEditView',
})

const route = useRoute()
const router = useRouter()
const requestId = computed(() => String(route.params.id ?? ''))
const { getFormModelById, updateRequest } = useRequestsModule()

const requestFormModel = computed(() => {
  if (!requestId.value) {
    return null
  }

  return getFormModelById(requestId.value)
})

const goBackToRequests = () => {
  void router.push('/solicitudes')
}

const handleUpdateRequest = (formModel: DesignRequestFormModel) => {
  if (!requestId.value) {
    return
  }

  const updated = updateRequest(requestId.value, formModel)

  if (updated) {
    goBackToRequests()
  }
}

useHead(() => ({
  title: 'RUASA ERP - Editar Solicitud',
  htmlAttrs: {
    lang: 'es',
  },
  bodyAttrs: {
    class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
  },
}))
</script>
