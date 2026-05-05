import type { ApiResponse } from '../api/client'
import { mockBanners, mockCategories, mockConfig, mockPaymentChannels, mockPosts, mockProducts } from './fixtures'

const ok = <T>(data: T, pagination?: ApiResponse['pagination']): ApiResponse<T> => ({
  status_code: 0,
  msg: 'ok',
  data,
  ...(pagination ? { pagination } : {}),
})

const isBrowser = () => typeof window !== 'undefined'

export const isMockModeEnabled = () => {
  if (import.meta.env.VITE_USE_MOCKS === 'true') return true
  if (!isBrowser()) return false

  const search = new URLSearchParams(window.location.search)
  if (search.get('mock') === '0') {
    localStorage.removeItem('dujiao_mock')
    return false
  }
  if (search.has('mock')) {
    localStorage.setItem('dujiao_mock', '1')
    return true
  }
  return localStorage.getItem('dujiao_mock') === '1'
}

const asNumber = (value: unknown, fallback: number) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric) || numeric <= 0) return fallback
  return Math.floor(numeric)
}

const paginate = <T>(rows: T[], params?: Record<string, any>) => {
  const page = asNumber(params?.page, 1)
  const pageSize = asNumber(params?.page_size, rows.length || 12)
  const start = (page - 1) * pageSize
  const data = rows.slice(start, start + pageSize)
  return ok(data, {
    page,
    page_size: pageSize,
    total: rows.length,
    total_page: Math.max(Math.ceil(rows.length / pageSize), 1),
  })
}

const localizedText = (value: any) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return String(value['zh-CN'] || value['en-US'] || value['zh-TW'] || '')
}

const productById = (id: unknown) => mockProducts.find((product) => Number(product.id) === Number(id))
const productBySlug = (slug: string) => mockProducts.find((product) => product.slug === slug)

const productList = (params?: Record<string, any>) => {
  let rows = [...mockProducts]
  const categoryId = Number(params?.category_id || 0)
  const keyword = String(params?.search || '').trim().toLowerCase()

  if (categoryId > 0) {
    const childIds = mockCategories
      .filter((category) => Number(category.parent_id) === categoryId)
      .map((category) => Number(category.id))
    const allowedIds = new Set([categoryId, ...childIds])
    rows = rows.filter((product) => allowedIds.has(Number(product.category?.id)))
  }
  if (keyword) {
    rows = rows.filter((product) => {
      const haystack = [
        localizedText(product.title),
        localizedText(product.description),
        product.slug,
        ...(Array.isArray(product.tags) ? product.tags : []),
      ].join(' ').toLowerCase()
      return haystack.includes(keyword)
    })
  }

  return paginate(rows, params)
}

const postList = (params?: Record<string, any>) => {
  const type = String(params?.type || '').trim()
  const rows = type ? mockPosts.filter((post) => post.type === type) : mockPosts
  return paginate(rows, params)
}

const cents = (amount: unknown) => Math.round(Number(amount || 0) * 100)
const amount = (value: number) => (value / 100).toFixed(2)

const calculatePreview = (body?: any) => {
  const items = Array.isArray(body?.items) ? body.items : []
  let originalCents = 0
  let promotionCents = 0

  for (const item of items) {
    const product = productById(item.product_id)
    if (!product) continue
    const sku = Array.isArray(product.skus)
      ? product.skus.find((entry: any) => Number(entry.id) === Number(item.sku_id)) || product.skus[0]
      : null
    const quantity = asNumber(item.quantity, 1)
    const base = cents(sku?.price_amount || product.price_amount)
    const promo = sku?.promotion_price_amount || product.promotion_price_amount
    const final = promo ? cents(promo) : base
    originalCents += base * quantity
    promotionCents += Math.max(base - final, 0) * quantity
  }

  const totalCents = Math.max(originalCents - promotionCents, 0)
  return ok({
    currency: mockConfig.currency,
    original_amount: amount(originalCents),
    discount_amount: '0.00',
    promotion_discount_amount: amount(promotionCents),
    member_discount_amount: '0.00',
    total_amount: amount(totalCents),
    payment_channels: mockPaymentChannels,
  })
}

const mockOrder = (orderNo = 'MOCK202605050001') => {
  const product = mockProducts[0]!
  const sku = product.skus[0]!
  return {
    order_no: orderNo,
    status: 'pending_payment',
    currency: mockConfig.currency,
    original_amount: sku.price_amount,
    discount_amount: '0.00',
    promotion_discount_amount: (cents(sku.price_amount) - cents(sku.promotion_price_amount)).toFixed(0) === '0'
      ? '0.00'
      : amount(cents(sku.price_amount) - cents(sku.promotion_price_amount)),
    member_discount_amount: '0.00',
    total_amount: sku.promotion_price_amount || sku.price_amount,
    wallet_paid_amount: '0.00',
    online_pay_amount: sku.promotion_price_amount || sku.price_amount,
    allowed_payment_channel_ids: [1, 2, 3],
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    items: [
      {
        product_id: product.id,
        sku_id: sku.id,
        title: product.title,
        quantity: 1,
        unit_price: sku.promotion_price_amount || sku.price_amount,
        total_price: sku.promotion_price_amount || sku.price_amount,
        fulfillment_type: product.fulfillment_type,
        tags: product.tags,
        image: product.images[0],
        sku_snapshot: {
          sku_code: sku.sku_code,
          spec_values: sku.spec_values,
        },
      },
    ],
  }
}

const createPaymentResult = (body?: any) => {
  const channelId = Number(body?.channel_id || 1)
  const channel = mockPaymentChannels.find((item) => Number(item.id) === channelId) || mockPaymentChannels[0]!
  const interactionMode = String(channel.interaction_mode || 'qr')
  return ok({
    payment_id: 9001,
    order_no: String(body?.order_no || 'MOCK202605050001'),
    channel_id: channel.id,
    channel_name: channel.name,
    provider_type: channel.provider_type,
    channel_type: channel.channel_type,
    interaction_mode: interactionMode,
    pay_url: 'https://example.com/mock-pay',
    qr_code: interactionMode === 'qr' ? 'https://example.com/mock-pay' : '',
    amount: '29.00',
    fee_rate: channel.fee_rate,
    fixed_fee: channel.fixed_fee,
    fee_amount: '0.00',
    wallet_paid_amount: '0.00',
    online_pay_amount: '29.00',
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    status: 'initiated',
  })
}

export const resolveMockResponse = (
  method: string,
  path: string,
  params?: Record<string, any>,
  body?: any,
): ApiResponse | null => {
  if (!isMockModeEnabled()) return null

  const normalizedMethod = method.toUpperCase()
  const normalizedPath = path.replace(/^\/api\/v1/, '').replace(/\/+$/, '') || '/'

  if (normalizedMethod === 'GET' && normalizedPath === '/public/config') return ok(mockConfig)
  if (normalizedMethod === 'GET' && normalizedPath === '/public/categories') return ok(mockCategories)
  if (normalizedMethod === 'GET' && normalizedPath === '/public/banners') return ok(mockBanners)
  if (normalizedMethod === 'GET' && normalizedPath === '/public/products') return productList(params)
  if (normalizedMethod === 'GET' && normalizedPath.startsWith('/public/products/')) {
    const slug = decodeURIComponent(normalizedPath.replace('/public/products/', ''))
    return ok(productBySlug(slug) || null)
  }
  if (normalizedMethod === 'GET' && normalizedPath === '/public/posts') return postList(params)
  if (normalizedMethod === 'GET' && normalizedPath.startsWith('/public/posts/')) {
    const slug = decodeURIComponent(normalizedPath.replace('/public/posts/', ''))
    return ok(mockPosts.find((post) => post.slug === slug) || null)
  }
  if (normalizedMethod === 'GET' && normalizedPath === '/public/member-levels') return ok([])

  if (normalizedMethod === 'POST' && ['/orders/preview', '/guest/orders/preview'].includes(normalizedPath)) {
    return calculatePreview(body)
  }
  if (normalizedMethod === 'POST' && normalizedPath === '/order/payment-channels') return ok(mockPaymentChannels)
  if (normalizedMethod === 'GET' && normalizedPath === '/wallet') return ok({ balance: '88.00', currency: mockConfig.currency })

  if (normalizedMethod === 'POST' && ['/orders/create-and-pay', '/guest/orders/create-and-pay'].includes(normalizedPath)) {
    return ok({ order_no: 'MOCK202605050001' })
  }
  if (normalizedMethod === 'GET' && /^\/orders\/[^/]+$/.test(normalizedPath)) {
    return ok(mockOrder(decodeURIComponent(normalizedPath.split('/').pop() || '')))
  }
  if (normalizedMethod === 'GET' && /^\/guest\/orders\/[^/]+$/.test(normalizedPath)) {
    return ok(mockOrder(decodeURIComponent(normalizedPath.split('/').pop() || '')))
  }
  if (normalizedMethod === 'GET' && ['/payments/latest', '/guest/payments/latest'].includes(normalizedPath)) {
    return ok(null)
  }
  if (normalizedMethod === 'POST' && ['/payments', '/guest/payments'].includes(normalizedPath)) {
    return createPaymentResult(body)
  }
  if (normalizedMethod === 'POST' && /^\/(guest\/)?payments\/\d+\/capture$/.test(normalizedPath)) {
    return ok({ status: 'success' })
  }

  return null
}
