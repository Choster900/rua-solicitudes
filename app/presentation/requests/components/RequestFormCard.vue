<template>
  <article class="w-full rounded-2xl border border-outline/30 bg-deep-navy shadow-xl">
    <header class="border-b border-outline/20 px-5 py-4">
      <p class="text-xs uppercase tracking-[0.12em] text-secondary-container">
        Brief de diseño para imprenta
      </p>
      <h2 class="mt-1 text-xl font-headline-md font-semibold text-white">
        {{ cardTitle }}
      </h2>
      <p class="mt-1 text-sm text-outline-variant">
        Completa la información técnica para que el equipo de diseño trabaje con precisión y sin retrabajos.
      </p>
    </header>

    <form
      class="space-y-6 px-5 py-5"
      @submit.prevent="handleSubmit"
    >
      <section class="grid gap-4 md:grid-cols-2">
        <AppTextField
          v-model="formModel.clientName"
          icon="business"
          label="Cliente"
          :error="getFieldError('clientName')"
          required
          @blur="handleFieldBlur('clientName')"
        />
        <AppTextField
          v-model="formModel.brandName"
          icon="style"
          label="Marca"
          :error="getFieldError('brandName')"
          required
          @blur="handleFieldBlur('brandName')"
        />
        <AppTextField
          v-model="formModel.productName"
          icon="inventory_2"
          label="Producto / Presentación"
          :error="getFieldError('productName')"
          required
          @blur="handleFieldBlur('productName')"
        />
        <AppTextField
          v-model="formModel.requestedBy"
          icon="person"
          label="Solicitado por"
          :error="getFieldError('requestedBy')"
          required
          @blur="handleFieldBlur('requestedBy')"
        />
        <AppTextField
          v-model="formModel.vendorName"
          icon="badge"
          label="Vendedor responsable"
          :error="getFieldError('vendorName')"
          required
          @blur="handleFieldBlur('vendorName')"
        />
        <div class="space-y-1.5">
          <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
            Prioridad <span class="text-status-error">*</span>
          </label>
          <AppSelect
            v-model="formModel.priority"
            :clearable="false"
            icon="priority_high"
            :input-class="getFieldError('priority') ? 'border-status-error focus:ring-status-error/40' : ''"
            :options="priorityOptions"
            :searchable="false"
            @blur="handleFieldBlur('priority')"
          />
          <p
            v-if="getFieldError('priority')"
            class="text-xs text-status-error"
          >
            {{ getFieldError('priority') }}
          </p>
        </div>
      </section>

      <section class="rounded-xl border border-outline/20 bg-surface-container-low/5 p-4">
        <h3 class="text-sm font-semibold text-white">
          Especificación Técnica de Producción
        </h3>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <div class="space-y-1.5">
            <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
              Tipo de material <span class="text-status-error">*</span>
            </label>
            <AppSelect
              v-model="formModel.materialType"
              compact
              :clearable="false"
              icon="layers"
              :input-class="getFieldError('materialType') ? '!py-1.5 border-status-error focus:ring-status-error/40' : '!py-1.5'"
              :options="materialTypeOptions"
              @blur="handleFieldBlur('materialType')"
            />
            <p
              v-if="getFieldError('materialType')"
              class="text-xs text-status-error"
            >
              {{ getFieldError('materialType') }}
            </p>
          </div>

          <AppTextField
            v-model="formModel.materialWeight"
            icon="straighten"
            label="Calibre / Gramaje"
            :error="getFieldError('materialWeight')"
            required
            @blur="handleFieldBlur('materialWeight')"
          />

          <div class="space-y-1.5">
            <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
              Técnica de impresión <span class="text-status-error">*</span>
            </label>
            <AppSelect
              v-model="formModel.printTechnique"
              compact
              :clearable="false"
              icon="print"
              :input-class="getFieldError('printTechnique') ? '!py-1.5 border-status-error focus:ring-status-error/40' : '!py-1.5'"
              :options="printTechniqueOptions"
              @blur="handleFieldBlur('printTechnique')"
            />
            <p
              v-if="getFieldError('printTechnique')"
              class="text-xs text-status-error"
            >
              {{ getFieldError('printTechnique') }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
              Modo de color <span class="text-status-error">*</span>
            </label>
            <AppSelect
              v-model="formModel.colorMode"
              compact
              :clearable="false"
              icon="palette"
              :input-class="getFieldError('colorMode') ? '!py-1.5 border-status-error focus:ring-status-error/40' : '!py-1.5'"
              :options="colorModeOptions"
              @blur="handleFieldBlur('colorMode')"
            />
            <p
              v-if="getFieldError('colorMode')"
              class="text-xs text-status-error"
            >
              {{ getFieldError('colorMode') }}
            </p>
          </div>

          <AppTextField
            v-model="formModel.pantoneReferences"
            icon="format_paint"
            label="Referencias Pantone"
            placeholder="Ej. Pantone 186 C, Pantone Black C"
            @blur="handleFieldBlur('pantoneReferences')"
          />

          <AppTextField
            v-model="formModel.dimensions"
            icon="aspect_ratio"
            label="Dimensiones (ancho x alto x fondo)"
            :error="getFieldError('dimensions')"
            placeholder="Ej. 32 x 22 x 10 cm"
            required
            @blur="handleFieldBlur('dimensions')"
          />

          <div class="space-y-1.5">
            <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
              Cantidad de producción <span class="text-status-error">*</span>
            </label>
            <input
              v-model="formModel.quantity"
              class="w-full rounded-lg border border-outline/30 bg-surface-container-lowest/5 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/40"
              :class="getFieldError('quantity') ? 'border-status-error focus:border-status-error focus:ring-status-error/40' : ''"
              min="1"
              step="1"
              type="number"
              @blur="handleFieldBlur('quantity')"
            >
            <p
              v-if="getFieldError('quantity')"
              class="text-xs text-status-error"
            >
              {{ getFieldError('quantity') }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
              Fecha requerida <span class="text-status-error">*</span>
            </label>
            <AppDatePicker
              v-model="formModel.requiredDate"
              :input-class="getFieldError('requiredDate') ? 'border-status-error focus:ring-status-error/40' : ''"
              with-leading-icon
              @blur="handleFieldBlur('requiredDate')"
            />
            <p
              v-if="getFieldError('requiredDate')"
              class="text-xs text-status-error"
            >
              {{ getFieldError('requiredDate') }}
            </p>
          </div>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-2">
        <div class="space-y-1.5">
          <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
            Acabados requeridos <span class="text-status-error">*</span>
          </label>
          <AppSelect
            v-model="formModel.finishingOptions"
            compact
            icon="auto_awesome"
            :input-class="getFieldError('finishingOptions') ? '!py-1.5 border-status-error focus:ring-status-error/40' : '!py-1.5'"
            multiple
            :options="finishingOptions"
            placeholder="Selecciona uno o más acabados"
            @blur="handleFieldBlur('finishingOptions')"
          />
          <p
            v-if="getFieldError('finishingOptions')"
            class="text-xs text-status-error"
          >
            {{ getFieldError('finishingOptions') }}
          </p>
        </div>

        <div class="space-y-1.5">
          <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
            Entregables de diseño <span class="text-status-error">*</span>
          </label>
          <AppSelect
            v-model="formModel.deliverables"
            compact
            icon="fact_check"
            :input-class="getFieldError('deliverables') ? '!py-1.5 border-status-error focus:ring-status-error/40' : '!py-1.5'"
            multiple
            :options="deliverableOptions"
            placeholder="Selecciona uno o más entregables"
            @blur="handleFieldBlur('deliverables')"
          />
          <p
            v-if="getFieldError('deliverables')"
            class="text-xs text-status-error"
          >
            {{ getFieldError('deliverables') }}
          </p>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-2">
        <AppCheckbox
          v-model="formModel.requireDieCut"
          label="Requiere plano de troquel"
        />
        <AppCheckbox
          v-model="formModel.requireMockup"
          label="Requiere mockup de validación"
        />
      </section>

      <section class="grid gap-4 md:grid-cols-2">
        <div class="space-y-1.5 md:col-span-2">
          <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
            Instrucciones para diseño <span class="text-status-error">*</span>
          </label>
          <textarea
            v-model="formModel.designInstructions"
            class="min-h-[120px] w-full rounded-lg border border-outline/30 bg-surface-container-lowest/5 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/40"
            :class="getFieldError('designInstructions') ? 'border-status-error focus:border-status-error focus:ring-status-error/40' : ''"
            placeholder="Describe estructura visual, mensajes clave, restricciones legales, y cualquier detalle de imprenta importante."
            @blur="handleFieldBlur('designInstructions')"
          />
          <p
            v-if="getFieldError('designInstructions')"
            class="text-xs text-status-error"
          >
            {{ getFieldError('designInstructions') }}
          </p>
        </div>

        <div class="space-y-1.5 md:col-span-2">
          <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
            Referencias visuales (URL, drive, figma)
          </label>
          <textarea
            v-model="formModel.visualReferences"
            class="min-h-[90px] w-full rounded-lg border border-outline/30 bg-surface-container-lowest/5 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/40"
            placeholder="Links de inspiración, manuales de marca o repositorios de imágenes."
          />
        </div>
      </section>

      <section class="rounded-xl border border-outline/20 bg-surface-container-low/5 p-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="text-sm font-semibold text-white">
              Archivos adjuntos
            </h3>
            <p class="text-xs text-outline-variant">
              Acepta `jpg`, `png`, `pdf`, `eps`, `ai` y `.ia` para Illustrator.
            </p>
          </div>

          <AppButton
            icon="attach_file"
            size="sm"
            variant="secondary"
            @click="openAttachmentPicker"
          >
            Agregar archivo
          </AppButton>
          <input
            ref="attachmentInputRef"
            accept=".jpg,.jpeg,.png,.pdf,.eps,.ai,.ia,.svg"
            class="hidden"
            multiple
            type="file"
            @change="handleAttachmentSelection"
          >
        </div>

        <div
          v-if="formModel.attachments.length > 0"
          class="mt-4 grid gap-2 sm:grid-cols-2"
        >
          <article
            v-for="attachment in formModel.attachments"
            :key="attachment.id"
            class="flex items-center justify-between rounded-lg border border-outline/20 bg-surface-container-lowest/5 px-3 py-2"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-white">
                {{ attachment.name }}
              </p>
              <p class="text-[11px] uppercase tracking-[0.08em] text-outline-variant">
                {{ attachment.extension }} · {{ attachment.sizeKb }} KB
              </p>
            </div>
            <button
              class="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-outline-variant transition-colors hover:bg-rose-500/20 hover:text-rose-200"
              type="button"
              title="Quitar adjunto"
              @click="removeAttachment(attachment.id)"
            >
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </article>
        </div>

        <p
          v-else
          class="mt-3 rounded-lg border border-dashed border-outline/30 px-3 py-4 text-center text-sm text-outline-variant"
        >
          No hay archivos adjuntos aún.
        </p>
      </section>

      <footer class="flex flex-wrap justify-end gap-2 border-t border-outline/20 pt-4">
        <AppButton
          size="md"
          variant="ghost"
          @click="$emit('cancel')"
        >
          Cancelar
        </AppButton>
        <AppButton
          icon="save"
          size="md"
          type="submit"
          variant="primary"
        >
          {{ mode === 'create' ? 'Crear solicitud' : 'Guardar cambios' }}
        </AppButton>
      </footer>
    </form>
  </article>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'
import AppCheckbox from '~/presentation/shared/components/ui/AppCheckbox.vue'
import AppDatePicker from '~/presentation/shared/components/ui/AppDatePicker.vue'
import AppSelect from '~/presentation/shared/components/ui/AppSelect.vue'
import AppTextField from '~/presentation/shared/components/ui/AppTextField.vue'
import { useFormValidation, validationRules, type ValidationSchema } from '~/presentation/shared/composables/forms/useFormValidation'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'
import { toRequestAttachmentFromFile } from '~/presentation/requests/composables/useRequestsModule'
import type { DesignRequestFormModel } from '~/presentation/requests/interfaces/request-form.interface'

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
const attachmentInputRef = ref<HTMLInputElement | null>(null)
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

const materialTypeOptions = [
  { label: 'Cartulina SBS', value: 'Cartulina SBS' },
  { label: 'Microcorrugado E', value: 'Microcorrugado E' },
  { label: 'BOPP Blanco', value: 'BOPP Blanco' },
  { label: 'Kraft Natural', value: 'Kraft Natural' },
  { label: 'Cartón Dúplex', value: 'Cartón Dúplex' },
]
const printTechniqueOptions = [
  { label: 'Offset UV', value: 'Offset UV' },
  { label: 'Flexografía', value: 'Flexografía' },
  { label: 'Digital', value: 'Digital' },
  { label: 'Serigrafía', value: 'Serigrafía' },
]
const colorModeOptions = [
  { label: 'CMYK', value: 'CMYK' },
  { label: 'CMYK + Pantone', value: 'CMYK + Pantone' },
  { label: 'Pantone', value: 'Pantone' },
]
const finishingOptions = [
  { label: 'Barniz UV', value: 'Barniz UV' },
  { label: 'Laminado Mate', value: 'Laminado Mate' },
  { label: 'Laminado Brillante', value: 'Laminado Brillante' },
  { label: 'Hot Stamping', value: 'Hot Stamping' },
  { label: 'Relieve', value: 'Relieve' },
  { label: 'Troquelado', value: 'Troquelado' },
  { label: 'Sin acabado', value: 'Sin acabado' },
]
const deliverableOptions = [
  { label: 'Arte final', value: 'Arte final' },
  { label: 'Mockup 3D', value: 'Mockup 3D' },
  { label: 'Plano de troquel', value: 'Plano de troquel' },
  { label: 'Adaptaciones de línea', value: 'Adaptaciones de línea' },
]
const priorityOptions = [
  { label: 'Alta', value: 'Alta' },
  { label: 'Media', value: 'Media' },
  { label: 'Baja', value: 'Baja' },
]
const allowedExtensions = new Set(['jpg', 'jpeg', 'png', 'pdf', 'eps', 'ai', 'ia', 'svg'])

const schema: ValidationSchema<DesignRequestFormModel> = {
  clientName: [validationRules.required<DesignRequestFormModel>('El cliente es requerido.')],
  brandName: [validationRules.required<DesignRequestFormModel>('La marca es requerida.')],
  productName: [validationRules.required<DesignRequestFormModel>('El producto es requerido.')],
  requestedBy: [validationRules.required<DesignRequestFormModel>('El solicitante es requerido.')],
  vendorName: [validationRules.required<DesignRequestFormModel>('El vendedor responsable es requerido.')],
  materialType: [validationRules.required<DesignRequestFormModel>('Selecciona un tipo de material.')],
  materialWeight: [validationRules.required<DesignRequestFormModel>('El calibre o gramaje es requerido.')],
  printTechnique: [validationRules.required<DesignRequestFormModel>('Selecciona una técnica de impresión.')],
  colorMode: [validationRules.required<DesignRequestFormModel>('Selecciona un modo de color.')],
  finishingOptions: [
    validationRules.custom<DesignRequestFormModel, string[]>(
      value => Array.isArray(value) && value.length > 0,
      'Selecciona al menos un acabado.',
    ),
  ],
  deliverables: [
    validationRules.custom<DesignRequestFormModel, string[]>(
      value => Array.isArray(value) && value.length > 0,
      'Selecciona al menos un entregable.',
    ),
  ],
  dimensions: [validationRules.required<DesignRequestFormModel>('Las dimensiones son requeridas.')],
  quantity: [
    validationRules.required<DesignRequestFormModel>('La cantidad de producción es requerida.'),
    validationRules.custom<DesignRequestFormModel, string>(
      value => Number(value) > 0,
      'La cantidad debe ser mayor a 0.',
    ),
  ],
  requiredDate: [validationRules.required<DesignRequestFormModel>('La fecha requerida es obligatoria.')],
  priority: [validationRules.required<DesignRequestFormModel>('Selecciona una prioridad.')],
  designInstructions: [validationRules.required<DesignRequestFormModel>('Las instrucciones para diseño son requeridas.')],
}

const {
  validateAll,
  validateField,
  setFieldTouched,
  getFieldError,
  clearValidation,
} = useFormValidation(formModel, schema)

const cardTitle = computed(() => (props.mode === 'create' ? 'Nueva solicitud de diseño' : 'Editar solicitud de diseño'))

const syncFormModel = () => {
  Object.assign(formModel, {
    ...props.model,
    finishingOptions: [...props.model.finishingOptions],
    deliverables: [...props.model.deliverables],
    attachments: [...props.model.attachments],
  })
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
    .map(file => toRequestAttachmentFromFile(file))

  const invalidCount = selectedFiles.length - validAttachments.length

  formModel.attachments = [...formModel.attachments, ...validAttachments]

  if (invalidCount > 0) {
    toast.warning(`Se ignoraron ${invalidCount} archivo(s) con formato no permitido.`)
  }

  target.value = ''
}

const removeAttachment = (attachmentId: string) => {
  formModel.attachments = formModel.attachments.filter(attachment => attachment.id !== attachmentId)
}

const handleSubmit = () => {
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
</script>
