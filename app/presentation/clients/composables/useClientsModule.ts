import { useState } from '#imports'
import { computed, ref } from 'vue'
import { clientsMockData } from '~/mocks/modules/clients'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'
import type { ClientFormModel } from '~/presentation/clients/interfaces/client-form.interface'
import type { Client, ClientStatus } from '~/presentation/clients/interfaces/client.interface'
import type { ClientTableRow } from '~/presentation/clients/interfaces/client-table-row.interface'
import { downloadCsvFile } from '~/utils/csv/download-csv.util'

const requiredImportHeaders = [
  'code',
  'name',
  'tax_id',
  'segment',
  'contact_name',
  'contact_email',
  'contact_phone',
  'country',
  'department',
  'city',
  'address_line',
  'address_reference',
  'website',
  'google_maps_url',
  'status',
  'notes',
]
const clientStatusOptions: ClientStatus[] = ['Activo', 'Prospecto', 'Inactivo']
const emailExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const createEmptyClientFormModel = (): ClientFormModel => ({
  code: '',
  name: '',
  taxId: '',
  segment: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  country: 'El Salvador',
  department: '',
  city: '',
  addressLine: '',
  addressReference: '',
  website: '',
  googleMapsUrl: '',
  notes: '',
  status: 'Prospecto',
})

const toClientFormModel = (client: Client): ClientFormModel => ({
  code: client.code,
  name: client.name,
  taxId: client.taxId,
  segment: client.segment,
  contactName: client.contactName,
  contactEmail: client.contactEmail,
  contactPhone: client.contactPhone,
  country: client.country,
  department: client.department,
  city: client.city,
  addressLine: client.addressLine,
  addressReference: client.addressReference,
  website: client.website,
  googleMapsUrl: client.googleMapsUrl,
  notes: client.notes,
  status: client.status,
})

const normalizeClientStatus = (value: string): ClientStatus => {
  if (value === 'Activo' || value === 'Prospecto' || value === 'Inactivo') {
    return value
  }

  return 'Prospecto'
}

const parseCsvLine = (line: string): string[] => {
  const values: string[] = []
  let current = ''
  let isInsideQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const nextChar = line[index + 1]

    if (char === '"') {
      if (isInsideQuotes && nextChar === '"') {
        current += '"'
        index += 1
        continue
      }

      isInsideQuotes = !isInsideQuotes
      continue
    }

    if (char === ',' && !isInsideQuotes) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  values.push(current.trim())

  return values
}

const toClientFromForm = (formModel: ClientFormModel, id: string): Client => ({
  id,
  code: formModel.code.trim().toUpperCase(),
  name: formModel.name.trim(),
  taxId: formModel.taxId.trim(),
  segment: formModel.segment.trim(),
  contactName: formModel.contactName.trim(),
  contactEmail: formModel.contactEmail.trim().toLowerCase(),
  contactPhone: formModel.contactPhone.trim(),
  country: formModel.country.trim(),
  department: formModel.department.trim(),
  city: formModel.city.trim(),
  addressLine: formModel.addressLine.trim(),
  addressReference: formModel.addressReference.trim(),
  website: formModel.website.trim(),
  googleMapsUrl: formModel.googleMapsUrl.trim(),
  notes: formModel.notes.trim(),
  status: formModel.status,
})

const createClientId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `client-${crypto.randomUUID()}`
  }

  return `client-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

const hasValidEmail = (value: string) => emailExpression.test(value.trim())

export const useClientsModule = () => {
  const toast = useAppToast()
  const clients = useState<Client[]>('clients-module-list', () => {
    return clientsMockData.map(client => ({ ...client }))
  })
  const importInputRef = ref<HTMLInputElement | null>(null)

  const totalClients = computed(() => clients.value.length)
  const activeClients = computed(() => clients.value.filter(client => client.status === 'Activo').length)
  const prospectClients = computed(() => clients.value.filter(client => client.status === 'Prospecto').length)
  const inactiveClients = computed(() => clients.value.filter(client => client.status === 'Inactivo').length)

  const clientTableRows = computed<ClientTableRow[]>(() => {
    return clients.value.map(client => ({
      id: client.id,
      code: client.code,
      name: client.name,
      segment: client.segment,
      contactName: client.contactName,
      contactPhone: client.contactPhone,
      location: `${client.city}, ${client.department}`,
      city: client.city,
      status: client.status,
    }))
  })

  const findClientById = (clientId: string) => {
    return clients.value.find(client => client.id === clientId) ?? null
  }

  const getClientFormModelById = (clientId: string): ClientFormModel | null => {
    const client = findClientById(clientId)

    if (!client) {
      return null
    }

    return toClientFormModel(client)
  }

  const createClient = (formModel: ClientFormModel) => {
    const normalizedCode = formModel.code.trim().toUpperCase()
    const duplicatedCode = clients.value.some(client => client.code.toUpperCase() === normalizedCode)

    if (duplicatedCode) {
      toast.error(`Ya existe un cliente con el código ${normalizedCode}.`)
      return false
    }

    const nextClient = toClientFromForm(formModel, createClientId())
    clients.value = [nextClient, ...clients.value]
    toast.success(`Cliente creado: ${nextClient.name}`)

    return true
  }

  const updateClient = (clientId: string, formModel: ClientFormModel) => {
    const sourceClient = findClientById(clientId)

    if (!sourceClient) {
      toast.error('No se encontró el cliente seleccionado.')
      return false
    }

    const normalizedCode = formModel.code.trim().toUpperCase()
    const duplicatedCode = clients.value.some(client => client.id !== clientId && client.code.toUpperCase() === normalizedCode)

    if (duplicatedCode) {
      toast.error(`Ya existe un cliente con el código ${normalizedCode}.`)
      return false
    }

    const updatedClient = toClientFromForm(formModel, sourceClient.id)
    clients.value = clients.value.map(client => (client.id === clientId ? updatedClient : client))
    toast.success(`Cliente actualizado: ${updatedClient.name}`)

    return true
  }

  const deleteClient = (clientId: string) => {
    const client = findClientById(clientId)

    if (!client) {
      toast.error('No se encontró el cliente seleccionado.')
      return
    }

    const shouldDelete = window.confirm(`¿Deseas eliminar al cliente ${client.name}?`)

    if (!shouldDelete) {
      return
    }

    clients.value = clients.value.filter(item => item.id !== clientId)
    toast.success(`Cliente eliminado: ${client.name}`)
  }

  const triggerImport = () => {
    importInputRef.value?.click()
  }

  const downloadImportTemplate = () => {
    downloadCsvFile(
      'plantilla-clientes.csv',
      requiredImportHeaders.map(header => ({ key: header, label: header })),
      [
        {
          code: 'CLI-900',
          name: 'Cliente Ejemplo S.A. de C.V.',
          tax_id: '0614-000000-000-0',
          segment: 'Retail',
          contact_name: 'Contacto Ejemplo',
          contact_email: 'contacto@cliente-ejemplo.com',
          contact_phone: '+503 7000-0000',
          country: 'El Salvador',
          department: 'San Salvador',
          city: 'San Salvador',
          address_line: 'Direccion principal del cliente',
          address_reference: 'Referencia adicional',
          website: 'https://cliente-ejemplo.com',
          google_maps_url: 'https://maps.google.com/?q=San+Salvador',
          status: 'Prospecto',
          notes: 'Notas internas del cliente',
        },
      ],
    )

    toast.success('Plantilla de clientes descargada.')
  }

  const parseImportFileContent = (sourceContent: string) => {
    const lines = sourceContent
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0)

    if (lines.length < 2) {
      return {
        success: false,
        message: 'El archivo no contiene registros para importar.',
      }
    }

    const headers = parseCsvLine(lines[0]).map(header => header.trim().toLowerCase())
    const missingHeaders = requiredImportHeaders.filter(header => !headers.includes(header))

    if (missingHeaders.length > 0) {
      return {
        success: false,
        message: `Faltan columnas requeridas: ${missingHeaders.join(', ')}`,
      }
    }

    const columnIndexMap = headers.reduce<Record<string, number>>((accumulator, header, index) => {
      accumulator[header] = index
      return accumulator
    }, {})

    let importedCount = 0
    let skippedCount = 0
    let updatedCount = 0

    const nextClients = [...clients.value]

    for (let lineIndex = 1; lineIndex < lines.length; lineIndex += 1) {
      const row = parseCsvLine(lines[lineIndex])
      const code = row[columnIndexMap.code]?.trim().toUpperCase() ?? ''
      const name = row[columnIndexMap.name]?.trim() ?? ''
      const taxId = row[columnIndexMap.tax_id]?.trim() ?? ''
      const segment = row[columnIndexMap.segment]?.trim() ?? ''
      const contactName = row[columnIndexMap.contact_name]?.trim() ?? ''
      const contactEmail = row[columnIndexMap.contact_email]?.trim().toLowerCase() ?? ''
      const contactPhone = row[columnIndexMap.contact_phone]?.trim() ?? ''
      const country = row[columnIndexMap.country]?.trim() ?? ''
      const department = row[columnIndexMap.department]?.trim() ?? ''
      const city = row[columnIndexMap.city]?.trim() ?? ''
      const addressLine = row[columnIndexMap.address_line]?.trim() ?? ''
      const addressReference = row[columnIndexMap.address_reference]?.trim() ?? ''
      const website = row[columnIndexMap.website]?.trim() ?? ''
      const googleMapsUrl = row[columnIndexMap.google_maps_url]?.trim() ?? ''
      const statusValue = row[columnIndexMap.status]?.trim() ?? ''
      const notes = row[columnIndexMap.notes]?.trim() ?? ''

      if (
        !code
        || !name
        || !segment
        || !contactName
        || !contactEmail
        || !contactPhone
        || !country
        || !department
        || !city
        || !addressLine
        || !statusValue
      ) {
        skippedCount += 1
        continue
      }

      if (!hasValidEmail(contactEmail)) {
        skippedCount += 1
        continue
      }

      const normalizedStatus = normalizeClientStatus(statusValue)
      const nextClientPayload: Omit<Client, 'id'> = {
        code,
        name,
        taxId,
        segment,
        contactName,
        contactEmail,
        contactPhone,
        country,
        department,
        city,
        addressLine,
        addressReference,
        website,
        googleMapsUrl,
        notes,
        status: normalizedStatus,
      }
      const existingIndex = nextClients.findIndex(client => client.code.toUpperCase() === code)

      if (existingIndex >= 0) {
        nextClients[existingIndex] = {
          ...nextClients[existingIndex],
          ...nextClientPayload,
        }
        updatedCount += 1
        continue
      }

      nextClients.unshift({
        id: createClientId(),
        ...nextClientPayload,
      })
      importedCount += 1
    }

    clients.value = nextClients

    return {
      success: true,
      message: `Importación completada. Nuevos: ${importedCount}, actualizados: ${updatedCount}, omitidos: ${skippedCount}.`,
    }
  }

  const handleImportSelection = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const selectedFile = target.files?.[0]

    if (!selectedFile) {
      return
    }

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      toast.error('Formato no soportado. Usa un archivo CSV basado en la plantilla.')
      target.value = ''
      return
    }

    const fileContent = await selectedFile.text()
    const importResult = parseImportFileContent(fileContent)

    if (importResult.success) {
      toast.success(importResult.message)
    }
    else {
      toast.error(importResult.message)
    }

    target.value = ''
  }

  const exportClients = () => {
    if (!clients.value.length) {
      toast.warning('No hay clientes para exportar.')
      return
    }

    downloadCsvFile(
      'clientes.csv',
      [
        { key: 'code', label: 'Codigo' },
        { key: 'name', label: 'Cliente' },
        { key: 'taxId', label: 'NIT' },
        { key: 'segment', label: 'Segmento' },
        { key: 'contactName', label: 'Contacto' },
        { key: 'contactEmail', label: 'Correo de contacto' },
        { key: 'contactPhone', label: 'Telefono de contacto' },
        { key: 'country', label: 'Pais' },
        { key: 'department', label: 'Departamento' },
        { key: 'city', label: 'Ciudad' },
        { key: 'addressLine', label: 'Direccion' },
        { key: 'addressReference', label: 'Referencia' },
        { key: 'website', label: 'Sitio web' },
        { key: 'googleMapsUrl', label: 'URL Google Maps' },
        { key: 'status', label: 'Estado' },
        { key: 'notes', label: 'Notas' },
      ],
      clients.value,
    )

    toast.success('Exportación de clientes completada.')
  }

  return {
    importInputRef,
    totalClients,
    activeClients,
    prospectClients,
    inactiveClients,
    clientTableRows,
    createEmptyClientFormModel,
    getClientFormModelById,
    createClient,
    updateClient,
    deleteClient,
    triggerImport,
    handleImportSelection,
    exportClients,
    downloadImportTemplate,
    clientStatusOptions,
  }
}
