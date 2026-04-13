<template>
  <div ref="rootRef" class="theme-select-root">
    <button
      ref="triggerRef"
      type="button"
      class="theme-select-trigger"
      :class="[sizeClass, { 'theme-select-trigger-open': open, 'theme-select-trigger-disabled': disabled }]"
      :disabled="disabled"
      :aria-expanded="open ? 'true' : 'false'"
      aria-haspopup="listbox"
      @click="toggleOpen"
    >
      <span
        class="theme-select-trigger-text"
        :class="{ 'theme-select-trigger-placeholder': !selectedOption }"
      >
        {{ selectedLabel }}
      </span>
      <span class="theme-select-trigger-side" aria-hidden="true">
        <span class="theme-select-trigger-divider"></span>
        <span class="theme-select-trigger-caret" :class="{ 'theme-select-trigger-caret-open': open }"></span>
      </span>
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        ref="menuRef"
        class="theme-select-menu"
        :class="{ 'theme-select-menu-top': placement === 'top' }"
        :style="menuStyle"
        role="listbox"
      >
        <button
          v-for="option in options"
          :key="optionKey(option)"
          type="button"
          role="option"
          class="theme-select-option"
          :class="{
            'theme-select-option-active': isSelected(option.value),
            'theme-select-option-disabled': option.disabled,
          }"
          :aria-selected="isSelected(option.value) ? 'true' : 'false'"
          :disabled="option.disabled"
          @click="selectOption(option)"
        >
          <span class="theme-select-option-label">{{ option.label }}</span>
          <span v-if="isSelected(option.value)" class="theme-select-option-check"></span>
        </button>

        <div v-if="options.length === 0" class="theme-select-empty">
          {{ emptyText }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch, type CSSProperties } from 'vue'

type SelectValue = string | number | null | undefined

interface SelectOption {
  label: string
  value: SelectValue
  disabled?: boolean
}

interface Props {
  modelValue: SelectValue
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  size?: 'md' | 'compact'
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  size: 'md',
  emptyText: '暂无可选项',
})

const emit = defineEmits<{
  'update:modelValue': [value: SelectValue]
  change: [value: SelectValue]
}>()

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const open = ref(false)
const placement = ref<'top' | 'bottom'>('bottom')
const menuStyle = ref<CSSProperties>({})

const VIEWPORT_MARGIN = 12
const MENU_GAP = 8
const MIN_MENU_HEIGHT = 96

const sizeClass = computed(() =>
  props.size === 'compact' ? 'theme-select-trigger-compact' : 'theme-select-trigger-md',
)

const selectedOption = computed(() =>
  props.options.find((option) => Object.is(option.value, props.modelValue)),
)

const selectedLabel = computed(() => selectedOption.value?.label || props.placeholder)

const closeMenu = () => {
  open.value = false
}

const toggleOpen = () => {
  if (props.disabled || props.options.length === 0) return
  open.value = !open.value
}

const isSelected = (value: SelectValue) => Object.is(value, props.modelValue)

const selectOption = (option: SelectOption) => {
  if (option.disabled) return
  if (isSelected(option.value)) {
    closeMenu()
    return
  }
  emit('update:modelValue', option.value)
  emit('change', option.value)
  closeMenu()
}

const optionKey = (option: SelectOption) => `${typeof option.value}:${String(option.value)}`

const handleDocumentClick = (event: MouseEvent) => {
  if (!open.value) return
  const target = event.target as Node | null
  if (!target) return
  if (rootRef.value?.contains(target) || menuRef.value?.contains(target)) return
  closeMenu()
}

const handleDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !open.value) return
  closeMenu()
  triggerRef.value?.focus()
}

const updateMenuPosition = async () => {
  if (!open.value || !triggerRef.value) return
  await nextTick()

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const menuEl = menuRef.value
  if (!menuEl) return

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const availableBelow = viewportHeight - triggerRect.bottom - MENU_GAP - VIEWPORT_MARGIN
  const availableAbove = triggerRect.top - MENU_GAP - VIEWPORT_MARGIN
  const naturalHeight = menuEl.scrollHeight
  const desiredHeight = Math.min(naturalHeight, 320)
  const placeOnTop = availableBelow < desiredHeight && availableAbove > availableBelow
  const sideAvailableHeight = Math.max(placeOnTop ? availableAbove : availableBelow, 0)
  const fallbackHeight = Math.min(
    MIN_MENU_HEIGHT,
    Math.max(availableAbove, availableBelow, 0),
  )
  const availableHeight = Math.max(sideAvailableHeight, fallbackHeight)
  const width = Math.min(triggerRect.width, viewportWidth - VIEWPORT_MARGIN * 2)
  const resolvedHeight = Math.min(naturalHeight, availableHeight)
  const left = Math.min(
    Math.max(triggerRect.left, VIEWPORT_MARGIN),
    viewportWidth - width - VIEWPORT_MARGIN,
  )
  const top = placeOnTop
    ? Math.max(VIEWPORT_MARGIN, triggerRect.top - MENU_GAP - resolvedHeight)
    : Math.min(
      viewportHeight - VIEWPORT_MARGIN - resolvedHeight,
      triggerRect.bottom + MENU_GAP,
    )

  placement.value = placeOnTop ? 'top' : 'bottom'
  menuStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    maxHeight: `${availableHeight}px`,
  }
}

const handleViewportChange = () => {
  if (!open.value) return
  void updateMenuPosition()
}

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) closeMenu()
  },
)

watch(
  () => props.options.length,
  (count) => {
    if (count === 0) closeMenu()
    else if (open.value) void updateMenuPosition()
  },
)

watch(open, (value) => {
  if (value) {
    void updateMenuPosition()
    return
  }
  menuStyle.value = {}
  placement.value = 'bottom'
})

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleDocumentKeydown)
  window.addEventListener('resize', handleViewportChange)
  window.addEventListener('scroll', handleViewportChange, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleDocumentKeydown)
  window.removeEventListener('resize', handleViewportChange)
  window.removeEventListener('scroll', handleViewportChange, true)
})
</script>
