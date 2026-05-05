<template>
  <component :is="as" class="ui-panel commerce-panel" :class="classes">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  as?: string
  tone?: 'default' | 'soft' | 'strong' | 'flat'
  padded?: boolean
}>(), {
  as: 'div',
  tone: 'default',
  padded: false,
})

const classes = computed(() => [
  `ui-panel-${props.tone}`,
  props.padded ? 'ui-panel-padded' : '',
])
</script>
