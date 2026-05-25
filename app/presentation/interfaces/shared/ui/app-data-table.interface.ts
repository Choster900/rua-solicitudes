export type AppDataTableCellAlign = 'left' | 'center' | 'right'

export interface AppDataTableColumn {
  key: string
  label: string
  searchable?: boolean
  filterPlaceholder?: string
  headerClassName?: string
  cellClassName?: string
  align?: AppDataTableCellAlign
}

export type AppDataTableRow = object
