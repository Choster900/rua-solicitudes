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
            <!-- Información General -->
            <section
                class="rounded-xl border border-[#21405B] bg-surface-container-lowest/5 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
                <div class="flex items-center gap-3 border-b border-outline/20 pb-3">
                    <span class="material-symbols-outlined text-[24px] text-primary">badge</span>
                    <h3 class="text-base font-semibold text-white">Información General</h3>
                </div>

                <div class="mt-4 grid gap-3 lg:grid-cols-3">
                    <div class="space-y-1.5">
                        <label
                            class="block text-[0.65rem] font-label-caps uppercase text-secondary-container"
                        >
                            Cliente
                            <span class="text-status-error">*</span>
                        </label>
                        <AppSelect
                            v-model="formModel.clientId"
                            :clearable="false"
                            :input-class="
                                getFieldError('clientId')
                                    ? 'border-status-error focus:ring-status-error/40'
                                    : ''
                            "
                            :options="clientOptions"
                            :placeholder="
                                isLoadingClients ? 'Cargando clientes...' : 'Seleccione Cliente...'
                            "
                            :searchable="true"
                            @blur="handleFieldBlur('clientId')"
                        />
                        <p v-if="getFieldError('clientId')" class="text-xs text-status-error">
                            {{ getFieldError('clientId') }}
                        </p>
                    </div>

                    <AppTextField
                        v-model="formModel.title"
                        label="Título"
                        :error="getFieldError('title')"
                        placeholder="Descripción breve de la solicitud"
                        required
                        @blur="handleFieldBlur('title')"
                    />

                    <AppTextField
                        v-model="formModel.productName"
                        label="Producto"
                        :error="getFieldError('productName')"
                        placeholder="Nombre del producto"
                        required
                        @blur="handleFieldBlur('productName')"
                    />

                    <AppTextField
                        v-model="formModel.brandName"
                        label="Marca"
                        placeholder="Nombre de la marca"
                    />

                    <div class="space-y-1.5">
                        <label
                            class="block text-[0.65rem] font-label-caps uppercase text-secondary-container"
                        >
                            Prioridad
                        </label>
                        <AppSelect
                            v-model="formModel.priority"
                            :clearable="false"
                            :options="priorityOptions"
                            :searchable="false"
                        />
                    </div>

                    <AppTextField
                        v-model="formModel.requiredDate"
                        label="Fecha de entrega"
                        type="date"
                    />
                </div>
            </section>

            <!-- Especificaciones Técnicas -->
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
                            Medidas de la caja
                        </p>
                        <div class="mt-3 grid gap-3 md:grid-cols-4">
                            <AppTextField v-model="formModel.length" placeholder="L  Largo" />
                            <AppTextField v-model="formModel.width" placeholder="W  Ancho" />
                            <AppTextField v-model="formModel.height" placeholder="H  Alto" />
                            <div class="space-y-1.5">
                                <label
                                    class="block text-[0.65rem] font-label-caps uppercase text-secondary-container"
                                >
                                    Unidad
                                </label>
                                <AppSelect
                                    v-model="formModel.dimensionUnit"
                                    :clearable="false"
                                    :options="dimensionUnitOptions"
                                    :searchable="false"
                                />
                            </div>
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
                                v-model="formModel.closureType"
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
                                        v-model="formModel.fluteType"
                                        :clearable="false"
                                        :options="fluteOptions"
                                        :searchable="false"
                                    />
                                </div>

                                <AppTextField
                                    v-model="materialEct"
                                    label="ECT"
                                    placeholder="Ej: 32"
                                />

                                <AppTextField
                                    v-model="materialCaliber"
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
                                        v-model="formModel.fluteDirection"
                                        :clearable="false"
                                        :options="fluteDirectionOptions"
                                        :searchable="false"
                                    />
                                </div>

                                <AppTextField
                                    v-model="formModel.outerLiner"
                                    label="Liner Externo"
                                    placeholder="Gramos/Tipo"
                                />

                                <AppTextField
                                    v-model="formModel.innerLiner"
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

            <!-- Prototipos y Validaciones -->
            <section
                class="rounded-xl border border-[#21405B] bg-surface-container-lowest/5 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
                <div class="flex items-center gap-3 border-b border-outline/20 pb-3">
                    <span class="material-symbols-outlined text-[24px] text-primary">science</span>
                    <h3 class="text-base font-semibold text-white">Prototipos y Validaciones</h3>
                </div>

                <div class="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-2">
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

            <!-- Archivos e instrucciones -->
            <section class="grid gap-3 lg:grid-cols-2">
                <!-- Archivo de muestra -->
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
                            <h3 class="text-base font-semibold text-white">Archivo de Muestra</h3>
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
                        ref="fileInputRef"
                        accept=".jpg,.jpeg,.png,.pdf,.eps,.ai,.svg"
                        class="hidden"
                        multiple
                        type="file"
                        @change="handleFileSelection"
                    />

                    <button
                        class="mt-2.5 flex min-h-[80px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-[#4E6780] bg-surface-container-lowest/5 px-4 text-center transition-colors hover:border-primary/70 hover:bg-[#10283E]"
                        type="button"
                        @click="fileInputRef?.click()"
                    >
                        <span
                            class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary-fixed-dim"
                        >
                            <span class="material-symbols-outlined text-[20px]">upload_file</span>
                        </span>
                        <p class="mt-1.5 text-sm font-medium text-white">
                            Haz clic para agregar archivos
                        </p>
                        <div class="mt-1.5 flex flex-wrap justify-center gap-1.5">
                            <span
                                v-for="ext in ['AI', 'PDF', 'PNG', 'JPG', 'SVG']"
                                :key="ext"
                                class="rounded-md border border-outline/30 bg-surface-container-lowest/25 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-outline-variant"
                            >
                                {{ ext }}
                            </span>
                        </div>
                    </button>

                    <div v-if="formModel.sampleFiles.length" class="mt-3 space-y-2">
                        <div
                            v-for="(file, index) in formModel.sampleFiles"
                            :key="index"
                            class="space-y-1.5 rounded-lg border border-outline/25 bg-surface-container-lowest/25 px-3 py-2"
                        >
                            <div class="flex items-center justify-between">
                                <div class="min-w-0">
                                    <p class="truncate text-sm font-semibold text-white">
                                        {{ file.originalName }}
                                    </p>
                                    <p class="text-xs text-outline-variant">
                                        {{ file.mimeType }}
                                    </p>
                                </div>
                                <button
                                    class="ml-2 flex-shrink-0 text-outline-variant hover:text-rose-300"
                                    type="button"
                                    title="Quitar archivo"
                                    @click="removeFile(index)"
                                >
                                    <span class="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>
                            <textarea
                                v-model="file.notes"
                                class="w-full rounded-lg border border-outline/30 bg-surface-container-lowest/5 px-3 py-1.5 text-xs text-white outline-none transition-colors placeholder:text-outline-variant/80 focus:border-primary"
                                rows="2"
                                placeholder="Notas sobre este archivo..."
                            />
                        </div>
                    </div>

                    <p
                        class="mt-3 border-t border-outline/20 pt-2.5 text-xs italic text-outline-variant"
                    >
                        Cargar arte original agiliza validación de pantones y dimensiones.
                    </p>
                </article>

                <!-- Instrucciones adicionales -->
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
import { useApiClient } from '~/presentation/shared/composables/useApiClient'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'
import type { Client } from '~/presentation/interfaces/clients/client.interface'
import type { DesignRequestFormModel } from '~/presentation/interfaces/requests/request-form.interface'

type RequestFormMode = 'create' | 'edit'

interface RequestFormCardProps {
    mode: RequestFormMode
    model: DesignRequestFormModel
}

defineOptions({ name: 'RequestFormCard' })

const props = defineProps<RequestFormCardProps>()
const emit = defineEmits<{
    cancel: []
    submit: [model: DesignRequestFormModel]
}>()

const apiClient = useApiClient()
const toast = useAppToast()
const fileInputRef = ref<HTMLInputElement | null>(null)
const clientOptions = ref<AppSelectOption[]>([])
const isLoadingClients = ref(false)

// ECT / Caliber are split from materialWeight for UX
const materialEct = ref('')
const materialCaliber = ref('')

const formModel = reactive<DesignRequestFormModel>({
    clientId: '',
    title: '',
    brandName: '',
    productName: '',
    priority: 'MEDIUM',
    requiredDate: '',
    materialType: 'C',
    materialWeight: '',
    fluteType: 'C',
    fluteDirection: 'Vertical',
    closureType: 'Tapa y Fondo',
    outerLiner: '',
    innerLiner: '',
    colorMode: 'CMYK',
    pantoneReferences: '',
    length: '',
    width: '',
    height: '',
    dimensionUnit: 'cm',
    quantity: '',
    finishingOptions: [],
    deliverables: [],
    designInstructions: '',
    requireDieCut: false,
    requireMockup: false,
    sampleFiles: [],
})

const priorityOptions: AppSelectOption[] = [
    { label: 'Baja', value: 'LOW' },
    { label: 'Media', value: 'MEDIUM' },
    { label: 'Alta', value: 'HIGH' },
    { label: 'Urgente', value: 'URGENT' },
]

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

const dimensionUnitOptions: AppSelectOption[] = [
    { label: 'cm', value: 'cm' },
    { label: 'mm', value: 'mm' },
    { label: 'in', value: 'in' },
]

const finishingChoices = ['Barniz UV', 'Laminado Mate', 'Hot Stamping', 'Relieve']

const schema: ValidationSchema<DesignRequestFormModel> = {
    clientId: [validationRules.required<DesignRequestFormModel>('El cliente es requerido.')],
    title: [validationRules.required<DesignRequestFormModel>('El título es requerido.')],
    productName: [validationRules.required<DesignRequestFormModel>('El producto es requerido.')],
}

const { validateAll, validateField, setFieldTouched, getFieldError, clearValidation } =
    useFormValidation(formModel, schema)

const cardTitle = computed(() => (props.mode === 'create' ? 'Nueva Solicitud' : 'Editar Solicitud'))

const requestCodePreview = computed(() => {
    const year = new Date().getFullYear()
    return `SOL-${year}-???`
})

const instructionLength = computed(() => formModel.designInstructions.trim().length)

const handleFieldBlur = (field: keyof DesignRequestFormModel) => {
    setFieldTouched(field)
    validateField(field)
}

const toggleFinishingOption = (option: string) => {
    if (formModel.finishingOptions.includes(option)) {
        formModel.finishingOptions = formModel.finishingOptions.filter((item) => item !== option)
    } else {
        formModel.finishingOptions = [...formModel.finishingOptions, option]
    }
}

const handleFileSelection = (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = target.files ? Array.from(target.files) : []
    if (!files.length) return

    files.forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result as string
            const base64Content = result.split(',')[1] ?? ''
            formModel.sampleFiles.push({
                base64Content,
                mimeType: file.type,
                originalName: file.name,
                notes: '',
            })
        }
        reader.readAsDataURL(file)
    })
    target.value = ''
}

const removeFile = (index: number) => {
    formModel.sampleFiles.splice(index, 1)
}

const syncMaterialWeight = () => {
    formModel.materialWeight = [materialEct.value, materialCaliber.value]
        .filter(Boolean)
        .join(' / ')
}

watch([materialEct, materialCaliber], syncMaterialWeight)

const syncFormModel = () => {
    Object.assign(formModel, {
        ...props.model,
        finishingOptions: [...props.model.finishingOptions],
        deliverables: [...props.model.deliverables],
        sampleFiles: [...(props.model.sampleFiles ?? [])],
    })
    // Parse materialWeight back to ECT / Caliber fields
    const parts = formModel.materialWeight.split('/').map((s) => s.trim())
    materialEct.value = parts[0] ?? ''
    materialCaliber.value = parts[1] ?? ''
}

const hydrateClients = async () => {
    isLoadingClients.value = true
    try {
        const response = await apiClient.get<Client[]>('/clients')
        const sorted = [...response.data].sort((a, b) => a.name.localeCompare(b.name, 'es'))
        clientOptions.value = sorted.map((c) => ({ label: c.name, value: c.id }))
    } catch {
        toast.warning('No fue posible cargar los clientes guardados.')
    } finally {
        isLoadingClients.value = false
    }
}

const handleSubmit = () => {
    syncMaterialWeight()

    // Build deliverables from prototype flags
    formModel.deliverables = [
        formModel.requireMockup ? 'Mockup 3D' : '',
        formModel.requireDieCut ? 'Plano de troquel' : '',
    ].filter(Boolean)

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
        clearValidation()
    },
    { immediate: true, deep: true },
)

onMounted(() => {
    void hydrateClients()
})
</script>
