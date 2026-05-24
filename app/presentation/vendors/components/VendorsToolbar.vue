<template>
  <section class="grid gap-4 xl:grid-cols-[minmax(0,1fr),auto]">
    <article class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-5 shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.16em] text-secondary-container">
            Módulo Comercial
          </p>
          <h1 class="mt-1 text-2xl font-headline-md font-semibold text-white">
            Gestión de Vendedores
          </h1>
          <p class="mt-1 text-sm text-outline-variant">
            Controla tu equipo de ventas, monitorea cobertura y gestiona operaciones del día.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <AppButton
            icon="person_add"
            size="md"
            variant="primary"
            @click="$emit('addVendor')"
          >
            Agregar vendedor
          </AppButton>
          <AppButton
            icon="upload_file"
            size="md"
            variant="secondary"
            @click="$emit('importVendors')"
          >
            Importar
          </AppButton>
          <AppButton
            icon="download"
            size="md"
            variant="ghost"
            @click="$emit('exportVendors')"
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
          {{ totalVendors }}
        </p>
      </div>
      <div class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3">
        <p class="text-[11px] uppercase tracking-[0.12em] text-outline-variant">
          Activos
        </p>
        <p class="mt-1 text-xl font-semibold text-emerald-200">
          {{ activeVendors }}
        </p>
      </div>
      <div class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3">
        <p class="text-[11px] uppercase tracking-[0.12em] text-outline-variant">
          Vacaciones
        </p>
        <p class="mt-1 text-xl font-semibold text-amber-200">
          {{ vacationVendors }}
        </p>
      </div>
      <div class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3">
        <p class="text-[11px] uppercase tracking-[0.12em] text-outline-variant">
          Venta mensual
        </p>
        <p class="mt-1 text-lg font-semibold text-blue-200">
          {{ totalMonthlySalesLabel }}
        </p>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'

interface VendorsToolbarProps {
  totalVendors: number
  activeVendors: number
  vacationVendors: number
  totalMonthlySalesLabel: string
}

defineOptions({
  name: 'VendorsToolbar',
})

defineProps<VendorsToolbarProps>()

defineEmits<{
  addVendor: []
  importVendors: []
  exportVendors: []
}>()
</script>
