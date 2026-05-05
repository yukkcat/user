<template>
  <div
    id="app"
    class="commerce-page min-h-screen theme-page flex flex-col"
    data-ui-theme="commerce-clear"
    :data-mode="theme"
  >
    <Navbar />
    <main class="flex-1 pb-14 lg:pb-0">
      <ErrorBoundary>
        <RouterView v-slot="{ Component }">
          <Transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </ErrorBoundary>
    </main>
    <Footer />
    <Loading :loading="appStore.loading" />
    <Toast />
    <ConfirmDialog />
    <BackToTop />
    <MobileBottomNav />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from './stores/app'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Loading from './components/Loading.vue'
import Toast from './components/Toast.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import BackToTop from './components/BackToTop.vue'
import MobileBottomNav from './components/MobileBottomNav.vue'
import { useTheme } from './utils/theme'

// config 由 router.beforeEach 统一加载，无需在此重复调用
const appStore = useAppStore()
const { theme } = useTheme()
</script>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 200ms ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
