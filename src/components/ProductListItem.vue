<template>
  <div
    class="group product-list-hover relative theme-panel rounded-none border overflow-hidden flex flex-row items-center cursor-pointer theme-slide-up"
    :class="isSoldOut(product)
      ? 'product-list-hover-disabled opacity-[0.85] grayscale-[0.2] saturate-50 border-rose-300/60 dark:border-rose-900/40'
      : 'theme-card-interactive'"
    :style="{ animationDelay: `${index * animationStep}ms` }"
    @click="$emit('click', product.slug)">
    <div class="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 overflow-hidden relative rounded-none m-2 border theme-border theme-surface-muted">
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
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <div v-if="isSoldOut(product)" class="absolute inset-0 bg-black/45 flex items-center justify-center">
        <span class="theme-badge theme-badge-solid-danger theme-badge-xs">
          {{ t('products.stockStatus.outOfStock') }}
        </span>
      </div>
    </div>

    <div class="flex-1 min-w-0 py-2 pr-1 sm:pr-2 flex flex-col justify-center gap-1">
      <div v-if="product.category?.name" class="text-[10px] sm:text-[11px] theme-text-muted uppercase tracking-[0.16em] truncate">
        {{ getLocalizedText(product.category.name) }}
      </div>

      <h3 class="text-xs sm:text-sm font-semibold theme-text-primary line-clamp-2">
        {{ getLocalizedText(product.title) }}
      </h3>

      <div class="flex flex-wrap items-center gap-1.5">
        <span
          class="theme-badge-xs"
          :class="product.fulfillment_type === 'auto' ? 'theme-badge-info' : 'theme-badge-neutral'">
          {{ getFulfillmentTypeLabel(product.fulfillment_type) }}
        </span>
        <span
          v-if="shouldShowStockBadge(product)"
          class="theme-badge-xs"
          :class="getStockBadgeClass(product.stock_status)">
          {{ getStockStatusLabel(product) }}
        </span>
        <span v-else-if="product.purchase_type === 'member'" class="theme-badge-xs theme-badge-success">
          {{ getPurchaseTypeLabel(product.purchase_type) }}
        </span>
      </div>
    </div>

    <div class="flex-shrink-0 flex items-center gap-2 sm:gap-3 pr-2 sm:pr-4">
      <div class="text-right">
        <div v-if="hasPromotionPrice(product)" class="flex flex-col items-end">
          <span class="text-xs sm:text-sm font-bold theme-price-promotion whitespace-nowrap">
            {{ formatPrice(getPromotionPriceAmount(product), siteCurrency) }}
          </span>
          <div class="flex items-center gap-1">
            <span class="hidden sm:inline text-[10px] theme-price-original line-through">
              {{ formatPrice(product.price_amount, siteCurrency) }}
            </span>
            <span class="theme-badge theme-badge-danger theme-badge-xs">
              {{ t('products.promotionTag') }}
            </span>
          </div>
        </div>
        <div v-else class="flex flex-col items-end">
          <span class="text-xs sm:text-sm font-bold theme-text-primary whitespace-nowrap">
            {{ formatPrice(product.price_amount, siteCurrency) }}
          </span>
          <span v-if="hasPromotionRules(product)" class="theme-badge theme-badge-warning theme-badge-xs mt-1">
            {{ t('products.promotionBadge') }}
          </span>
        </div>
      </div>

      <button
        type="button"
        class="theme-btn-secondary h-8 px-2 sm:px-2.5 text-[10px] sm:text-[11px] leading-none flex-shrink-0"
        :class="isSoldOut(product) ? 'opacity-40 cursor-not-allowed' : ''"
        :disabled="isSoldOut(product)"
        @click.stop="$emit('quickBuy', product)">
        {{ t('products.quickBuy') }}
      </button>

      <svg
        class="hidden sm:block w-4 h-4 flex-shrink-0 theme-text-muted"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { getFirstImageUrl, getImageUrl } from '../utils/image'
import { useLocalized, useProductLabels } from '../composables/useProduct'

withDefaults(defineProps<{
  product: any
  index?: number
  animationStep?: number
}>(), {
  index: 0,
  animationStep: 30,
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

const shouldShowStockBadge = (product: any) =>
  product?.stock_status === 'low_stock' || product?.stock_status === 'out_of_stock'
</script>

<style scoped>
.product-list-hover {
  transition: transform 140ms ease, border-color 140ms ease, background-color 140ms ease;
}

.product-list-hover:hover {
  transform: translate(-2px, -2px);
  border-color: var(--ui-accent);
  background-color: var(--ui-bg-overlay-strong);
}

.product-list-hover-disabled:hover {
  transform: none;
  border-color: inherit;
  background-color: inherit;
}
</style>
