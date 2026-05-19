<script setup lang="ts">
import { useRouter } from 'vue-router'
import PocketlyLogo from './PocketlyLogo.vue'
import AppIcon from './AppIcon.vue'
import { useAuthStore } from '@/stores/auth'
import { useTransactionsStore } from '@/stores/transactions'
import { computed } from 'vue'

withDefaults(defineProps<{ active?: string }>(), { active: 'home' })

const router  = useRouter()
const auth    = useAuthStore()
const txStore = useTransactionsStore()

const items = [
  { id: 'home',     label: 'Dashboard',    icon: 'home',  route: '/home',         disabled: false },
  { id: 'list',     label: 'Transactions', icon: 'list',  route: '/transactions', disabled: false },
  { id: 'reports',  label: 'Reports',      icon: 'chart', route: '/home',         disabled: true  },
  { id: 'settings', label: 'Settings',     icon: 'cog',   route: '/home',         disabled: true  },
]

const balance = computed(() => {
  const net = txStore.totalIncome - txStore.totalExpense
  return net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})
const [balWhole, balCents] = computed(() => balance.value.split('.')).value ?? ['0', '00']

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="sidebar" data-testid="sidebar">
    <!-- decorative half-disc -->
    <div style="position:absolute;right:-60px;top:-60px;width:160px;height:160px;border-radius:50%;background:var(--coral);opacity:0.35;pointer-events:none;" />

    <div style="position:relative;z-index:1;">
      <PocketlyLogo :size="26" :dark="true" />
    </div>

    <nav style="position:relative;z-index:1;">
      <a
        v-for="item in items"
        :key="item.id"
        href="#"
        :class="{ active: active === item.id, disabled: item.disabled }"
        :data-testid="`nav-${item.id}`"
        :aria-disabled="item.disabled || undefined"
        @click.prevent="!item.disabled && router.push(item.route)"
      >
        <AppIcon :name="item.icon" :size="16" />
        {{ item.label }}
      </a>
    </nav>

    <div style="margin-top:auto;position:relative;z-index:1;display:flex;flex-direction:column;gap:12px;">
      <!-- Balance card -->
      <div style="padding:16px;border-radius:16px;background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.15);">
        <div class="label-xs" style="color:var(--paper);opacity:0.6;">May balance</div>
        <div style="font-family:var(--font-display);font-size:26px;margin-top:4px;">
          ${{ balWhole }}.<span style="opacity:0.6;">{{ balCents }}</span>
        </div>
        <div style="font-family:var(--font-mono);font-size:11px;opacity:0.7;margin-top:2px;">
          {{ txStore.transactions.length }} transactions
        </div>
      </div>

      <!-- Logout -->
      <button
        class="btn btn-ghost"
        style="color:var(--paper);opacity:0.6;justify-content:flex-start;padding:0 4px;"
        data-testid="btn-logout"
        @click="handleLogout"
      >Sign out</button>
    </div>
  </aside>
</template>
