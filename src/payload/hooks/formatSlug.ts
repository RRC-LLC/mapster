import type { FieldHook } from 'payload'

const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

const formatSlug =
  (fallbackArray: Array<string>): FieldHook =>
  ({ originalDoc, data }) => {
    
    const fallbackData = fallbackArray.flatMap((fallback, i) => data?.[fallback] ? [data?.[fallback]] : (originalDoc?.[fallback] ? [originalDoc?.[fallback]] : []))
    if (fallbackData && fallbackData.every((fallback) => typeof fallback === 'string')) {
      return fallbackData.map((fallback) => format(fallback)).join("-")
    }
  }

export default formatSlug
