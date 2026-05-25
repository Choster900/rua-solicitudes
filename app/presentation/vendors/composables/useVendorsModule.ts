import { useState } from '#imports'
import { computed, ref } from 'vue'
import { useApiClient } from '~/presentation/shared/composables/useApiClient'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'
import type { HttpClientError } from '~/presentation/interfaces/shared/http/http-client-error.interface'
import type { Client } from '~/presentation/interfaces/clients/client.interface'
import type { Vendor } from '~/presentation/interfaces/vendors/vendor.interface'
import type { VendorTableRow } from '~/presentation/interfaces/vendors/vendor-table-row.interface'
import { downloadCsvFile } from '~/utils/csv/download-csv.util'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

let hydratePromise: Promise<void> | null = null

export const useVendorsModule = () => {
  const apiClient = useApiClient()
  const toast = useAppToast()
  const vendors = useState<Vendor[]>('vendors-module-list', () => [])
  const clients = useState<Client[]>('vendors-module-clients', () => [])
  const isHydrated = useState<boolean>('vendors-module-hydrated', () => false)
  const importInputRef = ref<HTMLInputElement | null>(null)

  const hydrateVendors = async (force = false) => {
    if (isHydrated.value && !force) {
      return
    }

    if (hydratePromise && !force) {
      await hydratePromise
      return
    }

    hydratePromise = (async () => {
      const [vendorsResponse, clientsResponse] = await Promise.all([
        apiClient.get<Vendor[]>('/vendors'),
        apiClient.get<Client[]>('/clients'),
      ])

      vendors.value = vendorsResponse.data
      clients.value = clientsResponse.data
      isHydrated.value = true
    })()

    try {
      await hydratePromise
    }
    finally {
      hydratePromise = null
    }
  }

  const clientsByCode = computed(() => {
    return new Map(clients.value.map(client => [client.code, client.name]))
  })

  const vendorTableRows = computed<VendorTableRow[]>(() => {
    return vendors.value.map((vendor) => {
      const assignedClientNames = vendor.assignedClientCodes
        .map(clientCode => clientsByCode.value.get(clientCode) ?? clientCode)
        .join(' | ')

      return {
        id: vendor.id,
        code: vendor.code,
        fullName: vendor.fullName,
        zone: vendor.zone,
        phone: vendor.phone,
        email: vendor.email,
        clients: assignedClientNames,
        monthlySales: currencyFormatter.format(vendor.monthlySalesUsd),
        status: vendor.status,
      }
    })
  })

  const totalVendors = computed(() => vendors.value.length)
  const activeVendors = computed(() => vendors.value.filter(vendor => vendor.status === 'Activo').length)
  const inactiveVendors = computed(() => vendors.value.filter(vendor => vendor.status === 'Inactivo').length)
  const vacationVendors = computed(() => vendors.value.filter(vendor => vendor.status === 'Vacaciones').length)
  const totalMonthlySalesLabel = computed(() => {
    const monthlySalesTotal = vendors.value.reduce((total, vendor) => total + vendor.monthlySalesUsd, 0)

    return currencyFormatter.format(monthlySalesTotal)
  })

  const handleAddVendor = () => {
    toast.info('Formulario de alta de vendedor en construcción.')
  }

  const handleEditVendor = (vendorId: string) => {
    const vendor = vendors.value.find(item => item.id === vendorId)

    if (!vendor) {
      toast.error('No se encontró el vendedor seleccionado.')
      return
    }

    toast.info(`Editar vendedor: ${vendor.fullName}`)
  }

  const handleDeleteVendor = async (vendorId: string) => {
    const vendor = vendors.value.find(item => item.id === vendorId)

    if (!vendor) {
      toast.error('No se encontró el vendedor seleccionado.')
      return
    }

    const shouldDelete = window.confirm(`¿Deseas eliminar a ${vendor.fullName}?`)

    if (!shouldDelete) {
      return
    }

    try {
      await apiClient.delete(`/vendors/${vendorId}`)
      vendors.value = vendors.value.filter(item => item.id !== vendorId)
      toast.success(`Vendedor eliminado: ${vendor.fullName}`)
    }
    catch (error) {
      const httpError = error as HttpClientError
      const statusMessage = (httpError.details as { statusMessage?: string } | null)?.statusMessage
      toast.error(statusMessage || 'No se pudo eliminar el vendedor.')
    }
  }

  const triggerImport = () => {
    importInputRef.value?.click()
  }

  const handleImportSelection = (event: Event) => {
    const target = event.target as HTMLInputElement
    const selectedFile = target.files?.[0]

    if (!selectedFile) {
      return
    }

    toast.info(`Archivo seleccionado: ${selectedFile.name}. Integración de importación pendiente.`)
    target.value = ''
  }

  const handleExportVendors = () => {
    if (!vendorTableRows.value.length) {
      toast.warning('No hay vendedores para exportar.')
      return
    }

    downloadCsvFile(
      'vendedores.csv',
      [
        { key: 'code', label: 'Código' },
        { key: 'fullName', label: 'Vendedor' },
        { key: 'zone', label: 'Zona' },
        { key: 'phone', label: 'Teléfono' },
        { key: 'email', label: 'Correo' },
        { key: 'clients', label: 'Clientes asignados' },
        { key: 'monthlySales', label: 'Venta mensual' },
        { key: 'status', label: 'Estado' },
      ],
      vendorTableRows.value,
    )

    toast.success('Exportación completada.')
  }

  return {
    importInputRef,
    vendorTableRows,
    totalVendors,
    activeVendors,
    inactiveVendors,
    vacationVendors,
    totalMonthlySalesLabel,
    handleAddVendor,
    handleEditVendor,
    handleDeleteVendor,
    triggerImport,
    handleImportSelection,
    handleExportVendors,
    hydrateVendors,
  }
}
