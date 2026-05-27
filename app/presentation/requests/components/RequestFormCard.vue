<template>
    <article class="w-full space-y-4">
        <header class="flex flex-wrap items-start justify-between gap-4">
            <div>
                <h2 class="text-3xl font-headline-md font-semibold text-white">
                    {{ cardTitle }}
                </h2>
                <p class="mt-1 text-base text-outline-variant">
                    Complete el formulario técnico para iniciar la orden.
                </p>
            </div>

            <div
                class="mt-1 inline-flex items-center gap-2 rounded-md border border-[#2F6E99] bg-[#0A3A5F]/75 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            >
                <span class="material-symbols-outlined text-[16px] text-[#8ED4FF]">info</span>
                <span class="text-[#8ED4FF]">ID de Solicitud:</span>
                <span class="font-semibold text-[#E6F6FF]">{{ requestCodePreview }}</span>
            </div>
        </header>

        <form class="space-y-4" @submit.prevent="handleSubmit">
            <section
                class="rounded-xl border border-[#21405B] bg-surface-container-lowest/5 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
                <div class="flex items-center gap-3 border-b border-outline/20 pb-3">
                    <span class="material-symbols-outlined text-[24px] text-primary">badge</span>
                    <h3 class="text-base font-semibold text-white">Información General</h3>
                </div>

                <div class="mt-4 grid gap-3 lg:grid-cols-3">
                    <AppTextField
                        v-model="formModel.requestedBy"
                        label="Solicitado por"
                        :error="getFieldError('requestedBy')"
                        :readonly="mode === 'create'"
                        required
                        @blur="handleFieldBlur('requestedBy')"
                    />

                    <div class="space-y-1.5">
                        <label
                            class="block text-[0.65rem] font-label-caps uppercase text-secondary-container"
                        >
                            Cliente
                            <span class="text-status-error">*</span>
                        </label>
                        <AppSelect
                            v-model="formModel.clientName"
                            :clearable="false"
                            :input-class="
                                getFieldError('clientName')
                                    ? 'border-status-error focus:ring-status-error/40'
                                    : ''
                            "
                            :options="clientOptions"
                            :placeholder="
                                isLoadingClients ? 'Cargando clientes...' : 'Seleccione Cliente...'
                            "
                            :searchable="true"
                            @blur="handleFieldBlur('clientName')"
                        />
                        <p v-if="getFieldError('clientName')" class="text-xs text-status-error">
                            {{ getFieldError('clientName') }}
                        </p>
                    </div>

                    <AppTextField
                        v-model="formModel.productName"
                        label="Producto"
                        :error="getFieldError('productName')"
                        placeholder="Nombre del producto"
                        required
                        @blur="handleFieldBlur('productName')"
                    />
                </div>
            </section>

            <section
                class="rounded-xl border border-[#21405B] bg-surface-container-lowest/5 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
                <div class="flex items-center gap-3 border-b border-outline/20 pb-3">
                    <span class="material-symbols-outlined text-[24px] text-primary">tune</span>
                    <h3 class="text-base font-semibold text-white">Especificaciones Técnicas</h3>
                </div>

                <div class="mt-4 space-y-4">
                    <div>
                        <p
                            class="text-[0.85rem] uppercase tracking-[0.14em] text-secondary-container"
                        >
                            Medidas de la caja (MM)
                        </p>
                        <div class="mt-3 grid gap-3 md:grid-cols-3">
                            <AppTextField v-model="measures.length" placeholder="L  Largo" />
                            <AppTextField v-model="measures.width" placeholder="W  Ancho" />
                            <AppTextField v-model="measures.height" placeholder="H  Alto" />
                        </div>
                    </div>

                    <div class="grid gap-4 md:grid-cols-[minmax(0,1fr),420px]">
                        <AppTextField
                            v-model="formModel.pantoneReferences"
                            label="Colores (Pantones)"
                            placeholder="Ej: 286C, Black, Red 032"
                        />

                        <div class="space-y-1.5">
                            <label
                                class="block text-[0.65rem] font-label-caps uppercase text-secondary-container"
                            >
                                Tipo de cierre
                            </label>
                            <AppSelect
                                v-model="closureType"
                                :clearable="false"
                                :options="closureTypeOptions"
                                :searchable="false"
                            />
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <p
                                class="text-[0.85rem] uppercase tracking-[0.14em] text-secondary-container"
                            >
                                Detalle de material (Corrugado)
                            </p>

                            <div class="mt-3 grid gap-3 md:grid-cols-3">
                                <div class="space-y-1.5">
                                    <label
                                        class="block text-[0.65rem] font-label-caps uppercase text-secondary-container"
                                    >
                                        Flauta
                                    </label>
                                    <AppSelect
                                        v-model="material.flute"
                                        :clearable="false"
                                        :options="fluteOptions"
                                        :searchable="false"
                                    />
                                </div>

                                <AppTextField
                                    v-model="material.ect"
                                    label="ECT"
                                    placeholder="Ej: 32"
                                />

                                <AppTextField
                                    v-model="material.caliber"
                                    label="Calibre"
                                    placeholder="mm"
                                />

                                <div class="space-y-1.5">
                                    <label
                                        class="block text-[0.65rem] font-label-caps uppercase text-secondary-container"
                                    >
                                        Dirección flauta
                                    </label>
                                    <AppSelect
                                        v-model="material.fluteDirection"
                                        :clearable="false"
                                        :options="fluteDirectionOptions"
                                        :searchable="false"
                                    />
                                </div>

                                <AppTextField
                                    v-model="material.outerLiner"
                                    label="Liner Externo"
                                    placeholder="Gramos/Tipo"
                                />

                                <AppTextField
                                    v-model="material.innerLiner"
                                    label="Liner Interno"
                                    placeholder="Gramos/Tipo"
                                />
                            </div>
                        </div>

                        <div>
                            <p
                                class="text-[0.85rem] uppercase tracking-[0.14em] text-secondary-container"
                            >
                                Acabado
                            </p>
                            <div class="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                <button
                                    v-for="finish in finishingChoices"
                                    :key="finish"
                                    class="w-full rounded-md border px-3 py-2 text-sm transition-colors"
                                    :class="
                                        formModel.finishingOptions.includes(finish)
                                            ? 'border-white bg-primary/20 text-white'
                                            : 'border-outline/30 bg-surface-container-lowest/20 text-outline-variant hover:text-white'
                                    "
                                    type="button"
                                    @click="toggleFinishingOption(finish)"
                                >
                                    {{ finish }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                class="rounded-xl border border-[#21405B] bg-surface-container-lowest/5 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
                <div class="flex items-center gap-3 border-b border-outline/20 pb-3">
                    <span class="material-symbols-outlined text-[24px] text-primary">science</span>
                    <h3 class="text-base font-semibold text-white">Prototipos y Validaciones</h3>
                </div>

                <div class="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                    <button
                        class="w-full rounded-md border px-3 py-2 text-left transition-colors"
                        :class="
                            prototypeFlags.requireArt
                                ? 'border-white bg-primary/20 text-white'
                                : 'border-outline/30 bg-surface-container-lowest/20 text-outline-variant hover:text-white'
                        "
                        type="button"
                        @click="prototypeFlags.requireArt = !prototypeFlags.requireArt"
                    >
                        <span class="flex items-center gap-2.5">
                            <span
                                class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-primary/20 bg-primary/10"
                            >
                                <span class="material-symbols-outlined text-[15px]">palette</span>
                            </span>
                            <span>
                                <span class="block text-sm font-medium leading-tight"
                                    >Solicita Arte</span
                                >
                                <span class="text-[0.68rem] uppercase tracking-[0.12em]"
                                    >Diseño Gráfico</span
                                >
                            </span>
                        </span>
                    </button>

                    <button
                        class="w-full rounded-md border px-3 py-2 text-left transition-colors"
                        :class="
                            formModel.requireMockup
                                ? 'border-white bg-primary/20 text-white'
                                : 'border-outline/30 bg-surface-container-lowest/20 text-outline-variant hover:text-white'
                        "
                        type="button"
                        @click="formModel.requireMockup = !formModel.requireMockup"
                    >
                        <span class="flex items-center gap-2.5">
                            <span
                                class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-primary/20 bg-primary/10"
                            >
                                <span class="material-symbols-outlined text-[15px]"
                                    >deployed_code</span
                                >
                            </span>
                            <span>
                                <span class="block text-sm font-medium leading-tight"
                                    >Solicita Dummie</span
                                >
                                <span class="text-[0.68rem] uppercase tracking-[0.12em]"
                                    >Muestra Física</span
                                >
                            </span>
                        </span>
                    </button>

                    <button
                        class="w-full rounded-md border px-3 py-2 text-left transition-colors"
                        :class="
                            formModel.requireDieCut
                                ? 'border-white bg-primary/20 text-white'
                                : 'border-outline/30 bg-surface-container-lowest/20 text-outline-variant hover:text-white'
                        "
                        type="button"
                        @click="formModel.requireDieCut = !formModel.requireDieCut"
                    >
                        <span class="flex items-center gap-2.5">
                            <span
                                class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-primary/20 bg-primary/10"
                            >
                                <span class="material-symbols-outlined text-[15px]"
                                    >precision_manufacturing</span
                                >
                            </span>
                            <span>
                                <span class="block text-sm font-medium leading-tight"
                                    >Solicita Mecánico</span
                                >
                                <span class="text-[0.68rem] uppercase tracking-[0.12em]"
                                    >Plano Estructural</span
                                >
                            </span>
                        </span>
                    </button>
                </div>
            </section>

            <section class="grid gap-3 lg:grid-cols-2">
                <article
                    class="relative overflow-hidden rounded-xl border border-[#21405B] bg-surface-container-lowest/5 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                    <div
                        class="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-primary/10 blur-2xl"
                    />
                    <div
                        class="relative flex items-center justify-between gap-3 border-b border-outline/20 pb-2.5"
                    >
                        <div class="flex items-center gap-2.5">
                            <span
                                class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary"
                            >
                                <span class="material-symbols-outlined text-[18px]"
                                    >cloud_upload</span
                                >
                            </span>
                            <h3 class="text-base font-semibold text-white">
                                Archivos y Referencias
                            </h3>
                        </div>
                        <span
                            class="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-fixed-dim"
                        >
                            opcional
                        </span>
                    </div>

                    <p
                        class="mt-3 text-[0.7rem] uppercase tracking-[0.14em] text-secondary-container"
                    >
                        Arte del cliente
                    </p>

                    <input
                        ref="attachmentInputRef"
                        accept=".jpg,.jpeg,.png,.pdf,.eps,.ai,.ia,.svg"
                        class="hidden"
                        multiple
                        type="file"
                        @change="handleAttachmentSelection"
                    />

                    <button
                        class="mt-2.5 flex min-h-[170px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-[#4E6780] bg-surface-container-lowest/5 px-4 text-center transition-colors hover:border-primary/70 hover:bg-[#10283E]"
                        type="button"
                        @click="openAttachmentPicker"
                    >
                        <span
                            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary-fixed-dim"
                        >
                            <span class="material-symbols-outlined text-[20px]">upload_file</span>
                        </span>
                        <p class="mt-2 text-sm font-medium text-white">
                            Arrastra tus archivos o haz clic para cargar
                        </p>
                        <div class="mt-2 flex flex-wrap justify-center gap-1.5">
                            <span
                                class="rounded-md border border-outline/30 bg-surface-container-lowest/25 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-outline-variant"
                                >AI</span
                            >
                            <span
                                class="rounded-md border border-outline/30 bg-surface-container-lowest/25 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-outline-variant"
                                >PDF</span
                            >
                            <span
                                class="rounded-md border border-outline/30 bg-surface-container-lowest/25 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-outline-variant"
                                >PSD</span
                            >
                            <span
                                class="rounded-md border border-outline/30 bg-surface-container-lowest/25 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-outline-variant"
                                >PNG</span
                            >
                        </div>
                    </button>

                    <div v-if="formModel.attachments.length" class="mt-3 grid gap-2 sm:grid-cols-2">
                        <article
                            v-for="attachment in formModel.attachments"
                            :key="attachment.id"
                            class="rounded-lg border border-outline/25 bg-surface-container-lowest/25 px-3 py-2"
                        >
                            <p class="truncate text-sm font-semibold text-white">
                                {{ attachment.name }}
                            </p>
                            <p class="text-xs text-outline-variant">
                                {{ attachment.extension.toUpperCase() }} ·
                                {{ attachment.sizeKb }} KB
                            </p>
                        </article>
                    </div>

                    <p
                        class="mt-3 border-t border-outline/20 pt-2.5 text-xs italic text-outline-variant"
                    >
                        Cargar arte original agiliza validación de pantones y dimensiones.
                    </p>
                </article>

                <article
                    class="relative overflow-hidden rounded-xl border border-[#21405B] bg-surface-container-lowest/5 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                    <div
                        class="pointer-events-none absolute -left-10 -bottom-12 h-24 w-24 rounded-full bg-[#35B5FF]/10 blur-2xl"
                    />
                    <div
                        class="relative flex items-center justify-between gap-3 border-b border-outline/20 pb-2.5"
                    >
                        <div class="flex items-center gap-2.5">
                            <span
                                class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary"
                            >
                                <span class="material-symbols-outlined text-[18px]">chat</span>
                            </span>
                            <h3 class="text-base font-semibold text-white">
                                Instrucciones Adicionales
                            </h3>
                        </div>
                        <span class="text-[11px] text-outline-variant"
                            >{{ instructionLength }}/600</span
                        >
                    </div>

                    <p
                        class="mt-3 text-[0.7rem] uppercase tracking-[0.14em] text-secondary-container"
                    >
                        Comentarios específicos
                    </p>

                    <textarea
                        v-model="formModel.designInstructions"
                        class="mt-2.5 min-h-[190px] w-full rounded-lg border border-outline/30 bg-surface-container-lowest/5 px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-outline-variant/80 focus:border-primary"
                        :class="
                            getFieldError('designInstructions')
                                ? 'border-status-error focus:border-status-error focus:ring-status-error/40'
                                : ''
                        "
                        maxlength="600"
                        placeholder="Detalle cualquier requerimiento especial de embalaje, estiba o transporte..."
                        @blur="handleFieldBlur('designInstructions')"
                    />
                    <div class="mt-2 flex items-center justify-between gap-2">
                        <p class="text-[11px] text-outline-variant">
                            Recomendación: incluye restricciones de empaque, estiba y tiempos.
                        </p>
                        <p
                            v-if="getFieldError('designInstructions')"
                            class="text-xs text-status-error"
                        >
                            {{ getFieldError('designInstructions') }}
                        </p>
                    </div>
                </article>
            </section>

            <footer class="flex flex-wrap justify-end gap-2 border-t border-outline/20 pt-3">
                <AppButton size="lg" variant="ghost" @click="$emit('cancel')"> Cancelar </AppButton>
                <AppButton
                    icon="send"
                    icon-position="left"
                    size="lg"
                    type="submit"
                    variant="primary"
                >
                    {{ mode === 'create' ? 'Generar Solicitud' : 'Guardar cambios' }}
                </AppButton>
            </footer>
        </form>
    </article>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'
import AppSelect, { type AppSelectOption } from '~/presentation/shared/components/ui/AppSelect.vue'
import AppTextField from '~/presentation/shared/components/ui/AppTextField.vue'
import {
    useFormValidation,
    validationRules,
    type ValidationSchema,
} from '~/presentation/shared/composables/forms/useFormValidation'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'
import { useApiClient } from '~/presentation/shared/composables/useApiClient'
import { getAuthTokenProfile } from '~/presentation/auth/utils/auth-token.util'
import { toRequestAttachmentFromFile } from '~/presentation/requests/composables/useRequestsModule'
import type { DesignRequestFormModel } from '~/presentation/interfaces/requests/request-form.interface'

type RequestFormMode = 'create' | 'edit'

interface RequestFormCardProps {
    mode: RequestFormMode
    model: DesignRequestFormModel
}

defineOptions({
    name: 'RequestFormCard',
})

const props = defineProps<RequestFormCardProps>()
const emit = defineEmits<{
    cancel: []
    submit: [model: DesignRequestFormModel]
}>()

const toast = useAppToast()
const apiClient = useApiClient()
const attachmentInputRef = ref<HTMLInputElement | null>(null)

const accessToken = useCookie<string | null>('access_token')
const currentUserName = computed(() => {
    const token = accessToken.value
    return token ? (getAuthTokenProfile(token)?.fullName ?? '') : ''
})
const clientOptions = ref<AppSelectOption[]>([])
const isLoadingClients = ref(false)

onMounted(async () => {
    isLoadingClients.value = true
    try {
        const response = await apiClient.get<Array<{ name: string; code: string }>>('/clients')
        clientOptions.value = response.data.map((c) => ({ label: c.name, value: c.name }))
    } catch {
        toast.error('No se pudieron cargar los clientes.')
    } finally {
        isLoadingClients.value = false
    }
})

const formModel = reactive<DesignRequestFormModel>({
    clientName: '',
    brandName: '',
    productName: '',
    requestedBy: '',
    vendorName: '',
    materialType: '',
    materialWeight: '',
    printTechnique: '',
    colorMode: '',
    pantoneReferences: '',
    finishingOptions: [],
    deliverables: [],
    dimensions: '',
    quantity: '',
    requiredDate: '',
    priority: 'Media',
    status: 'Borrador',
    designInstructions: '',
    visualReferences: '',
    requireDieCut: false,
    requireMockup: false,
    attachments: [],
})

const measures = reactive({
    length: '',
    width: '',
    height: '',
})

const material = reactive({
    flute: 'C',
    ect: '',
    caliber: '',
    fluteDirection: 'Vertical',
    outerLiner: '',
    innerLiner: '',
})

const prototypeFlags = reactive({
    requireArt: true,
})

const closureType = ref('Tapa y Fondo')

const closureTypeOptions: AppSelectOption[] = [
    { label: 'Tapa y Fondo', value: 'Tapa y Fondo' },
    { label: 'Autoarmable', value: 'Autoarmable' },
    { label: 'Pegado lateral', value: 'Pegado lateral' },
]

const fluteOptions: AppSelectOption[] = [
    { label: 'C', value: 'C' },
    { label: 'B', value: 'B' },
    { label: 'E', value: 'E' },
]

const fluteDirectionOptions: AppSelectOption[] = [
    { label: 'Vertical', value: 'Vertical' },
    { label: 'Horizontal', value: 'Horizontal' },
]

const finishingChoices = ['Barniz UV', 'Laminado Mate', 'Hot Stamping', 'Relieve']

const allowedExtensions = new Set(['jpg', 'jpeg', 'png', 'pdf', 'eps', 'ai', 'ia', 'svg'])

const schema: ValidationSchema<DesignRequestFormModel> = {
    clientName: [validationRules.required<DesignRequestFormModel>('El cliente es requerido.')],
    productName: [validationRules.required<DesignRequestFormModel>('El producto es requerido.')],
    requestedBy: [validationRules.required<DesignRequestFormModel>('El solicitante es requerido.')],
    designInstructions: [
        validationRules.required<DesignRequestFormModel>(
            'Las instrucciones para diseño son requeridas.',
        ),
    ],
}

const { validateAll, validateField, setFieldTouched, getFieldError, clearValidation } =
    useFormValidation(formModel, schema)

const cardTitle = computed(() => (props.mode === 'create' ? 'Nueva Solicitud' : 'Editar Solicitud'))

const requestCodePreview = computed(() => {
    const year = new Date().getFullYear()
    return `REQ-${year}-0892`
})
const instructionLength = computed(() => formModel.designInstructions.trim().length)

const syncDerivedFieldsFromModel = () => {
    const dimensionMatch = formModel.dimensions.match(/([^x]+)x([^x]+)x([^x]+)/i)
    if (dimensionMatch) {
        measures.length = dimensionMatch[1]?.trim() || ''
        measures.width = dimensionMatch[2]?.trim() || ''
        measures.height = dimensionMatch[3]?.trim() || ''
    }

    const [ect = '', caliber = ''] = formModel.materialWeight.split('/').map((item) => item.trim())
    material.ect = ect
    material.caliber = caliber
    material.flute = formModel.materialType || 'C'
    closureType.value = formModel.printTechnique || 'Tapa y Fondo'
}

const syncFormModel = () => {
    Object.assign(formModel, {
        ...props.model,
        finishingOptions: [...props.model.finishingOptions],
        deliverables: [...props.model.deliverables],
        attachments: [...props.model.attachments],
    })
    syncDerivedFieldsFromModel()
}

const handleFieldBlur = (field: keyof DesignRequestFormModel) => {
    setFieldTouched(field)
    validateField(field)
}

const openAttachmentPicker = () => {
    attachmentInputRef.value?.click()
}

const handleAttachmentSelection = (event: Event) => {
    const target = event.target as HTMLInputElement
    const selectedFiles = target.files ? Array.from(target.files) : []

    if (!selectedFiles.length) {
        return
    }

    const validAttachments = selectedFiles
        .filter((file) => {
            const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
            return allowedExtensions.has(extension)
        })
        .map((file) => toRequestAttachmentFromFile(file))

    const invalidCount = selectedFiles.length - validAttachments.length

    formModel.attachments = [...formModel.attachments, ...validAttachments]

    if (invalidCount > 0) {
        toast.warning(`Se ignoraron ${invalidCount} archivo(s) con formato no permitido.`)
    }

    target.value = ''
}

const toggleFinishingOption = (option: string) => {
    if (formModel.finishingOptions.includes(option)) {
        formModel.finishingOptions = formModel.finishingOptions.filter((item) => item !== option)
        return
    }

    formModel.finishingOptions = [...formModel.finishingOptions, option]
}

const normalizeFormBeforeSubmit = () => {
    formModel.brandName = formModel.brandName || formModel.clientName || 'Sin marca'
    formModel.vendorName = formModel.vendorName || formModel.requestedBy || 'Sin asignar'
    formModel.materialType = material.flute
    formModel.materialWeight = [material.ect, material.caliber].filter(Boolean).join(' / ')
    formModel.printTechnique = closureType.value
    formModel.colorMode = formModel.pantoneReferences.trim() ? 'Pantone' : 'CMYK'
    formModel.dimensions = `${measures.length} x ${measures.width} x ${measures.height}`
    formModel.quantity = formModel.quantity || '1'
    formModel.requiredDate = formModel.requiredDate || new Date().toISOString().slice(0, 10)
    formModel.deliverables = [
        prototypeFlags.requireArt ? 'Arte final' : '',
        formModel.requireMockup ? 'Mockup 3D' : '',
        formModel.requireDieCut ? 'Plano de troquel' : '',
    ].filter(Boolean)
}

const handleSubmit = () => {
    normalizeFormBeforeSubmit()

    if (!validateAll()) {
        toast.error('Completa los campos requeridos para continuar.')
        return
    }

    emit('submit', { ...formModel })
    clearValidation()
}

watch(
    () => props.model,
    () => {
        syncFormModel()
        if (props.mode === 'create') {
            formModel.requestedBy = currentUserName.value
        }
        clearValidation()
    },
    { immediate: true, deep: true },
)
</script>
