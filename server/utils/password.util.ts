const passwordCharset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'

const generateRandomSegment = (segmentLength: number) => {
  return Array.from({ length: segmentLength })
    .map(() => {
      const randomIndex = Math.floor(Math.random() * passwordCharset.length)
      return passwordCharset[randomIndex]
    })
    .join('')
}

export const generateTemporaryPassword = () => {
  const prefix = 'Tmp'
  const numericSegment = String(Math.floor(1000 + Math.random() * 9000))
  const alphaNumericSegment = generateRandomSegment(4)

  return `${prefix}-${numericSegment}${alphaNumericSegment}`
}
