<template>
  <component :is="as" class="ui-badge commerce-chip" :class="classes">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  as?: string
  variant?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'inverse'
  size?: 'xs' | 'sm' | 'md'
}>(), {
  as: 'span',
  variant: 'neutral',
  size: 'sm',
})

const classes = computed(() => [
  `ui-badge-${props.variant}`,
  `ui-badge-${props.size}`,
])
</script>
