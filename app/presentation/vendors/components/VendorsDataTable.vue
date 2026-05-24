<template>
  <AppDataTable
    :columns="columns"
    :rows="rows"
    empty-description="No hay vendedores que coincidan con los filtros aplicados."
    empty-title="Sin vendedores para mostrar"
    row-key="id"
  >
    <template #cell-status="{ value }">
      <AppStatusBadge
        :label="String(value)"
        :tone="resolveStatusTone(String(value))"
      />
    </template>

    <template #cell-actions="{ rowKeyValue }">
      <div
        class="relative flex items-center justify-end"
        data-actions-menu
      >
        <button
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline/20 text-outline-variant transition-colors hover:bg-surface-container-low/10 hover:text-white"
          type="button"
          title="Más acciones"
          @click.stop="toggleActionsMenu(String(rowKeyValue))"
        >
          <span class="material-symbols-outlined text-[20px]">more_vert</span>
        </button>

        <div
          v-if="openActionsMenuRowId === String(rowKeyValue)"
          class="absolute right-0 top-11 z-30 min-w-[170px] overflow-hidden rounded-xl border border-outline/30 bg-deep-navy shadow-xl"
        >
          <button
            class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-blue-200 transition-colors hover:bg-blue-500/15 hover:text-blue-100"
            type="button"
            @click="handleEdit(String(rowKeyValue))"
          >
            <span class="material-symbols-outlined text-[18px]">edit</span>
            Editar
          </button>
          <button
            class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-rose-200 transition-colors hover:bg-rose-500/15 hover:text-rose-100"
            type="button"
            @click="handleDelete(String(rowKeyValue))"
          >
            <span class="material-symbols-outlined text-[18px]">delete</span>
            Eliminar
          </button>
        </div>
      </div>
    </template>
  </AppDataTable>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import AppDataTable from '~/presentation/shared/components/ui/AppDataTable.vue'
import AppStatusBadge from '~/presentation/shared/components/ui/AppStatusBadge.vue'
import type { AppDataTableColumn } from '~/presentation/shared/interfaces/ui/app-data-table.interface'
import type { VendorTableRow } from '~/presentation/vendors/interfaces/vendor-table-row.interface'

interface VendorsDataTableProps {
  rows: VendorTableRow[]
}

defineOptions({
  name: 'VendorsDataTable',
})

defineProps<VendorsDataTableProps>()

const emit = defineEmits<{
  editVendor: [vendorId: string]
  deleteVendor: [vendorId: string]
}>()

const openActionsMenuRowId = ref<string | null>(null)
let outsideClickHandler: ((event: MouseEvent) => void) | null = null

const toggleActionsMenu = (rowId: string) => {
  openActionsMenuRowId.value = openActionsMenuRowId.value === rowId ? null : rowId
}

const closeActionsMenu = () => {
  openActionsMenuRowId.value = null
}

const handleEdit = (rowId: string) => {
  emit('editVendor', rowId)
  closeActionsMenu()
}

const handleDelete = (rowId: string) => {
  emit('deleteVendor', rowId)
  closeActionsMenu()
}

const columns: AppDataTableColumn[] = [
  { key: 'code', label: 'Código', filterPlaceholder: 'Ej. VEN-001' },
  { key: 'fullName', label: 'Vendedor' },
  { key: 'zone', label: 'Zona' },
  { key: 'phone', label: 'Teléfono' },
  { key: 'email', label: 'Correo' },
  { key: 'clients', label: 'Clientes asignados' },
  { key: 'monthlySales', label: 'Venta mensual', align: 'right' },
  { key: 'status', label: 'Estado', align: 'center' },
  {
    key: 'actions',
    label: 'Acciones',
    searchable: false,
    align: 'right',
    headerClassName: 'w-[50px]',
    cellClassName: 'w-[50px]',
  },
]

const resolveStatusTone = (status: string) => {
  if (status === 'Activo') {
    return 'success'
  }

  if (status === 'Vacaciones') {
    return 'warning'
  }

  if (status === 'Inactivo') {
    return 'danger'
  }

  return 'neutral'
}

onMounted(() => {
  outsideClickHandler = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null

    if (!target) {
      return
    }

    if (target.closest('[data-actions-menu]')) {
      return
    }

    closeActionsMenu()
  }

  document.addEventListener('click', outsideClickHandler)
})

onUnmounted(() => {
  if (outsideClickHandler) {
    document.removeEventListener('click', outsideClickHandler)
  }
})
</script>
