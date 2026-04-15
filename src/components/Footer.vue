<template>
  <footer class="relative overflow-hidden border-t theme-border theme-panel-strong">
    <div class="container mx-auto px-4 pt-12 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:py-14">
      <div class="border-b theme-border pb-8">
        <div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div class="max-w-2xl space-y-4">
            <div class="flex items-center gap-3">
              <div class="flex h-11 w-11 shrink-0 items-center justify-center theme-btn-primary">
                <span class="text-sm font-black text-white">{{ brandInitial }}</span>
              </div>
              <div class="min-w-0">
                <p class="text-[11px] font-semibold theme-text-muted">
                  {{ t('common.siteName') }}
                </p>
                <h3 class="truncate text-xl font-black tracking-tight theme-text-primary">
                  {{ brandSiteName }}
                </h3>
              </div>
            </div>

            <p class="max-w-2xl text-sm leading-7 theme-text-secondary">
              {{ brandDescription || t('footer.description') }}
            </p>
          </div>

          <div v-if="contactLinks.length || footerLinks.length" class="flex flex-wrap gap-2.5 md:justify-end">
            <a
              v-for="link in contactLinks"
              :key="link.label"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="theme-nav-link gap-2 px-3 py-2 no-underline">
              <svg
                v-if="link.label === 'Telegram'"
                class="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true">
                <path
                  d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394a.83.83 0 0 1-.61.294h-.005l.214-3.053 5.559-5.023c.24-.213-.054-.334-.373-.121l-6.868 4.326-2.961-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.833.941Z" />
              </svg>
              <svg
                v-else
                class="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true">
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a8.57 8.57 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              <span>{{ link.label }}</span>
            </a>

            <a
              v-for="link in footerLinks"
              :key="link.name"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="theme-nav-link gap-2 px-3 py-2 no-underline">
              {{ link.name }}
            </a>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4 pt-6 text-xs md:flex-row md:items-end md:justify-between">
        <div class="space-y-1 text-center theme-text-muted md:text-left">
          <p>&copy; {{ currentYear }} {{ brandSiteName }}. {{ t('footer.rights') }}</p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-end">
          <router-link to="/privacy" class="theme-link-muted">{{ t('footer.privacy') }}</router-link>
          <router-link to="/terms" class="theme-link-muted">{{ t('footer.terms') }}</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../stores/app'

interface FooterLink {
  name: string
  url: string
}

interface ContactLink {
  label: 'Telegram'
  href: string
}

const { t } = useI18n()
const appStore = useAppStore()

const config = computed(() => appStore.config)

const resolveLocalizedText = (value: unknown) => {
  if (typeof value === 'string') return value.trim()

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    const text = record[appStore.locale] || record['zh-CN'] || ''
    return typeof text === 'string' ? text.trim() : ''
  }

  return ''
}

const brandSiteName = computed(() => {
  const siteName = resolveLocalizedText(config.value?.brand?.site_name)
  return siteName || t('common.siteName')
})

const brandDescription = computed(() => resolveLocalizedText(config.value?.brand?.site_description))

const brandInitial = computed(() => brandSiteName.value.charAt(0).toUpperCase())

const footerLinks = computed<FooterLink[]>(() => {
  const links = config.value?.footer_links
  if (!Array.isArray(links)) return []

  return links
    .filter((item: any) => item && typeof item.name === 'string' && item.name.trim()
      && typeof item.url === 'string' && item.url.trim())
    .map((item: any) => ({
      name: item.name.trim(),
      url: item.url.trim(),
    }))
})

const contactLinks = computed<ContactLink[]>(() => {
  const items: ContactLink[] = []
  const telegram = typeof config.value?.contact?.telegram === 'string'
    ? config.value.contact.telegram.trim()
    : ''

  if (telegram) items.push({ label: 'Telegram', href: telegram })

  return items
})

const currentYear = new Date().getFullYear()
</script>
