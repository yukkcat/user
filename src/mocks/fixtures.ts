const localized = (zhCN: string, enUS = zhCN, zhTW = zhCN) => ({
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS,
})

const svgImage = (title: string, subtitle: string, bg: string, accent: string) => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="${bg}"/>
        <stop offset="1" stop-color="#ffffff"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="24" stdDeviation="26" flood-color="#0f172a" flood-opacity=".13"/>
      </filter>
    </defs>
    <rect width="960" height="720" rx="52" fill="url(#bg)"/>
    <circle cx="780" cy="126" r="118" fill="${accent}" opacity=".12"/>
    <circle cx="154" cy="612" r="150" fill="${accent}" opacity=".08"/>
    <rect x="132" y="130" width="696" height="460" rx="34" fill="rgba(255,255,255,.88)" stroke="#e5e7eb" filter="url(#shadow)"/>
    <rect x="184" y="184" width="248" height="24" rx="12" fill="${accent}" opacity=".24"/>
    <rect x="184" y="242" width="592" height="18" rx="9" fill="#d4d4d8"/>
    <rect x="184" y="284" width="492" height="18" rx="9" fill="#e4e4e7"/>
    <rect x="184" y="360" width="196" height="70" rx="22" fill="#18181b"/>
    <rect x="412" y="360" width="190" height="70" rx="22" fill="#f4f4f5" stroke="#e5e7eb"/>
    <text x="184" y="510" fill="#18181b" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="700">${title}</text>
    <text x="186" y="552" fill="#71717a" font-family="Inter, Arial, sans-serif" font-size="24">${subtitle}</text>
  </svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const mockPaymentChannels = [
  {
    id: 1,
    name: '支付宝',
    provider_type: 'epay',
    channel_type: 'alipay',
    interaction_mode: 'qr',
    fee_rate: '0',
    fixed_fee: '0.00',
    min_amount: '1.00',
    max_amount: '5000.00',
  },
  {
    id: 2,
    name: '微信支付',
    provider_type: 'epay',
    channel_type: 'wechat',
    interaction_mode: 'qr',
    fee_rate: '0.006',
    fixed_fee: '0.00',
    min_amount: '1.00',
    max_amount: '3000.00',
  },
  {
    id: 3,
    name: 'USDT TRC20',
    provider_type: 'epusdt',
    channel_type: 'usdt-trc20',
    interaction_mode: 'redirect',
    fee_rate: '0',
    fixed_fee: '0.00',
    min_amount: '10.00',
    max_amount: '9999.00',
  },
]

export const mockConfig = {
  app_version: 'mock-assistant-ui',
  server_time: Date.now(),
  currency: 'CNY',
  template_mode: 'card',
  wallet_only_payment: false,
  registration_enabled: true,
  email_verification_enabled: false,
  brand: {
    site_name: 'Mimo Store',
    site_description: localized('极简、清晰、适合移动端下单的数字商品商店', 'A minimal digital goods shop'),
  },
  seo: {
    title: localized('Mimo Store - 本地预览', 'Mimo Store Preview'),
    description: localized('assistant-ui 风格本地假数据预览', 'assistant-ui inspired preview'),
    keywords: localized('数字商品, 极简商店, 自动交付', 'digital goods, minimal shop'),
  },
  nav_config: {
    builtin: {
      blog: true,
      notice: true,
      about: true,
    },
    custom_items: [],
  },
  payment_channels: mockPaymentChannels,
  wallet_recharge_channel_ids: [1, 2, 3],
  captcha: {
    provider: 'none',
    scenes: {},
  },
  telegram_auth: {
    enabled: false,
  },
  contact: {
    email: 'support@example.com',
    telegram: '@mimo_preview',
  },
  footer_links: [],
  legal: {
    terms: localized('<p>本地预览条款内容。</p>', '<p>Local preview terms.</p>'),
    privacy: localized('<p>本地预览隐私内容。</p>', '<p>Local preview privacy.</p>'),
  },
  scripts: {},
}

export const mockCategories = [
  { id: 1, slug: 'ai-tools', name: localized('AI 工具', 'AI Tools'), icon: '', parent_id: null },
  { id: 2, slug: 'accounts', name: localized('账号服务', 'Accounts'), icon: '', parent_id: null },
  { id: 3, slug: 'credits', name: localized('额度补充', 'Credits'), icon: '', parent_id: 1 },
  { id: 4, slug: 'templates', name: localized('效率模板', 'Templates'), icon: '', parent_id: 1 },
]

const productImageA = svgImage('Assistant Pro', 'Auto delivery', '#f7f7f8', '#18181b')
const productImageB = svgImage('Credit Pack', 'Ready in seconds', '#f4f4f5', '#52525b')
const productImageC = svgImage('Team Seat', 'Member purchase', '#f7fee7', '#65a30d')
const productImageD = svgImage('Prompt Kit', 'Minimal workflow', '#fff7ed', '#f97316')

export const mockProducts = [
  {
    id: 101,
    slug: 'assistant-pro',
    title: localized('Assistant Pro 月卡', 'Assistant Pro Monthly'),
    description: localized('自动交付，支付后可在订单详情里查看卡密。', 'Auto delivery after payment.'),
    content: localized(
      '<p>适合个人测试与轻量使用。下单后系统自动发货，游客也可以通过邮箱和订单密码查询。</p><ul><li>自动交付</li><li>支持游客购买</li><li>清晰付款指引</li></ul>',
      '<p>Good for lightweight testing. Auto delivery after checkout.</p>',
    ),
    images: [productImageA],
    category: mockCategories[0],
    tags: ['推荐', '自动发货'],
    price_amount: '39.00',
    promotion_price_amount: '29.00',
    purchase_type: 'guest',
    fulfillment_type: 'auto',
    stock_status: 'in_stock',
    auto_stock_available: 128,
    manual_stock_available: 0,
    is_sold_out: false,
    max_purchase_quantity: 5,
    payment_channel_ids: [1, 2, 3],
    promotion_rules: [
      { id: 1, type: 'percent', min_quantity: 2, value: 10 },
    ],
    skus: [
      {
        id: 1001,
        sku_code: 'CHAOSCREDIT',
        spec_values: {},
        price_amount: '39.00',
        promotion_price_amount: '29.00',
        is_active: true,
        auto_stock_available: 128,
        manual_stock_total: 0,
        upstream_stock: -1,
      },
      {
        id: 1002,
        sku_code: 'ASSISTANT_PRO_PLUS',
        spec_values: { 套餐: '高级版', 周期: '月卡' },
        price_amount: '69.00',
        promotion_price_amount: '59.00',
        is_active: true,
        auto_stock_available: 32,
        manual_stock_total: 0,
        upstream_stock: -1,
      },
    ],
  },
  {
    id: 102,
    slug: 'credit-pack',
    title: localized('额度补充包 100 次', 'Credit Pack 100'),
    description: localized('小额补充包，适合临时扩容。', 'Small credit pack for temporary usage.'),
    content: localized('<p>下单后自动发放兑换码，请在订单详情复制。</p>', '<p>Auto-delivered redemption code.</p>'),
    images: [productImageB],
    category: mockCategories[2],
    tags: ['小额', '秒发'],
    price_amount: '19.90',
    promotion_price_amount: '',
    purchase_type: 'guest',
    fulfillment_type: 'auto',
    stock_status: 'low_stock',
    auto_stock_available: 6,
    manual_stock_available: 0,
    is_sold_out: false,
    max_purchase_quantity: 10,
    payment_channel_ids: [1, 2],
    promotion_rules: [],
    skus: [
      {
        id: 2001,
        sku_code: 'CREDIT_100',
        spec_values: { 面值: '100 次', 类型: '标准额度' },
        price_amount: '19.90',
        promotion_price_amount: '',
        is_active: true,
        auto_stock_available: 6,
        manual_stock_total: 0,
        upstream_stock: -1,
      },
    ],
  },
  {
    id: 103,
    slug: 'team-seat',
    title: localized('团队席位开通', 'Team Seat'),
    description: localized('会员购买，人工确认信息后开通。', 'Member purchase with manual provisioning.'),
    content: localized('<p>请在下单页填写团队邮箱与备注，客服会人工处理。</p>', '<p>Fill team email and notes at checkout.</p>'),
    images: [productImageC],
    category: mockCategories[1],
    tags: ['人工处理'],
    price_amount: '99.00',
    promotion_price_amount: '',
    purchase_type: 'member',
    fulfillment_type: 'manual',
    stock_status: 'in_stock',
    manual_stock_available: 20,
    auto_stock_available: 0,
    is_sold_out: false,
    max_purchase_quantity: 3,
    payment_channel_ids: [1, 3],
    manual_form_schema: {
      fields: [
        {
          key: 'team_email',
          type: 'email',
          required: true,
          label: localized('团队邮箱', 'Team email'),
          placeholder: localized('填写用于开通的邮箱', 'Email to activate'),
        },
      ],
    },
    promotion_rules: [],
    skus: [
      {
        id: 3001,
        sku_code: 'TEAM_SEAT_MONTHLY',
        spec_values: { 周期: '月付', 席位: '1 个' },
        price_amount: '99.00',
        promotion_price_amount: '',
        is_active: true,
        manual_stock_total: -1,
        auto_stock_available: 0,
        upstream_stock: -1,
      },
    ],
  },
  {
    id: 104,
    slug: 'prompt-kit',
    title: localized('极简提示词模板包', 'Minimal Prompt Kit'),
    description: localized('一套用于客服、运营和交付的结构化模板。', 'Structured templates for support and ops.'),
    content: localized('<p>包含多种常用业务场景模板，可直接复制使用。</p>', '<p>Reusable workflow templates.</p>'),
    images: [productImageD],
    category: mockCategories[3],
    tags: ['模板', '下载'],
    price_amount: '12.00',
    promotion_price_amount: '9.90',
    purchase_type: 'guest',
    fulfillment_type: 'auto',
    stock_status: 'in_stock',
    auto_stock_available: 88,
    is_sold_out: false,
    max_purchase_quantity: 20,
    payment_channel_ids: [1, 2, 3],
    promotion_rules: [],
    skus: [
      {
        id: 4001,
        sku_code: 'PROMPT_KIT',
        spec_values: { 版本: '基础版' },
        price_amount: '12.00',
        promotion_price_amount: '9.90',
        is_active: true,
        auto_stock_available: 88,
        manual_stock_total: 0,
        upstream_stock: -1,
      },
    ],
  },
]

export const mockBanners = [
  {
    id: 1,
    position: 'home_hero',
    title: localized('极简商店预览', 'Minimal shop preview'),
    subtitle: localized('assistant-ui 风格：白底、轻边框、清楚的购买路径。', 'assistant-ui inspired: calm, clear, responsive.'),
    image: svgImage('Minimal Store', 'assistant-ui style', '#f7f7f8', '#18181b'),
    mobile_image: svgImage('Mobile Checkout', 'Native interactions', '#f7f7f8', '#18181b'),
    link_type: 'route',
    link_value: '/products',
    open_in_new_tab: false,
  },
]

export const mockPosts = [
  {
    id: 1,
    slug: 'payment-guide',
    type: 'notice',
    title: localized('付款流程说明', 'Payment guide'),
    summary: localized('选择规格、填写邮箱、选择支付方式，然后按页面指引完成付款。', 'Choose SKU, fill email, select payment method, then pay.'),
    content: localized('<p>本地预览公告：付款页会展示二维码、链接与检查状态按钮。</p>', '<p>Local preview notice.</p>'),
    created_at: '2026-05-05T08:00:00+08:00',
  },
  {
    id: 2,
    slug: 'mobile-ordering',
    type: 'blog',
    title: localized('手机端下单优化', 'Mobile ordering improvements'),
    summary: localized('底部操作栏、抽屉筛选和大按钮让付款更直观。', 'Sticky actions and bottom sheets make checkout clearer.'),
    content: localized('<p>移动端保留底部导航，并把关键按钮固定在手指可触达区域。</p>', '<p>Mobile native interaction notes.</p>'),
    created_at: '2026-05-04T10:00:00+08:00',
  },
]
