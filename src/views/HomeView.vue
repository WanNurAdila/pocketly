<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'
import AppIcon from '@/components/AppIcon.vue'
import TxModal from '@/components/TxModal.vue'
import { useTransactionsStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'

const router    = useRouter()
const store     = useTransactionsStore()
const authStore = useAuthStore()
const modalOpen = ref(false)

const pct = computed(() =>
  Math.min(100, Math.round((store.totalSpent / store.totalBudget) * 100))
)

const incomeCount = computed(() => store.transactions.filter(t => t.amount > 0).length)
const expenseCount = computed(() => store.transactions.filter(t => t.amount < 0).length)

function shapeForCategory(id: string) {
  if (id === 'food')   return '50%'
  if (id === 'transp') return '50% 0 50% 0'
  if (id === 'subs')   return '50% 50% 0 0'
  return '4px'
}
</script>

<template>
  <div data-testid="screen-home" class="page">
    <AppSidebar active="home" />

    <div class="main">
      <AppTopbar
        :title="`Hello, ${authStore.displayName}.`"
        subtitle="Here's where your money is sitting in May."
      >
        <button class="btn btn-sm btn-coral" data-testid="btn-add-tx" @click="modalOpen = true">
          <AppIcon name="plus" :size="14" :stroke="2.5" /> New transaction
        </button>
      </AppTopbar>

      <div class="content">
        <!-- ── Hero summary band ── -->
        <div class="home-hero-grid">

          <!-- Overall budget card -->
          <div class="card" style="padding:24px;position:relative;overflow:hidden;" data-testid="card-month-summary">
            <div style="position:absolute;right:-50px;top:-50px;width:200px;height:200px;border-radius:50%;background:var(--coral);opacity:0.5;pointer-events:none;" />
            <div style="position:absolute;right:30px;bottom:-30px;width:90px;height:90px;background:var(--mint);border:2px solid var(--ink);pointer-events:none;" />
            <div style="position:relative;">
              <p class="label-xs">Budget · May 2026</p>
              <p class="display" style="font-size:56px;margin-top:8px;">
                <span class="mono" style="font-family:var(--font-display);">${{ Math.round(store.totalSpent).toLocaleString() }}</span>
                <span style="color:var(--ink-mute);font-size:22px;font-weight:500;"> &nbsp;/ ${{ store.totalBudget.toLocaleString() }}</span>
              </p>
              <div style="margin-top:16px;max-width:380px;">
                <div class="progress" data-testid="progress-overall">
                  <span class="progress-fill" :style="{ width: pct + '%', background: 'var(--ink)' }" />
                </div>
                <div class="row-between" style="margin-top:8px;">
                  <span class="mono" style="font-size:12px;">{{ pct }}% used</span>
                  <span class="mono" style="font-size:12px;color:var(--ink-mute);">13 days left</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Income card -->
          <div class="card" style="padding:20px;background:var(--mint);" data-testid="card-income">
            <div class="row-between">
              <p class="label-xs">Income · May</p>
              <AppIcon name="arrow-down-left" :size="18" />
            </div>
            <p class="display" style="font-size:36px;margin-top:10px;">
              <span class="mono" style="font-family:var(--font-display);">
                ${{ store.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
              </span>
            </p>
            <p style="font-size:12px;color:var(--ink-soft);margin-top:4px;">
              {{ incomeCount }} deposit{{ incomeCount === 1 ? '' : 's' }}
            </p>
          </div>

          <!-- Spending card -->
          <div class="card" style="padding:20px;background:var(--coral);" data-testid="card-spending">
            <div class="row-between">
              <p class="label-xs">Spending · May</p>
              <AppIcon name="arrow-up-right" :size="18" />
            </div>
            <p class="display" style="font-size:36px;margin-top:10px;">
              <span class="mono" style="font-family:var(--font-display);">
                ${{ Math.round(store.totalExpense).toLocaleString() }}
              </span>
            </p>
            <p style="font-size:12px;color:var(--ink-soft);margin-top:4px;">
              across {{ expenseCount }} transactions
            </p>
          </div>
        </div>

        <!-- ── Category progress bars ── -->
        <div class="row-between" style="margin-bottom:14px;">
          <div>
            <p class="label-xs">Categories</p>
            <h2 style="font-family:var(--font-display);font-weight:700;font-size:22px;">Budget progress</h2>
          </div>
          <button class="btn btn-sm" data-testid="btn-view-all-cats" @click="router.push('/transactions')">
            View all <AppIcon name="arrow-up-right" :size="14" />
          </button>
        </div>

        <div class="card" style="padding:8px;">
          <div class="home-cat-grid">
            <div
              v-for="(c, i) in store.budgetCategories"
              :key="c.id"
              :data-testid="`bp-${c.id}`"
              :style="{
                padding: '16px 20px',
                borderBottom: i < store.budgetCategories.length - 2 ? '1.5px solid rgba(22,20,15,0.12)' : 'none',
                borderRight: i % 2 === 0 ? '1.5px solid rgba(22,20,15,0.12)' : 'none',
              }"
            >
              <div class="row-between" style="margin-bottom:10px;">
                <div class="row" style="gap:10px;">
                  <div :style="{
                    width: '22px', height: '22px',
                    background: c.color === 'ink' ? 'var(--ink)' : `var(--${c.color})`,
                    border: '2px solid var(--ink)',
                    borderRadius: shapeForCategory(c.id),
                  }" />
                  <p style="font-weight:600;font-size:14px;">{{ c.label }}</p>
                </div>
                <p class="mono" style="font-size:12px;color:var(--ink-mute);"
                  :data-testid="`bp-${c.id}-amount`">
                  ${{ c.spent }} / ${{ c.budget }}
                </p>
              </div>
              <div class="progress">
                <span class="progress-fill" :style="{
                  width: Math.min(100, Math.round((c.spent / c.budget) * 100)) + '%',
                  background: c.spent > c.budget ? 'var(--bad)' : (c.color === 'ink' ? 'var(--ink)' : `var(--${c.color})`),
                }" />
              </div>
              <div class="row-between" style="margin-top:6px;">
                <span class="mono" style="font-size:11px;color:var(--ink-mute);">
                  {{ Math.min(100, Math.round((c.spent / c.budget) * 100)) }}%
                </span>
                <span class="mono" :style="{ fontSize: '11px', color: c.spent > c.budget ? 'var(--bad)' : 'var(--ink-mute)' }">
                  {{ c.spent > c.budget ? 'over budget' : `$${c.budget - c.spent} left` }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TxModal :open="modalOpen" mode="create" @close="modalOpen = false" />
  </div>
</template>
