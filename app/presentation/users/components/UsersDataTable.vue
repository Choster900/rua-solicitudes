<template>
  <AppDataTable
    :columns="columns"
    :rows="rows"
    empty-description="No hay usuarios que coincidan con los filtros aplicados."
    empty-title="Sin usuarios para mostrar"
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
          class="absolute right-0 top-11 z-30 min-w-[210px] overflow-hidden rounded-xl border border-outline/30 bg-deep-navy shadow-xl"
        >
          <button
            class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-blue-200 transition-colors hover:bg-blue-500/15 hover:text-blue-100"
            type="button"
            @click="handleEdit(String(rowKeyValue))"
          >
            <span class="material-symbols-outlined text-[18px]">edit</span>
            Editar usuario
          </button>
          <button
            class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-amber-200 transition-colors hover:bg-amber-500/15 hover:text-amber-100"
            type="button"
            @click="handleSendTemporaryAccess(String(rowKeyValue))"
          >
            <span class="material-symbols-outlined text-[18px]">mail</span>
            Enviar acceso temporal
          </button>
          <button
            class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-rose-200 transition-colors hover:bg-rose-500/15 hover:text-rose-100"
            type="button"
            @click="handleDelete(String(rowKeyValue))"
          >
            <span class="material-symbols-outlined text-[18px]">delete</span>
            Eliminar usuario
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
import type { AppDataTableColumn } from '~/presentation/interfaces/shared/ui/app-data-table.interface'
import type { UserTableRow } from '~/presentation/interfaces/users/user-table-row.interface'

interface UsersDataTableProps {
  rows: UserTableRow[]
}

defineOptions({
  name: 'UsersDataTable',
})

defineProps<UsersDataTableProps>()

const emit = defineEmits<{
  editUser: [userId: string]
  sendTemporaryAccess: [userId: string]
  deleteUser: [userId: string]
}>()

const openActionsMenuRowId = ref<string | null>(null)
let outsideClickHandler: ((event: MouseEvent) => void) | null = null

const columns: AppDataTableColumn[] = [
  { key: 'employeeCode', label: 'Código' },
  { key: 'fullName', label: 'Nombre completo' },
  { key: 'email', label: 'Correo' },
  { key: 'phone', label: 'Teléfono' },
  { key: 'userType', label: 'Tipo de usuario' },
  { key: 'department', label: 'Área' },
  { key: 'status', label: 'Estado', align: 'center' },
  { key: 'lastAccess', label: 'Último acceso' },
  {
    key: 'actions',
    label: 'Acciones',
    searchable: false,
    align: 'right',
    headerClassName: 'w-[50px]',
    cellClassName: 'w-[50px]',
  },
]

const toggleActionsMenu = (rowId: string) => {
  openActionsMenuRowId.value = openActionsMenuRowId.value === rowId ? null : rowId
}

const closeActionsMenu = () => {
  openActionsMenuRowId.value = null
}

const handleEdit = (rowId: string) => {
  emit('editUser', rowId)
  closeActionsMenu()
}

const handleSendTemporaryAccess = (rowId: string) => {
  emit('sendTemporaryAccess', rowId)
  closeActionsMenu()
}

const handleDelete = (rowId: string) => {
  emit('deleteUser', rowId)
  closeActionsMenu()
}

const resolveStatusTone = (status: string) => {
  if (status === 'Activo') {
    return 'success'
  }

  if (status === 'Pendiente') {
    return 'warning'
  }

  if (status === 'Bloqueado') {
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
