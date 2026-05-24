<template>
  <AppShellLayout screen-title="Vendedores">
    <section class="space-y-5">
      <VendorsToolbar
        :active-vendors="activeVendors"
        :total-monthly-sales-label="totalMonthlySalesLabel"
        :total-vendors="totalVendors"
        :vacation-vendors="vacationVendors"
        @add-vendor="handleAddVendor"
        @export-vendors="handleExportVendors"
        @import-vendors="triggerImport"
      />

      <VendorsDataTable
        :rows="vendorTableRows"
        @delete-vendor="handleDeleteVendor"
        @edit-vendor="handleEditVendor"
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
import VendorsDataTable from '~/presentation/vendors/components/VendorsDataTable.vue'
import VendorsToolbar from '~/presentation/vendors/components/VendorsToolbar.vue'
import { useVendorsModule } from '~/presentation/vendors/composables/useVendorsModule'

defineOptions({
  name: 'VendedoresView',
})

const {
  importInputRef,
  vendorTableRows,
  totalVendors,
  activeVendors,
  vacationVendors,
  totalMonthlySalesLabel,
  handleAddVendor,
  handleEditVendor,
  handleDeleteVendor,
  triggerImport,
  handleImportSelection,
  handleExportVendors,
} = useVendorsModule()

useHead(() => ({
  title: 'RUASA ERP - Vendedores',
  htmlAttrs: {
    lang: 'es',
  },
  bodyAttrs: {
    class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
  },
}))
</script>
