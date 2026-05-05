<template>
  <div class="ui-flow-steps commerce-card rounded-2xl border theme-border theme-panel-soft p-4">
    <div class="ui-flow-steps-track flex items-center">
      <template v-for="(step, index) in steps" :key="step.key">
        <div class="ui-flow-step flex items-center gap-2" :class="index === 0 ? '' : 'flex-1'">
          <div
            v-if="index > 0"
            class="ui-flow-line flex-1 h-0.5 rounded-full transition-colors"
            :class="step.active ? 'ui-flow-line-active' : 'ui-flow-line-muted'"
          />
          <div class="ui-flow-step-label flex items-center gap-2 shrink-0">
            <span
              class="ui-flow-index"
              :class="step.active ? 'ui-flow-index-active' : 'ui-flow-index-muted'"
            >
              {{ index + 1 }}
            </span>
            <span
              class="ui-flow-text"
              :class="step.active ? 'theme-text-primary' : 'theme-text-muted'"
            >
              {{ step.label }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  steps: Array<{
    key: string
    label: string
    active?: boolean
  }>
}>()
</script>
