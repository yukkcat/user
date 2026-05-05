<template>
  <component
    :is="as"
    class="ui-button commerce-button"
    :class="classes"
    :type="buttonType"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  as?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}>(), {
  as: 'button',
  type: 'button',
  variant: 'secondary',
  size: 'md',
  block: false,
})

const buttonType = computed(() => props.as === 'button' ? props.type : undefined)
const classes = computed(() => [
  `ui-button-${props.variant}`,
  `ui-button-${props.size}`,
  props.variant === 'primary' ? 'commerce-primary' : '',
  props.block ? 'ui-button-block' : '',
])
</script>
