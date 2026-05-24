import { es } from 'date-fns/locale'

const BASE_INPUT_CLASS = 'w-full rounded-lg border border-outline/30 bg-surface-container-lowest/5 py-2.5 pr-10 text-sm text-white transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-70'

export function useDatePickerLocale() {
  return {
    localeEs: es,
    weekStart: 1 as const,
    modelType: 'yyyy-MM-dd' as const,
    displayFormat: 'dd/MM/yyyy' as const,
    hideInputIconAttrs: { hideInputIcon: true },
    buildInputClass(leftPadding: 'pl-3' | 'pl-10', extra = ''): string {
      return `${BASE_INPUT_CLASS} ${leftPadding} ${extra}`.trim()
    },
  }
}
