<template>
  <section class="grid gap-4 xl:grid-cols-[minmax(0,1fr),auto]">
    <article class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-5 shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.16em] text-secondary-container">
            Flujo Comercial > Diseño
          </p>
          <h1 class="mt-1 text-2xl font-headline-md font-semibold text-white">
            Módulo de Solicitudes
          </h1>
          <p class="mt-1 text-sm text-outline-variant">
            Crea briefs completos para que diseño trabaje con precisión: materiales, colorimetría, troqueles y referencias.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <AppButton
            icon="add_circle"
            size="md"
            variant="primary"
            @click="$emit('createRequest')"
          >
            Nueva solicitud
          </AppButton>
          <AppButton
            icon="upload_file"
            size="md"
            variant="secondary"
            @click="$emit('importRequests')"
          >
            Importar
          </AppButton>
          <AppButton
            icon="download"
            size="md"
            variant="ghost"
            @click="$emit('exportRequests')"
          >
            Exportar
          </AppButton>
        </div>
      </div>
    </article>

    <article class="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:w-[520px]">
      <div class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3">
        <p class="text-[11px] uppercase tracking-[0.12em] text-outline-variant">
          Total
        </p>
        <p class="mt-1 text-xl font-semibold text-white">
          {{ totalRequests }}
        </p>
      </div>
      <div class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3">
        <p class="text-[11px] uppercase tracking-[0.12em] text-outline-variant">
          Borradores
        </p>
        <p class="mt-1 text-xl font-semibold text-slate-200">
          {{ draftRequests }}
        </p>
      </div>
      <div class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3">
        <p class="text-[11px] uppercase tracking-[0.12em] text-outline-variant">
          En diseño
        </p>
        <p class="mt-1 text-xl font-semibold text-blue-200">
          {{ inDesignRequests }}
        </p>
      </div>
      <div class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3">
        <p class="text-[11px] uppercase tracking-[0.12em] text-outline-variant">
          Prioridad alta
        </p>
        <p class="mt-1 text-xl font-semibold text-rose-200">
          {{ highPriorityRequests }}
        </p>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'

interface RequestsToolbarProps {
  totalRequests: number
  draftRequests: number
  inDesignRequests: number
  highPriorityRequests: number
}

defineOptions({
  name: 'RequestsToolbar',
})

defineProps<RequestsToolbarProps>()

defineEmits<{
  createRequest: []
  importRequests: []
  exportRequests: []
}>()
</script>
