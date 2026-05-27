import { useState } from '#imports'
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { useApiClient } from '~/presentation/shared/composables/useApiClient'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'
import type { HttpClientError } from '~/presentation/interfaces/shared/http/http-client-error.interface'
import type { UserFormModel } from '~/presentation/interfaces/users/user-form.interface'
import type { User, UserStatus, UserType } from '~/presentation/interfaces/users/user.interface'
import { ROLE_CODE_BY_USER_TYPE } from '~/presentation/interfaces/users/user.interface'
import type { UserTableRow } from '~/presentation/interfaces/users/user-table-row.interface'
import { downloadCsvFile } from '~/utils/csv/download-csv.util'

const formatLastAccess = (dateIso: string | null) => {
    if (!dateIso) {
        return 'Sin acceso aún'
    }

    const date = dayjs(dateIso)

    if (!date.isValid()) {
        return 'Sin registro'
    }

    return new Intl.DateTimeFormat('es-SV', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(date.toDate())
}

const defaultEmployeeCodeSeed = 1000
const defaultEmployeeCodePrefix = 'EMP'
const employeeCodePrefixByUserType: Record<UserType, string> = {
    Administrador: 'ADM',
    Vendedor: 'VEN',
    'Diseñador Jefe': 'DSJ',
    Diseñador: 'DIS',
    Calidad: 'CAL',
}

const parseEmployeeCodeParts = (employeeCode: string) => {
    const normalized = employeeCode.trim().toUpperCase()
    const [prefixSegment = '', sequenceSegment = ''] = normalized.split('-')
    const numericSegment = sequenceSegment.replace(/\D/g, '')
    const parsedSequence = Number.parseInt(numericSegment, 10)

    if (!prefixSegment || Number.isNaN(parsedSequence)) {
        return null
    }

    return {
        prefix: prefixSegment,
        sequence: parsedSequence,
    }
}

const formatEmployeeCode = (prefix: string, sequence: number) => {
    return `${prefix}-${String(sequence).padStart(4, '0')}`
}

const createEmptyUserFormModel = (nextEmployeeCode: string): UserFormModel => ({
    employeeCode: nextEmployeeCode,
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

let hydratePromise: Promise<void> | null = null

export const useUsersModule = () => {
    const apiClient = useApiClient()
    const toast = useAppToast()
    const users = useState<User[]>('users-module-list', () => [])
    const isHydrated = useState<boolean>('users-module-hydrated', () => false)
    const importInputRef = ref<HTMLInputElement | null>(null)

    const hydrateUsers = async (force = false) => {
        if (isHydrated.value && !force) {
            return
        }

        if (hydratePromise && !force) {
            await hydratePromise
            return
        }

        hydratePromise = (async () => {
            const response = await apiClient.get<User[]>('/users')
            users.value = response.data
            isHydrated.value = true
        })()

        try {
            await hydratePromise
        } finally {
            hydratePromise = null
        }
    }

    const resolveEmployeeCodePrefix = (userType: UserFormModel['userType']) => {
        if (!userType) {
            return defaultEmployeeCodePrefix
        }

        return employeeCodePrefixByUserType[userType] ?? defaultEmployeeCodePrefix
    }

    const generateNextEmployeeCode = (userType: UserFormModel['userType'] = '') => {
        const targetPrefix = resolveEmployeeCodePrefix(userType)
        const highestSequence = users.value.reduce(
            (currentHighest, user) => {
                const codeParts = parseEmployeeCodeParts(user.employeeCode)

                if (!codeParts || codeParts.prefix !== targetPrefix) {
                    return currentHighest
                }

                return Math.max(currentHighest, codeParts.sequence)
            },
            targetPrefix === defaultEmployeeCodePrefix ? defaultEmployeeCodeSeed : 0,
        )

        return formatEmployeeCode(targetPrefix, highestSequence + 1)
    }

    const totalUsers = computed(() => users.value.length)
    const activeUsers = computed(
        () => users.value.filter((user) => user.status === 'Activo').length,
    )
    const pendingUsers = computed(
        () => users.value.filter((user) => user.status === 'Pendiente').length,
    )
    const blockedUsers = computed(
        () => users.value.filter((user) => user.status === 'Bloqueado').length,
    )

    const userTableRows = computed<UserTableRow[]>(() => {
        return users.value.map((user) => ({
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
        return users.value.find((user) => user.id === userId) ?? null
    }

    const getUserFormModelById = (userId: string): UserFormModel | null => {
        const user = findUserById(userId)

        if (!user) {
            return null
        }

        return toUserFormModel(user)
    }

    const createUser = async (formModel: UserFormModel) => {
        const resolvedEmployeeCode =
            formModel.employeeCode.trim() || generateNextEmployeeCode(formModel.userType)
        const duplicatedEmployeeCode = users.value.some(
            (user) => user.employeeCode.toLowerCase() === resolvedEmployeeCode.toLowerCase(),
        )

        if (duplicatedEmployeeCode) {
            toast.error(`Ya existe un usuario con el código ${resolvedEmployeeCode}.`)
            return false
        }

        try {
            const resolvedUserType = resolveUserType(formModel.userType, 'Administrador')
            const response = await apiClient.post<{
                user: User
                temporaryPassword: string
            }>('/users', {
                employeeCode: resolvedEmployeeCode,
                fullName: formModel.fullName.trim(),
                email: formModel.email.trim().toLowerCase(),
                phone: formModel.phone.trim(),
                roleCode: ROLE_CODE_BY_USER_TYPE[resolvedUserType],
                department: formModel.department.trim(),
                status: formModel.status,
            })

            users.value = [response.data.user, ...users.value]
            toast.success(`Usuario creado. Contraseña temporal: ${response.data.temporaryPassword}`)
            toast.info('En el primer ingreso se solicitará cambio de contraseña.')
            return true
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || httpError.message || 'No se pudo crear el usuario.')
            return false
        }
    }

    const updateUser = async (userId: string, formModel: UserFormModel) => {
        const sourceUser = findUserById(userId)

        if (!sourceUser) {
            toast.error('No se encontró el usuario seleccionado.')
            return false
        }

        const normalizedEmployeeCode = formModel.employeeCode.trim().toLowerCase()
        const duplicatedEmployeeCode = users.value.some((user) => {
            return (
                user.id !== userId &&
                user.employeeCode.trim().toLowerCase() === normalizedEmployeeCode
            )
        })

        if (duplicatedEmployeeCode) {
            toast.error(`Ya existe un usuario con el código ${formModel.employeeCode.trim()}.`)
            return false
        }

        try {
            const resolvedUserType = resolveUserType(formModel.userType, sourceUser.userType)
            const response = await apiClient.put<User>(`/users/${userId}`, {
                employeeCode: formModel.employeeCode.trim(),
                fullName: formModel.fullName.trim(),
                email: formModel.email.trim().toLowerCase(),
                phone: formModel.phone.trim(),
                roleCode: ROLE_CODE_BY_USER_TYPE[resolvedUserType],
                department: formModel.department.trim(),
                status: formModel.status,
            })

            users.value = users.value.map((user) => (user.id === userId ? response.data : user))
            toast.success('Usuario actualizado correctamente.')
            return true
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || httpError.message || 'No se pudo actualizar el usuario.')
            return false
        }
    }

    const deleteUser = async (userId: string) => {
        const user = users.value.find((item) => item.id === userId)

        if (!user) {
            toast.error('No se encontró el usuario seleccionado.')
            return false
        }

        try {
            await apiClient.delete(`/users/${userId}`)
            users.value = users.value.filter((item) => item.id !== userId)
            toast.success(`Usuario eliminado: ${user.fullName}`)
            return true
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(statusMessage || httpError.message || 'No se pudo eliminar el usuario.')
            return false
        }
    }

    const sendTemporaryAccess = async (userId: string) => {
        const user = users.value.find((item) => item.id === userId)

        if (!user) {
            toast.error('No se encontró el usuario seleccionado.')
            return
        }

        const nextStatus: UserStatus = user.status === 'Bloqueado' ? 'Bloqueado' : 'Pendiente'

        try {
            const response = await apiClient.put<User>(`/users/${userId}`, {
                status: nextStatus,
            })

            users.value = users.value.map((item) => (item.id === userId ? response.data : item))
            toast.success(`Acceso temporal enviado a ${user.email}`)
        } catch (error) {
            const httpError = error as HttpClientError
            const statusMessage = (httpError.details as { statusMessage?: string } | null)
                ?.statusMessage
            toast.error(
                statusMessage || httpError.message || 'No se pudo actualizar el acceso temporal.',
            )
        }
    }

    const triggerImport = () => {
        importInputRef.value?.click()
    }

    const handleImportFile = (selectedFile: File | null | undefined) => {
        if (!selectedFile) {
            return
        }

        toast.info(
            `Archivo seleccionado: ${selectedFile.name}. Integración de importación pendiente.`,
        )
    }

    const handleImportSelection = (event: Event) => {
        const target = event.target as HTMLInputElement
        const selectedFile = target.files?.[0]

        handleImportFile(selectedFile)
        target.value = ''
    }

    const downloadImportTemplate = () => {
        downloadCsvFile(
            'plantilla-usuarios.csv',
            [
                { key: 'employee_code', label: 'employee_code' },
                { key: 'full_name', label: 'full_name' },
                { key: 'email', label: 'email' },
                { key: 'phone', label: 'phone' },
                { key: 'user_type', label: 'user_type' },
                { key: 'department', label: 'department' },
                { key: 'status', label: 'status' },
            ],
            [
                {
                    employee_code: 'EMP-1008',
                    full_name: 'Nombre Apellido',
                    email: 'usuario@empresa.com',
                    phone: '+503 7000-0000',
                    user_type: 'Administrador',
                    department: 'Operaciones',
                    status: 'Pendiente',
                },
            ],
        )

        toast.success('Plantilla de usuarios descargada.')
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
        generateNextEmployeeCode,
        getUserFormModelById,
        createUser,
        updateUser,
        findUserById,
        deleteUser,
        sendTemporaryAccess,
        triggerImport,
        handleImportFile,
        handleImportSelection,
        handleExportUsers,
        downloadImportTemplate,
        hydrateUsers,
    }
}
