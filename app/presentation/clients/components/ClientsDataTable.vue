<template>
    <AppDataTable
        :columns="columns"
        :rows="rows"
        empty-description="No hay clientes que coincidan con los filtros aplicados."
        empty-title="Sin clientes para mostrar"
        row-key="id"
        :row-clickable="true"
        :selected-row-key="selectedRowKey"
        @row-click="handleRowSelect"
    >
        <template #cell-status="{ value }">
            <AppStatusBadge :label="String(value)" :tone="resolveStatusTone(String(value))" />
        </template>
    </AppDataTable>
</template>

<script setup lang="ts">
import AppDataTable from '~/presentation/shared/components/ui/AppDataTable.vue'
import AppStatusBadge from '~/presentation/shared/components/ui/AppStatusBadge.vue'
import type { AppDataTableColumn } from '~/presentation/interfaces/shared/ui/app-data-table.interface'
import type { ClientTableRow } from '~/presentation/interfaces/clients/client-table-row.interface'

interface ClientsDataTableProps {
    rows: ClientTableRow[]
    selectedRowKey?: string
}

defineOptions({
    name: 'ClientsDataTable',
})

defineProps<ClientsDataTableProps>()

const emit = defineEmits<{
    rowSelect: [clientId: string]
}>()

const columns: AppDataTableColumn[] = [
    { key: 'code', label: 'Código' },
    { key: 'name', label: 'Cliente' },
    { key: 'segment', label: 'Segmento' },
    { key: 'contactName', label: 'Contacto' },
    { key: 'contactPhone', label: 'Teléfono' },
    { key: 'location', label: 'Ubicación' },
    { key: 'status', label: 'Estado', align: 'center' },
]

const handleRowSelect = (payload: { row: object; rowKeyValue: string | number }) => {
    emit('rowSelect', String(payload.rowKeyValue))
}

const resolveStatusTone = (status: string) => {
    if (status === 'Activo') {
        return 'success'
    }

    if (status === 'Prospecto') {
        return 'warning'
    }

    if (status === 'Inactivo') {
        return 'danger'
    }

    return 'neutral'
}
</script>
