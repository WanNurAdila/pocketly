<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import AppIcon from '@/components/AppIcon.vue'
import TxModal from '@/components/TxModal.vue'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import { useTransactionsStore } from '@/stores/transactions'
import { CATEGORY_COLOR } from '@/data'

const route  = useRoute()
const router = useRouter()
const store  = useTransactionsStore()

const txId = computed(() => route.params.id as string)
const tx   = computed(() => store.transactions.find(t => t.id === txId.value))

const colorKey = computed(() => (tx.value ? CATEGORY_COLOR[tx.value.category] : null) ?? 'butter')
const swatch   = computed(() => colorKey.value === 'ink' ? 'var(--ink)' : `var(--${colorKey.value})`)

const budgetCat = computed(() =>
  store.budgetCategories.find(c => c.label === tx.value?.category)
)
const budgetPct = computed(() =>
  budgetCat.value ? Math.min(100, Math.round((budgetCat.value.spent / budgetCat.value.budget) * 100)) : 0
)

const editOpen   = ref(false)
const deleteOpen = ref(false)
const isIncome   = computed(() => (tx.value?.amount ?? 0) > 0)

function onDeleted() {
  deleteOpen.value = false
  router.push('/transactions')
}

function friendlyDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}
</script>

<template>
  <!-- Not found -->
  <div v-if="!tx" style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px;">
    <div style="font-size:48px;">◌</div>
    <div style="font-family:var(--font-display);font-size:24px;font-weight:700;">Transaction not found</div>
    <button class="btn btn-sm" @click="router.push('/transactions')">← Back to list</button>
  </div>

  <div v-else data-testid="screen-detail" class="page" style="height:100vh;">
    <AppSidebar active="list" />

    <div class="main">
      <!-- Topbar -->
      <header class="topbar" data-testid="topbar">
        <div>
          <div class="label-xs" style="margin-bottom:4px;">
            <a href="#" data-testid="bc-list" style="color:var(--ink-mute);"
              @click.prevent="router.push('/transactions')">Transactions</a>
            {{ ' › ' }}
            <span class="mono" data-testid="bc-tx-id">{{ tx.id }}</span>
          </div>
          <div style="font-family:var(--font-display);font-size:26px;font-weight:700;letter-spacing:-0.02em;">
            {{ tx.merchant }}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <button class="btn btn-sm" data-testid="btn-back" @click="router.push('/transactions')">
            <AppIcon name="chevron-left" :size="14" /> Back
          </button>
          <button class="btn btn-sm" data-testid="btn-edit" @click="editOpen = true">
            <AppIcon name="pencil" :size="14" /> Edit
          </button>
          <button class="btn btn-sm btn-coral" data-testid="btn-delete" @click="deleteOpen = true">
            <AppIcon name="trash" :size="14" /> Delete
          </button>
        </div>
      </header>

      <div class="content" style="display:grid;grid-template-columns:1.5fr 1fr;gap:24px;overflow-y:auto;">

        <!-- ── Main detail card ── -->
        <div class="card" style="padding:28px;position:relative;overflow:hidden;" data-testid="detail-main">
          <div :style="{
            position: 'absolute', right: '-40px', top: '-40px',
            width: '220px', height: '220px', borderRadius: '50%',
            background: swatch, opacity: '0.55', pointerEvents: 'none',
          }" />
          <div style="position:absolute;right:60px;top:80px;width:50px;height:50px;background:var(--ink);pointer-events:none;" />

          <div style="position:relative;">
            <div class="row" style="gap:8px;margin-bottom:14px;">
              <span :class="`chip chip-${colorKey}`" data-testid="detail-category">
                <AppIcon name="tag" :size="12" /> {{ tx.category }}
              </span>
              <span class="chip" data-testid="detail-method">
                <AppIcon name="wallet" :size="12" /> {{ tx.method }}
              </span>
            </div>

            <div class="label-xs">Amount</div>
            <div class="display" style="font-size:72px;line-height:1;margin-top:4px;">
              <span class="mono" style="font-family:var(--font-display);" data-testid="detail-amount">
                {{ isIncome ? '+' : '−' }}${{ Math.abs(tx.amount).toFixed(2) }}
              </span>
            </div>
            <div style="margin-top:8px;font-size:13px;color:var(--ink-mute);" data-testid="detail-date">
              {{ friendlyDate(tx.date) }}
            </div>

            <div style="margin-top:30px;display:grid;grid-template-columns:1fr 1fr;gap:20px;">
              <div>
                <div class="label-xs">Merchant</div>
                <div style="font-weight:600;font-size:16px;margin-top:4px;" data-testid="detail-merchant">{{ tx.merchant }}</div>
                <div style="font-size:12px;color:var(--ink-mute);margin-top:2px;">{{ tx.method }}</div>
              </div>
              <div>
                <div class="label-xs">Tags</div>
                <div class="row" style="gap:6px;margin-top:6px;flex-wrap:wrap;" data-testid="detail-tags">
                  <span v-for="t in tx.tags" :key="t" class="chip" style="background:var(--butter);">#{{ t }}</span>
                  <span v-if="tx.tags.length === 0" style="color:var(--ink-mute);font-size:13px;">—</span>
                </div>
              </div>
            </div>

            <div style="margin-top:26px;" v-if="tx.note">
              <div class="label-xs">Note</div>
              <div style="margin-top:8px;padding:14px;background:var(--cream);border:1.5px solid var(--ink);border-radius:10px;font-size:14px;"
                data-testid="detail-note">
                {{ tx.note }}
              </div>
            </div>
          </div>
        </div>

        <!-- ── Right column ── -->
        <div class="col" style="gap:20px;">

          <!-- Budget impact -->
          <div v-if="budgetCat" class="card" style="padding:20px;" data-testid="card-budget-impact">
            <div class="label-xs">Budget impact · {{ budgetCat.label }}</div>
            <div style="margin-top:12px;">
              <div class="row-between" style="margin-bottom:6px;">
                <span class="mono" style="font-size:12px;">${{ budgetCat.spent }} / ${{ budgetCat.budget }}</span>
                <span class="mono" style="font-size:12px;color:var(--ink-mute);">{{ budgetPct }}%</span>
              </div>
              <div class="progress">
                <span class="progress-fill" :style="{
                  width: budgetPct + '%',
                  background: budgetCat.color === 'ink' ? 'var(--ink)' : `var(--${budgetCat.color}-deep)`,
                }" />
              </div>
            </div>
            <div style="font-size:12px;color:var(--ink-mute);margin-top:10px;">
              ${{ budgetCat.budget - budgetCat.spent }} remaining for May
            </div>
          </div>

          <!-- Receipt placeholder -->
          <div class="card" style="padding:20px;" data-testid="card-receipt">
            <div class="row-between">
              <div class="label-xs">Receipt</div>
              <button class="btn btn-sm btn-ghost" data-testid="btn-upload-receipt">
                <AppIcon name="plus" :size="12" /> Attach
              </button>
            </div>
            <div style="margin-top:12px;height:110px;border:1.5px dashed var(--ink);border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--ink-mute);font-size:13px;background:repeating-linear-gradient(45deg,transparent 0 6px,rgba(22,20,15,0.04) 6px 12px);">
              No receipt attached
            </div>
          </div>

          <!-- Activity log -->
          <div class="card" style="padding:20px;" data-testid="card-activity">
            <div class="label-xs">Activity</div>
            <div style="margin-top:12px;display:flex;flex-direction:column;gap:10px;">
              <div class="row" style="gap:10px;font-size:13px;">
                <div style="width:8px;height:8px;border-radius:50%;background:var(--mint-deep);flex-shrink:0;" />
                Created · {{ tx.date }}
              </div>
              <div class="row" style="gap:10px;font-size:13px;">
                <div style="width:8px;height:8px;border-radius:50%;background:var(--sky-deep);flex-shrink:0;" />
                Categorized as <strong>{{ tx.category }}</strong>
              </div>
              <div v-if="tx.tags.length" class="row" style="gap:10px;font-size:13px;">
                <div style="width:8px;height:8px;border-radius:50%;background:var(--butter-deep);flex-shrink:0;" />
                Tagged <span class="mono">#{{ tx.tags[0] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TxModal :open="editOpen" mode="edit" :tx-id="txId" @close="editOpen = false" />
    <DeleteConfirmModal :open="deleteOpen" :tx-id="txId" @close="deleteOpen = false" @deleted="onDeleted" />
  </div>
</template>
