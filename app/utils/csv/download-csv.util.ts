interface CsvHeader {
  key: string
  label: string
}

const escapeCsvCell = (value: unknown) => {
  const serializedValue = value === null || value === undefined ? '' : String(value)
  const escapedValue = serializedValue.replaceAll('"', '""')

  return `"${escapedValue}"`
}

export const downloadCsvFile = <TRow extends object>(
  filename: string,
  headers: CsvHeader[],
  rows: TRow[],
) => {
  if (typeof window === 'undefined') {
    return
  }

  const headerLine = headers.map(header => escapeCsvCell(header.label)).join(',')
  const bodyLines = rows.map((row) => {
    const rowRecord = row as Record<string, unknown>

    return headers.map(header => escapeCsvCell(rowRecord[header.key])).join(',')
  })
  const csvContent = [headerLine, ...bodyLines].join('\n')
  const csvBlob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })
  const downloadUrl = URL.createObjectURL(csvBlob)
  const linkElement = document.createElement('a')

  linkElement.href = downloadUrl
  linkElement.download = filename
  linkElement.style.display = 'none'
  document.body.appendChild(linkElement)
  linkElement.click()
  document.body.removeChild(linkElement)
  URL.revokeObjectURL(downloadUrl)
}
