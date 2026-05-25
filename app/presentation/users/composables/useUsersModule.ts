import { useState } from '#imports'
import { computed, ref } from 'vue'
import { usersMockData } from '~/mocks/modules/users'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'
import type { UserFormModel } from '~/presentation/users/interfaces/user-form.interface'
import type { User, UserStatus, UserType } from '~/presentation/users/interfaces/user.interface'
import type { UserTableRow } from '~/presentation/users/interfaces/user-table-row.interface'
import { downloadCsvFile } from '~/utils/csv/download-csv.util'

const formatLastAccess = (dateIso: string | null) => {
  if (!dateIso) {
    return 'Sin acceso aún'
  }

  const date = new Date(dateIso)

  if (Number.isNaN(date.getTime())) {
    return 'Sin registro'
  }

  return new Intl.DateTimeFormat('es-SV', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

const createEmptyUserFormModel = (): UserFormModel => ({
  employeeCode: '',
  fullName: '',
  email: '',
  phone: '',
  userType: '',
  department: '',
  status: 'Pendiente',
})

const resolveUserType = (value: UserFormModel['userType'], fallback: UserType): UserType => {
  if (!value) {
    return fallback
  }

  return value
}

const toUserFormModel = (user: User): UserFormModel => ({
  employeeCode: user.employeeCode,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  userType: user.userType,
  department: user.department,
  status: user.status,
})

const applyUserFormToUser = (sourceUser: User, formModel: UserFormModel): User => ({
  ...sourceUser,
  employeeCode: formModel.employeeCode.trim(),
  fullName: formModel.fullName.trim(),
  email: formModel.email.trim().toLowerCase(),
  phone: formModel.phone.trim(),
  userType: resolveUserType(formModel.userType, sourceUser.userType),
  department: formModel.department.trim(),
  status: formModel.status,
})

export const useUsersModule = () => {
  const toast = useAppToast()
  const users = useState<User[]>('users-module-list', () => {
    return usersMockData.map(user => ({ ...user }))
  })
  const importInputRef = ref<HTMLInputElement | null>(null)

  const totalUsers = computed(() => users.value.length)
  const activeUsers = computed(() => users.value.filter(user => user.status === 'Activo').length)
  const pendingUsers = computed(() => users.value.filter(user => user.status === 'Pendiente').length)
  const blockedUsers = computed(() => users.value.filter(user => user.status === 'Bloqueado').length)

  const userTableRows = computed<UserTableRow[]>(() => {
    return users.value.map(user => ({
      id: user.id,
      employeeCode: user.employeeCode,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      department: user.department,
      status: user.status,
      lastAccess: formatLastAccess(user.lastAccessAt),
    }))
  })

  const findUserById = (userId: string) => {
    return users.value.find(user => user.id === userId) ?? null
  }

  const getUserFormModelById = (userId: string): UserFormModel | null => {
    const user = findUserById(userId)

    if (!user) {
      return null
    }

    return toUserFormModel(user)
  }

  const createUser = (formModel: UserFormModel) => {
    const nextId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? `user-${crypto.randomUUID()}`
      : `user-${Date.now()}`

    const nextUser: User = {
      id: nextId,
      employeeCode: formModel.employeeCode.trim(),
      fullName: formModel.fullName.trim(),
      email: formModel.email.trim().toLowerCase(),
      phone: formModel.phone.trim(),
      userType: resolveUserType(formModel.userType, 'Administrativo'),
      department: formModel.department.trim(),
      status: formModel.status,
      lastAccessAt: null,
    }

    users.value = [nextUser, ...users.value]
    toast.success('Usuario creado. Se enviará acceso temporal por correo.')
  }

  const updateUser = (userId: string, formModel: UserFormModel) => {
    const sourceUser = findUserById(userId)

    if (!sourceUser) {
      toast.error('No se encontró el usuario seleccionado.')
      return false
    }

    users.value = users.value.map((user) => {
      if (user.id !== userId) {
        return user
      }

      return applyUserFormToUser(sourceUser, formModel)
    })

    toast.success('Usuario actualizado correctamente.')
    return true
  }

  const deleteUser = (userId: string) => {
    const user = users.value.find(item => item.id === userId)

    if (!user) {
      toast.error('No se encontró el usuario seleccionado.')
      return false
    }

    users.value = users.value.filter(item => item.id !== userId)
    toast.success(`Usuario eliminado: ${user.fullName}`)
    return true
  }

  const sendTemporaryAccess = (userId: string) => {
    const user = users.value.find(item => item.id === userId)

    if (!user) {
      toast.error('No se encontró el usuario seleccionado.')
      return
    }

    users.value = users.value.map((item) => {
      if (item.id !== userId) {
        return item
      }

      const nextStatus: UserStatus = item.status === 'Bloqueado' ? 'Bloqueado' : 'Pendiente'

      return {
        ...item,
        status: nextStatus,
      }
    })

    toast.success(`Acceso temporal enviado a ${user.email}`)
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

  const handleExportUsers = () => {
    if (!userTableRows.value.length) {
      toast.warning('No hay usuarios para exportar.')
      return
    }

    downloadCsvFile(
      'usuarios.csv',
      [
        { key: 'employeeCode', label: 'Código' },
        { key: 'fullName', label: 'Nombre completo' },
        { key: 'email', label: 'Correo' },
        { key: 'phone', label: 'Teléfono' },
        { key: 'userType', label: 'Tipo de usuario' },
        { key: 'department', label: 'Área' },
        { key: 'status', label: 'Estado' },
        { key: 'lastAccess', label: 'Último acceso' },
      ],
      userTableRows.value,
    )

    toast.success('Exportación de usuarios completada.')
  }

  return {
    importInputRef,
    totalUsers,
    activeUsers,
    pendingUsers,
    blockedUsers,
    userTableRows,
    createEmptyUserFormModel,
    getUserFormModelById,
    createUser,
    updateUser,
    findUserById,
    deleteUser,
    sendTemporaryAccess,
    triggerImport,
    handleImportSelection,
    handleExportUsers,
  }
}
