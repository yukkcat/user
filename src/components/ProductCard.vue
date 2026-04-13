<template>
  <div
    class="group product-hover-card relative theme-panel rounded-none border overflow-hidden flex flex-col h-full theme-slide-up cursor-pointer"
    :class="isSoldOut(product)
      ? 'product-hover-card-disabled opacity-[0.85] grayscale-[0.2] saturate-50 border-rose-300/60 dark:border-rose-900/40'
      : 'theme-card-interactive'"
    :style="{ animationDelay: `${index * animationStep}ms` }"
    @click="$emit('click', product.slug)">
    <div class="aspect-[4/3] overflow-hidden theme-surface-muted relative shrink-0 border-b theme-border">
      <img
        v-if="product.images && getFirstImageUrl(product.images)"
        :src="getFirstImageUrl(product.images)"
        :alt="getLocalizedText(product.title)"
        loading="lazy"
        class="w-full h-full object-cover"
        :class="isSoldOut(product) ? 'grayscale brightness-75' : ''" />
      <img
        v-else-if="product.category?.icon"
        :src="getImageUrl(product.category.icon)"
        :alt="getLocalizedText(product.category?.name)"
        loading="lazy"
        class="w-full h-full object-cover"
        :class="isSoldOut(product) ? 'grayscale brightness-75' : ''" />
      <div v-else class="w-full h-full flex items-center justify-center theme-surface-muted theme-pixel-grid theme-text-muted">
        <svg class="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <div v-if="isSoldOut(product)" class="absolute inset-0 z-20 bg-black/40"></div>
      <div
        v-if="isSoldOut(product)"
        class="absolute left-2 top-2 md:left-3 md:top-3 z-30 theme-badge theme-badge-solid-danger">
        {{ t('products.stockStatus.outOfStock') }}
      </div>

      <div
        v-else-if="primaryTag"
        class="absolute top-2 right-2 md:top-3 md:right-3 z-20 flex justify-end">
        <span class="theme-badge theme-badge-inverse">
          {{ primaryTag }}
        </span>
      </div>
    </div>

    <div class="p-3 md:p-4 relative z-20 flex flex-col flex-1">
      <div
        v-if="product.category?.name"
        class="mb-1.5 md:mb-2 text-[11px] md:text-xs font-medium theme-text-muted truncate">
        {{ getLocalizedText(product.category.name) }}
      </div>

      <h3 class="text-sm md:text-base font-bold theme-text-primary mb-2 md:mb-2.5 line-clamp-2 min-h-[2.7rem] md:min-h-[3rem]">
        {{ getLocalizedText(product.title) }}
      </h3>

      <div class="mb-2.5 md:mb-3 flex flex-wrap items-center gap-1.5">
        <span
          class="theme-badge"
          :class="product.fulfillment_type === 'auto' ? 'theme-badge-info' : 'theme-badge-neutral'">
          {{ getFulfillmentTypeLabel(product.fulfillment_type) }}
        </span>
        <span
          v-if="shouldShowStockBadge(product)"
          class="theme-badge"
          :class="getStockBadgeClass(product.stock_status)">
          {{ getStockStatusLabel(product) }}
        </span>
        <span v-else-if="product.purchase_type === 'member'" class="theme-badge theme-badge-success">
          {{ getPurchaseTypeLabel(product.purchase_type) }}
        </span>
      </div>

      <p class="hidden md:block theme-text-secondary text-sm mb-5 line-clamp-2">
        {{ getLocalizedText(product.description) }}
      </p>

      <div class="flex items-center justify-between border-t theme-border pt-3 md:pt-4 mt-auto gap-3">
        <div class="flex flex-col min-w-0">
          <span class="hidden md:block text-[11px] font-medium theme-text-muted">
            {{ t('products.price') }}
          </span>
          <span v-if="hasPromotionPrice(product)" class="theme-price-sm theme-price-promotion">
            {{ formatPrice(getPromotionPriceAmount(product), siteCurrency) }}
          </span>
          <span v-else class="theme-price-sm theme-text-primary">
            {{ formatPrice(product.price_amount, siteCurrency) }}
          </span>
          <div v-if="hasPromotionPrice(product)" class="mt-1 flex flex-wrap items-center gap-1.5">
            <span class="hidden md:inline text-xs theme-price-original line-through">
              {{ formatPrice(product.price_amount, siteCurrency) }}
            </span>
            <span class="theme-badge theme-badge-danger theme-badge-xs">
              {{ t('products.promotionTag') }}
            </span>
          </div>
          <div v-else-if="hasPromotionRules(product)" class="mt-1 flex flex-wrap items-center gap-1.5">
            <span class="theme-badge theme-badge-warning theme-badge-xs">
              {{ t('products.promotionBadge') }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="theme-btn-secondary h-8 md:h-9 px-2.5 md:px-3 text-[10px] md:text-[11px] leading-none"
            :class="isSoldOut(product) ? 'opacity-40 cursor-not-allowed' : ''"
            :disabled="isSoldOut(product)"
            @click.stop="$emit('quickBuy', product)">
            {{ t('products.quickBuy') }}
          </button>

          <span
            class="hidden md:flex text-[11px] font-semibold items-center gap-1 transition-colors"
            :class="isSoldOut(product)
              ? 'text-rose-500/90 dark:text-rose-300/90'
              : 'theme-text-muted'">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getFirstImageUrl, getImageUrl } from '../utils/image'
import { useLocalized, useProductLabels } from '../composables/useProduct'

const props = withDefaults(defineProps<{
  product: any
  index?: number
  maxTags?: number
  animationStep?: number
}>(), {
  index: 0,
  maxTags: 1,
  animationStep: 50,
})

defineEmits<{
  click: [slug: string]
  quickBuy: [product: any]
}>()

const { t } = useI18n()
const { getLocalizedText, siteCurrency, formatPrice } = useLocalized()
const {
  getPurchaseTypeLabel,
  getFulfillmentTypeLabel,
  getStockBadgeClass,
  getStockStatusLabel,
  isSoldOut,
  hasPromotionPrice,
  getPromotionPriceAmount,
  hasPromotionRules,
} = useProductLabels()

const primaryTag = computed(() => props.product?.tags?.slice(0, props.maxTags)?.[0] || '')

const shouldShowStockBadge = (product: any) =>
  product?.stock_status === 'low_stock' || product?.stock_status === 'out_of_stock'
</script>

<style scoped>
.product-hover-card {
  transition: transform 140ms ease, border-color 140ms ease, background-color 140ms ease;
}

.product-hover-card:hover {
  transform: translate(-2px, -2px);
  border-color: var(--ui-accent);
  background-color: var(--ui-bg-overlay-strong);
}

.product-hover-card-disabled:hover {
  transform: none;
  border-color: inherit;
  background-color: inherit;
}
</style>
