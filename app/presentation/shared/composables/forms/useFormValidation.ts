import { computed, ref } from 'vue'

export type ValidationRule<TValue, TModel> = {
  message: string
  validator: (value: TValue, model: TModel) => boolean
}

type FieldKey<TModel> = Extract<keyof TModel, string>

export type ValidationSchema<TModel extends object> = {
  [K in keyof TModel]?: ValidationRule<TModel[K], TModel>[]
}

type FieldErrors<TModel extends object> = Partial<Record<FieldKey<TModel>, string[]>>
type TouchedState<TModel extends object> = Partial<Record<FieldKey<TModel>, boolean>>

export const validationRules = {
  required<TModel extends object, TValue = unknown>(message: string): ValidationRule<TValue, TModel> {
    return {
      message,
      validator: (value) => {
        if (typeof value === 'string') {
          return value.trim().length > 0
        }

        return value !== null && value !== undefined
      },
    }
  },
  minLength<TModel extends object, TValue = unknown>(length: number, message: string): ValidationRule<TValue, TModel> {
    return {
      message,
      validator: (value) => {
        if (typeof value !== 'string') {
          return false
        }

        return value.trim().length >= length
      },
    }
  },
  email<TModel extends object, TValue = unknown>(message: string): ValidationRule<TValue, TModel> {
    const expression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return {
      message,
      validator: (value) => {
        if (typeof value !== 'string') {
          return false
        }

        return expression.test(value.trim())
      },
    }
  },
  custom<TModel extends object, TValue>(
    validator: (value: TValue, model: TModel) => boolean,
    message: string,
  ): ValidationRule<TValue, TModel> {
    return {
      message,
      validator,
    }
  },
}

export function useFormValidation<TModel extends object>(
  model: TModel,
  schema: ValidationSchema<TModel>,
) {
  const errors = ref<FieldErrors<TModel>>({})
  const touched = ref<TouchedState<TModel>>({})
  const isSubmitted = ref(false)

  const fieldKeys = Object.keys(schema) as FieldKey<TModel>[]

  const validateField = (field: FieldKey<TModel>) => {
    const fieldRules = schema[field] ?? []
    const fieldMessages: string[] = []

    fieldRules.forEach((rule) => {
      const isValid = rule.validator(model[field], model)

      if (!isValid) {
        fieldMessages.push(rule.message)
      }
    })

    errors.value[field] = fieldMessages
    return fieldMessages.length === 0
  }

  const validateAll = () => {
    isSubmitted.value = true
    let formIsValid = true

    fieldKeys.forEach((field) => {
      const valid = validateField(field)
      touched.value[field] = true

      if (!valid) {
        formIsValid = false
      }
    })

    return formIsValid
  }

  const setFieldTouched = (field: FieldKey<TModel>, status = true) => {
    touched.value[field] = status
  }

  const getFieldError = (field: FieldKey<TModel>) => {
    const isTouched = touched.value[field] || isSubmitted.value

    if (!isTouched) {
      return ''
    }

    return errors.value[field]?.[0] ?? ''
  }

  const clearValidation = () => {
    fieldKeys.forEach((field) => {
      errors.value[field] = []
      touched.value[field] = false
    })

    isSubmitted.value = false
  }

  const hasErrors = computed(() => {
    return fieldKeys.some(field => (errors.value[field]?.length ?? 0) > 0)
  })

  return {
    errors,
    touched,
    hasErrors,
    isSubmitted,
    validateField,
    validateAll,
    setFieldTouched,
    getFieldError,
    clearValidation,
  }
}
