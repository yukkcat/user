<template>
  <div
    v-if="props.channels.length > 0"
    class="payment-channel-grid grid grid-cols-1 md:grid-cols-2 gap-4"
    :class="{ 'payment-channel-grid-compact': props.compact }"
  >
    <button v-for="channel in props.channels" :key="channel.id"
      type="button"
      :disabled="isDisabled(channel)"
      :aria-pressed="isSelected(channel)"
      :title="isDisabled(channel) ? channelHint(channel) : ''"
      @click="handleSelect(channel)"
      class="payment-channel-card commerce-option text-left border rounded-xl p-4 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      :class="[
        isSelected(channel) ? 'theme-selected-surface' : 'theme-interactive-surface',
        props.compact ? 'payment-channel-card-compact' : '',
      ]">
      <div class="flex items-center justify-between gap-3">
        <div class="flex min-w-0 items-center gap-2">
          <span class="payment-channel-radio" aria-hidden="true">
            <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.414 0l-3.2-3.2a1 1 0 111.414-1.414l2.493 2.493 6.493-6.493a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </span>
          <img v-if="channel.icon" :src="getImageUrl(channel.icon)" loading="lazy" class="h-5 w-5 rounded object-contain shrink-0" />
          <div class="min-w-0 theme-text-primary font-medium truncate">{{ channel.name }}</div>
        </div>
        <UiBadge
          size="xs"
          class="payment-channel-action-mark"
          :class="isSelected(channel)
            ? 'payment-channel-action-mark-selected'
            : isDisabled(channel)
              ? 'payment-channel-action-mark-disabled'
              : ''"
        >
          {{
            isSelected(channel)
              ? t('payment.selected')
              : isDisabled(channel)
                ? t('payment.unavailable')
                : t('payment.tapToSelect')
          }}
        </UiBadge>
      </div>
      <div class="mt-2 space-y-1 text-xs theme-text-muted">
        <div>{{ t('payment.feeLabel') }}：{{ props.formatChannelFeeRate(channel) }}</div>
        <div>{{ t('payment.fixedFeeLabel') }}：{{ props.formatChannelFixedFee(channel) }}</div>
      </div>
      <div v-if="isDisabled(channel)" class="mt-2 text-xs text-amber-600">
        {{ channelHint(channel) }}
      </div>
    </button>
  </div>
  <div v-else-if="props.showBalanceOption" class="text-sm theme-text-muted">
    {{ t('payment.channelEmptyUseBalance') }}
  </div>
  <div v-else class="text-sm theme-text-muted">
    {{ t('payment.channelEmpty') }}
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { getImageUrl } from '../../utils/image'
import UiBadge from '../ui/UiBadge.vue'

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const { t } = useI18n()

const props = defineProps<{
  channels: any[]
  modelValue: number | null
  showBalanceOption: boolean
  formatChannelFeeRate: (channel?: any) => string
  formatChannelFixedFee: (channel?: any) => string
  isChannelDisabledForAmount?: (channel?: any) => boolean
  channelAmountLimitHint?: (channel?: any) => string
  compact?: boolean
}>()

const isSelected = (channel?: any) =>
  Number(props.modelValue) === Number(channel?.id) && !isDisabled(channel)

const isDisabled = (channel?: any) => {
  if (!props.isChannelDisabledForAmount) return false
  return Boolean(props.isChannelDisabledForAmount(channel))
}

const channelHint = (channel?: any) => {
  if (!props.channelAmountLimitHint) return ''
  return String(props.channelAmountLimitHint(channel) || '')
}

const handleSelect = (channel?: any) => {
  if (!channel || isDisabled(channel)) return
  const id = Number(channel.id)
  if (!Number.isFinite(id) || id <= 0) return
  emit('update:modelValue', id)
}
</script>
