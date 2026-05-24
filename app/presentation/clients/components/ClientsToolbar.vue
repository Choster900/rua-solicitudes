<template>
  <section class="grid gap-4 xl:grid-cols-[minmax(0,1fr),auto]">
    <article class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-5 shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.16em] text-secondary-container">
            CRM Operativo
          </p>
          <h1 class="mt-1 text-2xl font-headline-md font-semibold text-white">
            Gestión de Clientes
          </h1>
          <p class="mt-1 text-sm text-outline-variant">
            Alta, actualización y carga masiva de clientes para el sistema.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <AppButton
            icon="person_add"
            size="md"
            variant="primary"
            @click="$emit('addClient')"
          >
            Agregar cliente
          </AppButton>
          <AppButton
            icon="description"
            size="md"
            variant="secondary"
            @click="$emit('downloadTemplate')"
          >
            Descargar plantilla
          </AppButton>
          <AppButton
            icon="upload_file"
            size="md"
            variant="secondary"
            @click="$emit('importClients')"
          >
            Importar masivo
          </AppButton>
          <AppButton
            icon="download"
            size="md"
            variant="ghost"
            @click="$emit('exportClients')"
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
          {{ totalClients }}
        </p>
      </div>
      <div class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3">
        <p class="text-[11px] uppercase tracking-[0.12em] text-outline-variant">
          Activos
        </p>
        <p class="mt-1 text-xl font-semibold text-emerald-200">
          {{ activeClients }}
        </p>
      </div>
      <div class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3">
        <p class="text-[11px] uppercase tracking-[0.12em] text-outline-variant">
          Prospecto
        </p>
        <p class="mt-1 text-xl font-semibold text-amber-200">
          {{ prospectClients }}
        </p>
      </div>
      <div class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3">
        <p class="text-[11px] uppercase tracking-[0.12em] text-outline-variant">
          Inactivos
        </p>
        <p class="mt-1 text-xl font-semibold text-rose-200">
          {{ inactiveClients }}
        </p>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'

interface ClientsToolbarProps {
  totalClients: number
  activeClients: number
  prospectClients: number
  inactiveClients: number
}

defineOptions({
  name: 'ClientsToolbar',
})

defineProps<ClientsToolbarProps>()

defineEmits<{
  addClient: []
  importClients: []
  exportClients: []
  downloadTemplate: []
}>()
</script>
