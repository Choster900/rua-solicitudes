import { computed, ref } from 'vue'
import { clientsMockData } from '~/mocks/modules/clients'
import { vendorsMockData } from '~/mocks/modules/vendors'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'
import type { Vendor } from '~/presentation/vendors/interfaces/vendor.interface'
import type { VendorTableRow } from '~/presentation/vendors/interfaces/vendor-table-row.interface'
import { downloadCsvFile } from '~/utils/csv/download-csv.util'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export const useVendorsModule = () => {
  const toast = useAppToast()
  const vendors = ref<Vendor[]>([...vendorsMockData])
  const importInputRef = ref<HTMLInputElement | null>(null)

  const clientsByCode = computed(() => {
    return new Map(clientsMockData.map(client => [client.code, client.name]))
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

  const handleDeleteVendor = (vendorId: string) => {
    const vendor = vendors.value.find(item => item.id === vendorId)

    if (!vendor) {
      toast.error('No se encontró el vendedor seleccionado.')
      return
    }

    const shouldDelete = window.confirm(`¿Deseas eliminar a ${vendor.fullName}?`)

    if (!shouldDelete) {
      return
    }

    vendors.value = vendors.value.filter(item => item.id !== vendorId)
    toast.success(`Vendedor eliminado: ${vendor.fullName}`)
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
  }
}
