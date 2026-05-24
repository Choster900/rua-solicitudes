<template>
  <section class="overflow-hidden rounded-2xl border border-outline/20 bg-surface-container-lowest/5 shadow-sm">
    <div class="flex flex-col gap-3 border-b border-outline/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-xs uppercase tracking-[0.16em] text-outline-variant">
        {{ filteredRows.length }} registro{{ filteredRows.length === 1 ? '' : 's' }} visibles
      </p>

      <button
        v-if="hasActiveFilters"
        class="inline-flex items-center justify-center gap-2 rounded-lg border border-outline/30 px-3 py-2 text-xs font-semibold text-outline-variant transition-colors hover:bg-surface-container-low/10 hover:text-white"
        type="button"
        @click="resetFilters"
      >
        <span class="material-symbols-outlined text-[18px]">filter_alt_off</span>
        Limpiar filtros
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[980px] border-separate border-spacing-0">
        <thead>
          <tr class="bg-surface-container-low/10">
            <th
              v-for="column in columns"
              :key="column.key"
              class="border-b border-outline/20 px-4 py-3 text-left text-xs font-label-caps uppercase tracking-[0.08em] text-outline-variant"
              :class="[column.headerClassName, alignClassMap[column.align ?? 'left']]"
            >
              {{ column.label }}
            </th>
          </tr>

          <tr
            v-if="showColumnFilters"
            class="bg-surface-container-low/5"
          >
            <th
              v-for="column in columns"
              :key="`${column.key}-filter`"
              class="border-b border-outline/20 px-4 py-2.5"
            >
              <input
                v-if="column.searchable !== false"
                v-model="columnFilters[column.key]"
                class="w-full rounded-xl border border-outline/20 bg-surface-container-lowest/10 px-3 py-1.5 text-xs text-white outline-none transition-all focus:border-primary/80 focus:ring-2 focus:ring-primary/30"
                type="text"
              >
              <span
                v-else
                class="block text-center text-[11px] uppercase tracking-[0.12em] text-outline-variant/70"
              >
                Sin filtro
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td
              :colspan="columns.length"
              class="px-4 py-10 text-center text-sm text-outline-variant"
            >
              Cargando datos...
            </td>
          </tr>

          <tr v-else-if="filteredRows.length === 0">
            <td
              :colspan="columns.length"
              class="px-4 py-10 text-center"
            >
              <p class="text-sm font-semibold text-white">
                {{ emptyTitle }}
              </p>
              <p class="mt-1 text-xs text-outline-variant">
                {{ emptyDescription }}
              </p>
            </td>
          </tr>

          <tr
            v-for="(row, rowIndex) in paginatedRows"
            v-else
            :key="getRowKey(row, paginationStartIndex + rowIndex)"
            class="transition-colors hover:bg-surface-container-low/10"
          >
            <td
              v-for="column in columns"
              :key="`${getRowKey(row, paginationStartIndex + rowIndex)}-${column.key}`"
              class="border-b border-outline/10 px-4 py-3 text-sm text-white"
              :class="[column.cellClassName, alignClassMap[column.align ?? 'left']]"
            >
              <slot
                :name="`cell-${column.key}`"
                :column="column"
                :row="row"
                :row-key-value="getRowKey(row, paginationStartIndex + rowIndex)"
                :value="getCellValue(row, column.key)"
              >
                {{ formatCellValue(getCellValue(row, column.key)) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <footer
      v-if="showPagination && filteredRows.length > 0"
      class="flex flex-col gap-3 border-t border-outline/20 px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="flex flex-wrap items-center gap-3 text-xs text-outline-variant">
        <label
          class="inline-flex items-center gap-2"
        >
          <span>Filas por página</span>
          <AppSelect
            v-model="pageSize"
            :clearable="false"
            dropdown-direction="up"
            :options="pageSizeSelectOptions"
            :searchable="false"
            input-class="!w-[86px] !py-1.5 !text-xs"
            placeholder="Tamaño"
          />
        </label>

        <span>
          Mostrando {{ paginationStartIndex + 1 }}-{{ paginationEndIndex }} de {{ filteredRows.length }}
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-1.5">
        <button
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline/30 text-outline-variant transition-colors hover:bg-surface-container-low/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          type="button"
          title="Primera página"
          :disabled="!canGoPrevious"
          @click="goToFirstPage"
        >
          <span class="material-symbols-outlined text-[18px]">first_page</span>
        </button>
        <button
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline/30 text-outline-variant transition-colors hover:bg-surface-container-low/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          type="button"
          title="Página anterior"
          :disabled="!canGoPrevious"
          @click="goToPreviousPage"
        >
          <span class="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>

        <button
          v-for="page in visiblePageNumbers"
          :key="page"
          class="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-xs font-semibold transition-colors"
          :class="page === currentPage
            ? 'border-primary bg-primary text-white'
            : 'border-outline/30 text-outline-variant hover:bg-surface-container-low/10 hover:text-white'"
          type="button"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <button
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline/30 text-outline-variant transition-colors hover:bg-surface-container-low/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          type="button"
          title="Página siguiente"
          :disabled="!canGoNext"
          @click="goToNextPage"
        >
          <span class="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
        <button
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline/30 text-outline-variant transition-colors hover:bg-surface-container-low/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          type="button"
          title="Última página"
          :disabled="!canGoNext"
          @click="goToLastPage"
        >
          <span class="material-symbols-outlined text-[18px]">last_page</span>
        </button>
      </div>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppSelect from '~/presentation/shared/components/ui/AppSelect.vue'
import type { AppDataTableColumn, AppDataTableRow } from '~/presentation/shared/interfaces/ui/app-data-table.interface'

interface AppDataTableProps {
  columns: AppDataTableColumn[]
  rows: AppDataTableRow[]
  rowKey?: string
  loading?: boolean
  showColumnFilters?: boolean
  showPagination?: boolean
  defaultPageSize?: number
  pageSizeOptions?: number[]
  emptyTitle?: string
  emptyDescription?: string
}

defineOptions({
  name: 'AppDataTable',
})

const props = withDefaults(defineProps<AppDataTableProps>(), {
  rowKey: 'id',
  loading: false,
  showColumnFilters: true,
  showPagination: true,
  defaultPageSize: 10,
  pageSizeOptions: () => [10, 25, 50, 100],
  emptyTitle: 'No hay resultados',
  emptyDescription: 'Ajusta tus filtros para continuar.',
})

const alignClassMap: Record<'left' | 'center' | 'right', string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const columnFilters = ref<Record<string, string>>({})
const currentPage = ref(1)
const pageSize = ref(props.defaultPageSize)

const synchronizeColumnFilters = () => {
  const nextFilters: Record<string, string> = {}

  props.columns.forEach((column) => {
    if (column.searchable === false) {
      return
    }

    nextFilters[column.key] = columnFilters.value[column.key] ?? ''
  })

  columnFilters.value = nextFilters
}

watch(
  () => props.columns,
  () => {
    synchronizeColumnFilters()
  },
  { immediate: true, deep: true },
)

const normalizeValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return ''
  }

  if (Array.isArray(value)) {
    return value.join(' ').toLowerCase()
  }

  if (typeof value === 'number') {
    return value.toString().toLowerCase()
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  return String(value).toLowerCase()
}

const filteredRows = computed(() => {
  if (!props.rows.length) {
    return []
  }

  return props.rows.filter((row) => {
    return props.columns.every((column) => {
      if (column.searchable === false) {
        return true
      }

      const query = (columnFilters.value[column.key] ?? '').trim().toLowerCase()

      if (!query) {
        return true
      }

      return normalizeValue(getCellValue(row, column.key)).includes(query)
    })
  })
})

const hasActiveFilters = computed(() => {
  return Object.values(columnFilters.value).some(value => value.trim().length > 0)
})

const totalPages = computed(() => {
  if (filteredRows.value.length === 0) {
    return 1
  }

  return Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value))
})

const safeCurrentPage = computed(() => Math.min(currentPage.value, totalPages.value))
const paginationStartIndex = computed(() => (safeCurrentPage.value - 1) * pageSize.value)
const paginationEndIndex = computed(() => Math.min(paginationStartIndex.value + pageSize.value, filteredRows.value.length))
const paginatedRows = computed(() => filteredRows.value.slice(paginationStartIndex.value, paginationEndIndex.value))
const canGoPrevious = computed(() => safeCurrentPage.value > 1)
const canGoNext = computed(() => safeCurrentPage.value < totalPages.value)

const visiblePageNumbers = computed(() => {
  const maxVisible = 5
  let startPage = Math.max(1, safeCurrentPage.value - Math.floor(maxVisible / 2))
  const endPage = Math.min(totalPages.value, startPage + maxVisible - 1)

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  const pages: number[] = []

  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page)
  }

  return pages
})

const pageSizeSelectOptions = computed(() => {
  return props.pageSizeOptions.map(size => ({
    label: size.toString(),
    value: size,
  }))
})

const formatCellValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  if (Array.isArray(value)) {
    return value.join(', ')
  }

  return String(value)
}

const getRowKey = (row: AppDataTableRow, index: number) => {
  const resolvedRowKey = getCellValue(row, props.rowKey)

  if (typeof resolvedRowKey === 'string' || typeof resolvedRowKey === 'number') {
    return resolvedRowKey
  }

  return `${props.rowKey}-${index}`
}

const getCellValue = (row: AppDataTableRow, key: string) => {
  const rowRecord = row as Record<string, unknown>

  return rowRecord[key]
}

const resetFilters = () => {
  Object.keys(columnFilters.value).forEach((key) => {
    columnFilters.value[key] = ''
  })
}

const goToFirstPage = () => {
  currentPage.value = 1
}

const goToPreviousPage = () => {
  if (!canGoPrevious.value) {
    return
  }

  currentPage.value -= 1
}

const goToNextPage = () => {
  if (!canGoNext.value) {
    return
  }

  currentPage.value += 1
}

const goToLastPage = () => {
  currentPage.value = totalPages.value
}

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) {
    return
  }

  currentPage.value = page
}

watch(
  () => pageSize.value,
  () => {
    currentPage.value = 1
  },
)

watch(
  () => filteredRows.value.length,
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  },
)

watch(
  () => props.defaultPageSize,
  (nextPageSize) => {
    pageSize.value = nextPageSize
  },
)
</script>
