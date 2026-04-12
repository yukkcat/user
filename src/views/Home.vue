<template>
  <div class="home-page min-h-screen theme-page">
    <template v-if="templateMode === 'list'">
      <section
        v-if="showHeroSection"
        class="relative z-10 border-b theme-border pt-24 pb-10"
      >
        <div class="container mx-auto px-4">
          <div
            class="relative overflow-hidden border theme-panel-strong"
            @touchstart="onBannerTouchStart"
            @touchend="onBannerTouchEnd"
          >
            <Transition name="banner-fade" mode="out-in">
              <img
                v-if="!bannerLoading && heroImage"
                :key="heroImage"
                :src="heroImage"
                class="absolute inset-0 h-full w-full object-cover"
              />
            </Transition>
            <div class="absolute inset-0 bg-black/45"></div>

            <div
              v-if="bannerLoading"
              class="relative flex min-h-[200px] flex-col justify-between p-5 sm:min-h-[240px] sm:p-6 md:min-h-[320px] md:p-10"
            >
              <div class="space-y-3">
                <div
                  class="h-5 w-24 theme-skeleton"
                  style="background: rgba(255, 255, 255, 0.35)"
                ></div>
                <div
                  class="h-8 max-w-3xl theme-skeleton md:h-10"
                  style="background: rgba(255, 255, 255, 0.35)"
                ></div>
                <div
                  class="h-4 max-w-2xl theme-skeleton"
                  style="background: rgba(255, 255, 255, 0.3)"
                ></div>
              </div>
            </div>

            <div
              v-else
              class="relative flex min-h-[200px] flex-col justify-between p-5 sm:min-h-[240px] sm:p-6 md:min-h-[320px] md:p-10"
            >
              <div v-if="bannerCount > 1" class="mb-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="home-banner-nav"
                  :aria-label="t('common.previousBanner')"
                  @click="handlePrevHeroBanner"
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  class="home-banner-nav"
                  :aria-label="t('common.nextBanner')"
                  @click="handleNextHeroBanner"
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div class="space-y-2 sm:space-y-3">
                <span class="theme-badge theme-badge-inverse gap-2 text-xs font-semibold uppercase tracking-wider">
                  <span class="h-2 w-2 bg-[#d3a33d]"></span>
                  {{ heroBadge }}
                </span>
                <h1 class="max-w-4xl text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl md:text-3xl">
                  {{ heroTitle }}
                </h1>
                <p class="max-w-3xl text-xs leading-relaxed text-gray-100 sm:text-sm">
                  {{ heroSubtitle }}
                </p>
              </div>

              <div v-if="bannerCount > 1" class="mt-4 flex items-center gap-2">
                <button
                  v-for="(_, bIdx) in banners"
                  :key="`list-dot-${bIdx}`"
                  type="button"
                  class="home-banner-dot"
                  :class="bIdx === currentBannerIndex ? 'home-banner-dot-active' : ''"
                  @click="selectHeroBanner(bIdx)"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="relative z-10 pb-6" :class="showHeroSection ? 'pt-6' : 'pt-24'">
        <div class="container mx-auto px-4">
          <div class="flex flex-col gap-6 lg:flex-row">
            <CategorySidebar
              :categories="listCategoryGroups"
              :selected-category="listSelectedCategory"
              :expanded-parent-ids="listExpandedParentIds"
              :show-drawer="listShowFilterDrawer"
              compact
              @select-category="listSelectCategory"
              @toggle-parent="listToggleParentCategory"
              @update:show-drawer="listShowFilterDrawer = $event"
            />

            <main class="min-w-0 flex-1">
              <div class="relative mb-4">
                <div class="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                  <svg
                    class="h-4 w-4 theme-text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  v-model="listSearchQuery"
                  type="text"
                  class="theme-panel h-10 w-full border pl-10 pr-10 text-sm theme-text-primary placeholder:theme-text-muted focus:outline-none"
                  :placeholder="t('products.searchBoxPlaceholder')"
                  @keydown.enter="listOnSearch"
                />
                <button
                  v-if="listSearchQuery"
                  type="button"
                  class="absolute inset-y-0 right-3 flex items-center theme-text-muted hover:theme-text-primary"
                  @click="listClearSearch"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div v-if="listLoading" class="space-y-6">
                <div v-for="i in 3" :key="i">
                  <div class="mb-3 flex items-center gap-2 px-0.5">
                    <div class="h-5 w-5 theme-skeleton"></div>
                    <div class="h-4 w-28 theme-skeleton"></div>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="j in 3"
                      :key="j"
                      class="theme-panel flex h-[72px] items-center border"
                    >
                      <div class="theme-skeleton m-2 h-14 w-14 shrink-0"></div>
                      <div class="flex-1 space-y-2 px-3 py-2">
                        <div class="h-3.5 w-1/3 theme-skeleton"></div>
                        <div class="h-3 w-1/4 theme-skeleton"></div>
                      </div>
                      <div class="px-4 py-2">
                        <div class="h-4 w-14 theme-skeleton"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="listProductGroups.length > 0" class="space-y-6">
                <div v-for="group in listProductGroups" :key="group.categoryId ?? 'uncategorized'">
                  <div class="mb-3 flex items-center gap-2 px-0.5">
                    <span class="theme-accent-stick h-5 w-1 shrink-0"></span>
                    <img
                      v-if="group.categoryIcon"
                      :src="getImageUrl(group.categoryIcon)"
                      :alt="group.categoryName"
                      loading="lazy"
                      class="h-5 w-5 shrink-0 object-cover"
                    />
                    <span class="truncate text-sm font-semibold theme-text-primary">
                      {{ group.categoryName }}
                    </span>
                    <span class="text-xs theme-text-muted">({{ group.products.length }})</span>
                  </div>

                  <div class="space-y-2">
                    <ProductListItem
                      v-for="(product, idx) in group.products"
                      :key="product.id"
                      :product="product"
                      :index="idx"
                      :animation-step="20"
                      @click="goToProduct"
                      @quick-buy="openQuickBuy"
                    />
                  </div>
                </div>

                <PaginationNav
                  :current-page="listCurrentPage"
                  :total-pages="listTotalPages"
                  compact
                  @change-page="listChangePage"
                />
              </div>

              <div v-else class="theme-panel-soft border py-16 text-center theme-text-muted">
                <svg
                  class="mx-auto mb-4 h-16 w-16 theme-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p class="text-lg">{{ t('products.empty') }}</p>
              </div>
            </main>
          </div>
        </div>
      </section>
    </template>

    <template v-else>
      <section
        v-if="showHeroSection"
        class="relative z-10 border-b theme-border pt-24 pb-10"
      >
        <div class="container mx-auto px-4">
          <div
            class="relative overflow-hidden border theme-panel-strong"
            @touchstart="onBannerTouchStart"
            @touchend="onBannerTouchEnd"
          >
            <Transition name="banner-fade" mode="out-in">
              <img
                v-if="!bannerLoading && heroImage"
                :key="heroImage"
                :src="heroImage"
                class="absolute inset-0 h-full w-full object-cover"
              />
            </Transition>
            <div class="absolute inset-0 bg-black/45"></div>

            <div
              v-if="bannerLoading"
              class="relative flex min-h-[260px] flex-col justify-between p-5 sm:min-h-[320px] sm:p-6 md:min-h-[420px] md:p-12"
            >
              <div class="space-y-4">
                <div
                  class="h-6 w-28 theme-skeleton"
                  style="background: rgba(255, 255, 255, 0.35)"
                ></div>
                <div
                  class="h-10 max-w-4xl theme-skeleton md:h-14"
                  style="background: rgba(255, 255, 255, 0.35)"
                ></div>
                <div
                  class="h-5 max-w-3xl theme-skeleton"
                  style="background: rgba(255, 255, 255, 0.3)"
                ></div>
              </div>

              <div class="flex flex-wrap items-center gap-3 pt-6">
                <div
                  class="h-11 w-36 theme-skeleton"
                  style="background: rgba(255, 255, 255, 0.35)"
                ></div>
                <div
                  class="h-11 w-28 theme-skeleton"
                  style="background: rgba(255, 255, 255, 0.25)"
                ></div>
              </div>
            </div>

            <div
              v-else
              class="relative flex min-h-[260px] flex-col justify-between p-5 sm:min-h-[320px] sm:p-6 md:min-h-[420px] md:p-12"
            >
              <div v-if="bannerCount > 1" class="mb-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="home-banner-nav"
                  :aria-label="t('common.previousBanner')"
                  @click="handlePrevHeroBanner"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  class="home-banner-nav"
                  :aria-label="t('common.nextBanner')"
                  @click="handleNextHeroBanner"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div class="space-y-3 sm:space-y-4">
                <span class="theme-badge theme-badge-inverse gap-2 text-xs font-semibold uppercase tracking-wider">
                  <span class="h-2 w-2 bg-[#d3a33d]"></span>
                  {{ heroBadge }}
                </span>
                <h1 class="max-w-4xl text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl md:text-[2.85rem]">
                  {{ heroTitle }}
                </h1>
                <p class="max-w-3xl text-xs leading-relaxed text-gray-100 sm:text-sm md:text-base">
                  {{ heroSubtitle }}
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-3 pt-5 sm:pt-6">
                <button
                  type="button"
                  class="theme-btn-primary theme-btn-inline-md text-sm"
                  @click="goToHeroLink"
                >
                  {{ heroPrimaryButtonText }}
                </button>
                <router-link
                  v-if="!hasHeroLink"
                  to="/products"
                  class="theme-btn-secondary theme-btn-inline-md text-sm"
                >
                  {{ t('home.featured.viewAll') }}
                </router-link>
              </div>

              <div v-if="bannerCount > 1" class="mt-5 flex items-center gap-2">
                <button
                  v-for="(_, index) in banners"
                  :key="`hero-dot-${index}`"
                  type="button"
                  class="home-banner-dot"
                  :class="index === currentBannerIndex ? 'home-banner-dot-active' : ''"
                  :aria-label="t('common.switchBanner', { n: index + 1 })"
                  @click="selectHeroBanner(index)"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="featured"
        class="relative z-10 pb-14"
        :class="showHeroSection ? 'pt-14' : 'pt-32 md:pt-36'"
      >
        <div class="container mx-auto px-4">
          <div class="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 class="theme-section-heading text-3xl md:text-4xl">
                {{ t('home.featured.title') }}
              </h2>
              <p class="mt-2 text-sm theme-text-secondary">
                {{ t('home.featured.description') }}
              </p>
            </div>
            <router-link
              v-if="!hasHeroLink"
              to="/products"
              class="text-sm font-semibold theme-link-muted"
            >
              {{ t('home.featured.viewAll') }}
            </router-link>
          </div>

          <div
            v-if="products.length > 0"
            class="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5"
          >
            <ProductCard
              v-for="(product, idx) in products"
              :key="product.id"
              :product="product"
              :index="idx"
              :animation-step="60"
              @click="goToProduct"
              @quick-buy="openQuickBuy"
            />
          </div>
          <div v-else class="theme-panel-soft border py-16 text-center theme-text-muted">
            <svg
              class="mx-auto mb-4 h-16 w-16 theme-text-muted opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            {{ t('home.featured.empty') }}
          </div>
        </div>
      </section>

      <template v-if="latestSectionVisible">
        <hr class="theme-section-divider mx-4 md:mx-auto md:max-w-6xl" />

        <section class="relative z-10 py-12">
          <div class="container mx-auto px-4">
            <div class="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 class="theme-section-heading text-[1.7rem]">
                  {{ t('home.latest.title') }}
                </h2>
                <p class="mt-1 text-sm theme-text-secondary">
                  {{ t('home.latest.description') }}
                </p>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <router-link v-if="blogEnabled" to="/blog" class="theme-link-muted">
                  {{ t('nav.blog') }}
                </router-link>
                <router-link v-if="noticeEnabled" to="/notice" class="theme-link-muted">
                  {{ t('nav.notice') }}
                </router-link>
              </div>
            </div>

            <div v-if="posts.length > 0" class="grid grid-cols-1 gap-5 md:grid-cols-3">
              <article
                v-for="post in posts"
                :key="post.id"
                class="theme-panel home-post-card border p-5"
                @click="goToPost(post.slug)"
              >
                <div class="mb-2 text-xs theme-text-muted">{{ formatDate(post.created_at) }}</div>
                <h3 class="line-clamp-2 text-base font-semibold">
                  {{ getLocalizedText(post.title) }}
                </h3>
                <p class="mt-2 line-clamp-2 text-sm theme-text-secondary">
                  {{ getLocalizedText(post.summary) }}
                </p>
                <div class="mt-4 text-sm font-medium theme-link">
                  {{ t('blog.readMore') }}
                </div>
              </article>
            </div>
            <div v-else class="theme-panel-soft border py-12 text-center theme-text-muted">
              {{ t('blog.empty') }}
            </div>
          </div>
        </section>
      </template>
    </template>

    <ProductQuickBuy
      v-if="quickBuyProduct"
      :product="quickBuyProduct"
      :visible="quickBuyVisible"
      @update:visible="quickBuyVisible = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { postAPI, productAPI } from '../api'
import { getImageUrl } from '../utils/image'
import { useLocalized } from '../composables/useProduct'
import { useBannerCarousel } from '../composables/useBannerCarousel'
import { useProductList } from '../composables/useProductList'
import { useProductListGroups } from '../composables/useProductListGroups'
import { useAppStore } from '../stores/app'
import ProductCard from '../components/ProductCard.vue'
import ProductListItem from '../components/ProductListItem.vue'
import ProductQuickBuy from '../components/ProductQuickBuy.vue'
import CategorySidebar from '../components/CategorySidebar.vue'
import PaginationNav from '../components/PaginationNav.vue'

const router = useRouter()
const { t } = useI18n()
const { getLocalizedText } = useLocalized()
const appStore = useAppStore()

const templateMode = computed(() => appStore.config?.template_mode || 'card')
const navBuiltin = computed(
  () => (appStore.config?.nav_config as { builtin?: Record<string, boolean> } | undefined)?.builtin,
)
const blogEnabled = computed(() => navBuiltin.value?.blog !== false)
const noticeEnabled = computed(() => navBuiltin.value?.notice !== false)
const latestSectionVisible = computed(() => blogEnabled.value || noticeEnabled.value)

const products = ref<any[]>([])
const posts = ref<any[]>([])
const quickBuyProduct = ref<any>(null)
const quickBuyVisible = ref(false)

const openQuickBuy = (product: any) => {
  quickBuyProduct.value = product
  quickBuyVisible.value = true
}

const {
  banners,
  bannerLoading,
  currentBannerIndex,
  bannerCount,
  showHeroSection,
  heroImage,
  heroBadge,
  heroTitle,
  heroSubtitle,
  hasHeroLink,
  heroPrimaryButtonText,
  loadBanners,
  handleNextHeroBanner,
  handlePrevHeroBanner,
  selectHeroBanner,
  goToHeroLink,
  onBannerTouchStart,
  onBannerTouchEnd,
  stopHeroAutoPlay,
} = useBannerCarousel()

const {
  loading: listLoading,
  products: listProducts,
  selectedCategory: listSelectedCategory,
  searchQuery: listSearchQuery,
  currentPage: listCurrentPage,
  totalPages: listTotalPages,
  showFilterDrawer: listShowFilterDrawer,
  expandedParentIds: listExpandedParentIds,
  categoryGroups: listCategoryGroups,
  categoryMap: listCategoryMap,
  selectCategory: listSelectCategory,
  toggleParentCategory: listToggleParentCategory,
  changePage: listChangePage,
  clearSearch: listClearSearch,
  onSearch: listOnSearch,
  initialize: listInitialize,
  cleanup: listCleanup,
} = useProductList({ pageSize: 20, homeRouteName: 'home' })

const listProductGroups = useProductListGroups(listProducts, listCategoryMap)

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const goToProduct = (slug: string) => {
  router.push(`/products/${slug}`)
}

const goToPost = (slug: string) => {
  router.push(`/blog/${slug}`)
}

const loadFeaturedProducts = async () => {
  try {
    const response = await productAPI.list({ page: 1, page_size: 15 })
    products.value = response.data.data || []
  } catch (error) {
    console.error('Failed to load products:', error)
  }
}

const loadLatestPosts = async () => {
  if (!latestSectionVisible.value) return
  try {
    const params: Record<string, unknown> = { page: 1, page_size: 3 }
    if (blogEnabled.value && !noticeEnabled.value) params.type = 'blog'
    if (!blogEnabled.value && noticeEnabled.value) params.type = 'notice'
    const response = await postAPI.list(params)
    posts.value = response.data.data || []
  } catch (error) {
    console.error('Failed to load posts:', error)
  }
}

onMounted(async () => {
  if (templateMode.value === 'list') {
    await Promise.all([loadBanners(), listInitialize()])
  } else {
    await Promise.all([loadBanners(), loadFeaturedProducts(), loadLatestPosts()])
  }
})

onUnmounted(() => {
  stopHeroAutoPlay()
  listCleanup()
})
</script>

<style scoped>
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: opacity 180ms ease;
}

.banner-fade-enter-from,
.banner-fade-leave-to {
  opacity: 0;
}

.home-banner-nav {
  display: inline-flex;
  height: 2.5rem;
  width: 2.5rem;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ui-border);
  background: var(--ui-bg-overlay-strong);
  color: var(--ui-text-primary);
  box-shadow: var(--ui-shadow-soft);
}

.home-banner-dot {
  height: 0.625rem;
  width: 0.625rem;
  border: 1px solid color-mix(in oklab, var(--ui-border-strong) 70%, transparent);
  background: transparent;
}

.home-banner-dot-active {
  width: 1.75rem;
  background: var(--ui-accent);
  border-color: var(--ui-accent);
}

.home-post-card {
  cursor: pointer;
}
</style>
