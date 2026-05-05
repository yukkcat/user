export const normalizeSkuId = (value: unknown) => {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) return 0
  const integerValue = Math.trunc(numberValue)
  return integerValue > 0 ? integerValue : 0
}

const SUPPORTED_LOCALES = ['zh-CN', 'zh-TW', 'en-US'] as const

const normalizeText = (value: unknown) => String(value ?? '').trim()

const normalizeLocaleCode = (locale?: unknown) => normalizeText(locale).toLowerCase()

const INTERNAL_SPEC_KEY_RE = /(^|[_\-\s])(sku|code|slug|id|internal|secret|token)([_\-\s]|$)|sku_?code|product_?code/i
const RAW_INTERNAL_VALUE_RE = /^[A-Z0-9][A-Z0-9_-]{3,}$/

const looksLikeInternalValue = (value: string) => {
  if (!value) return false
  if (/\s/.test(value)) return false
  if (/[\u4e00-\u9fff]/.test(value)) return false
  return RAW_INTERNAL_VALUE_RE.test(value)
}

const isDisplayableSpecText = (value: string) => {
  const text = normalizeText(value)
  if (!text) return false
  return !looksLikeInternalValue(text)
}

const localeFallbacks = (locale?: string) => {
  const normalized = normalizeLocaleCode(locale)
  switch (normalized) {
    case 'zh-tw':
    case 'zh-hk':
    case 'zh-mo':
      return ['zh-TW', 'zh-CN', 'en-US']
    case 'en':
    case 'en-us':
      return ['en-US', 'zh-CN', 'zh-TW']
    case 'zh':
    case 'zh-cn':
    default:
      return ['zh-CN', 'zh-TW', 'en-US']
  }
}

const isLocalizedObject = (value: unknown): value is Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const keys = Object.keys(value)
  if (keys.length === 0) return false
  return keys.every((key) => SUPPORTED_LOCALES.includes(key as typeof SUPPORTED_LOCALES[number]))
}

const resolveLocalizedText = (value: unknown, locale?: string) => {
  if (!isLocalizedObject(value)) return ''
  const rows = value as Record<string, unknown>
  const chain = localeFallbacks(locale)
  for (const code of chain) {
    const text = normalizeText(rows[code])
    if (text) return text
  }
  for (const code of SUPPORTED_LOCALES) {
    const text = normalizeText(rows[code])
    if (text) return text
  }
  return ''
}

const normalizeSpecValue = (value: unknown, locale?: string): string => {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeSpecValue(entry, locale)).filter(Boolean).join(', ')
  }
  if (value === null || value === undefined) return ''
  if (isLocalizedObject(value)) {
    const localized = resolveLocalizedText(value, locale)
    return isDisplayableSpecText(localized) ? localized : ''
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return ''
    }
  }
  const text = normalizeText(value)
  return isDisplayableSpecText(text) ? text : ''
}

export const formatSkuSpecValues = (specValues: unknown, locale?: string) => {
  if (!specValues || typeof specValues !== 'object' || Array.isArray(specValues)) return ''
  if (isLocalizedObject(specValues)) {
    const localized = resolveLocalizedText(specValues, locale)
    return isDisplayableSpecText(localized) ? localized : ''
  }
  const entries = Object.entries(specValues as Record<string, unknown>)
    .map(([key, value]) => {
      const normalizedKey = normalizeText(key)
      if (INTERNAL_SPEC_KEY_RE.test(normalizedKey)) return ''
      const normalizedValue = normalizeSpecValue(value, locale)
      if (!normalizedValue) return ''
      if (!normalizedKey) return normalizedValue
      return `${normalizedKey}:${normalizedValue}`
    })
    .filter(Boolean)
  return entries.join(' / ')
}

export const buildSkuDisplayText = (payload: {
  skuCode?: unknown
  specValues?: unknown
  fallback?: string
  locale?: string
}) => {
  const specText = formatSkuSpecValues(payload.specValues, payload.locale)
  if (specText) return specText
  return payload.fallback || ''
}

export const buildSkuDisplayTextFromSnapshot = (snapshot: unknown, options?: { fallback?: string; locale?: string }) => {
  if (!snapshot || typeof snapshot !== 'object') return ''
  const row = snapshot as Record<string, unknown>
  return buildSkuDisplayText({
    skuCode: row.sku_code,
    specValues: row.spec_values,
    fallback: options?.fallback || '',
    locale: options?.locale,
  })
}
