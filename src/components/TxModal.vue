<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import { useTransactionsStore } from '@/stores/transactions'
import { ALL_CATEGORY_LABELS } from '@/data'
import type { Transaction } from '@/data'

const props = defineProps<{
  open: boolean
  mode: 'create' | 'edit'
  txId?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const store = useTransactionsStore()

const tx = computed(() =>
  props.mode === 'edit' && props.txId
    ? store.transactions.find(t => t.id === props.txId)
    : undefined
)

// Form state
const txType    = ref<'expense' | 'income'>('expense')
const merchant  = ref('')
const amount    = ref('')
const category  = ref('Groceries')
const date      = ref(new Date().toISOString().slice(0, 10))
const note      = ref('')
const tagInput  = ref('')
const tags      = ref<string[]>([])

// Populate when editing
watch(() => [props.open, props.txId] as const, () => {
  if (props.open && props.mode === 'edit' && tx.value) {
    const t = tx.value
    txType.value   = t.type
    merchant.value = t.merchant
    amount.value   = Math.abs(t.amount).toFixed(2)
    category.value = t.category
    date.value     = t.date
    note.value     = t.note
    tags.value     = [...t.tags]
  } else if (props.open && props.mode === 'create') {
    txType.value   = 'expense'
    merchant.value = ''
    amount.value   = ''
    category.value = 'Groceries'
    date.value     = new Date().toISOString().slice(0, 10)
    note.value     = ''
    tags.value     = []
    tagInput.value = ''
  }
}, { immediate: true })

function addTag() {
  const t = tagInput.value.trim().replace(/^#/, '')
  if (t && !tags.value.includes(t)) tags.value.push(t)
  tagInput.value = ''
}
function removeTag(t: string) { tags.value = tags.value.filter(x => x !== t) }

function handleTagKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') { e.preventDefault(); addTag() }
}

function save() {
  const numAmount = parseFloat(amount.value) || 0
  const signed    = txType.value === 'expense' ? -Math.abs(numAmount) : Math.abs(numAmount)
  const data: Omit<Transaction, 'id'> = {
    date:     date.value,
    merchant: merchant.value || 'Unknown',
    category: category.value,
    amount:   signed,
    type:     txType.value,
    note:     note.value,
    method:   'Visa •• 4821',
    tags:     tags.value,
  }
  if (props.mode === 'edit' && props.txId) {
    store.update(props.txId, data)
  } else {
    store.add(data)
  }
  emit('close')
}

function deleteTx() {
  if (props.txId) { store.remove(props.txId); emit('close') }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="scrim" data-testid="modal-scrim" @click.self="emit('close')">
      <div class="modal" data-testid="modal-tx" role="dialog" :aria-labelledby="'modal-title'">
        <!-- corner decorations -->
        <div style="position:absolute;top:-12px;left:-12px;width:28px;height:28px;background:var(--coral);border:2px solid var(--ink);border-radius:50%;" />
        <div style="position:absolute;top:-10px;right:36px;width:50px;height:14px;background:var(--butter);border:2px solid var(--ink);border-radius:999px;" />

        <!-- Header -->
        <div class="row-between" style="margin-bottom:18px;">
          <div>
            <div class="label-xs" data-testid="modal-eyebrow">
              {{ mode === 'edit' ? 'Edit transaction' : 'New transaction' }}
            </div>
            <div id="modal-title" class="display" style="font-size:28px;margin-top:4px;" data-testid="modal-title">
              {{ mode === 'edit' ? `Edit · ${txId}` : 'Log an expense' }}
            </div>
          </div>
          <button class="btn btn-icon btn-ghost" data-testid="btn-close-modal" aria-label="Close" @click="emit('close')">
            <AppIcon name="x" :size="18" :stroke="2.2" />
          </button>
        </div>

        <!-- Type segmented control -->
        <div style="display:grid;grid-template-columns:1fr 1fr;border:2px solid var(--ink);border-radius:12px;padding:4px;gap:4px;background:var(--cream);margin-bottom:16px;"
          data-testid="seg-type">
          <button data-testid="seg-expense" type="button"
            :style="{
              height: '36px', borderRadius: '8px', border: 'none',
              background: txType === 'expense' ? 'var(--ink)' : 'transparent',
              color: txType === 'expense' ? 'var(--paper)' : 'var(--ink)',
              fontWeight: '600', fontSize: '13px', cursor: 'pointer',
            }"
            @click="txType = 'expense'">Expense</button>
          <button data-testid="seg-income" type="button"
            :style="{
              height: '36px', borderRadius: '8px', border: 'none',
              background: txType === 'income' ? 'var(--ink)' : 'transparent',
              color: txType === 'income' ? 'var(--paper)' : 'var(--ink)',
              fontWeight: '600', fontSize: '13px', cursor: 'pointer',
            }"
            @click="txType = 'income'">Income</button>
        </div>

        <form data-testid="form-tx" style="display:flex;flex-direction:column;gap:14px;" @submit.prevent="save">
          <div style="display:grid;grid-template-columns:1fr 140px;gap:12px;">
            <div class="field">
              <label for="modal-merchant">Merchant</label>
              <input id="modal-merchant" v-model="merchant" class="input"
                data-testid="input-merchant" placeholder="Where did the money go?" />
            </div>
            <div class="field">
              <label for="modal-amount">Amount</label>
              <div style="position:relative;">
                <span style="position:absolute;left:14px;top:0;bottom:0;display:flex;align-items:center;color:var(--ink-mute);font-family:var(--font-mono);">$</span>
                <input id="modal-amount" v-model="amount" class="input mono"
                  type="number" step="0.01" min="0"
                  data-testid="input-amount"
                  style="padding-left:28px;" placeholder="0.00" />
              </div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="field">
              <label for="modal-category">Category</label>
              <select id="modal-category" v-model="category" class="input" data-testid="select-category">
                <option v-for="c in ALL_CATEGORY_LABELS" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div class="field">
              <label for="modal-date">Date</label>
              <input id="modal-date" v-model="date" type="date" class="input mono" data-testid="input-date" />
            </div>
          </div>

          <div class="field">
            <label for="modal-note">Note</label>
            <textarea id="modal-note" v-model="note" class="input" rows="2"
              data-testid="input-note" placeholder="Optional note"
              style="height:72px;" />
          </div>

          <div class="field">
            <label>Tags</label>
            <div class="row" style="gap:6px;flex-wrap:wrap;" data-testid="tags">
              <span v-for="t in tags" :key="t" class="chip" style="background:var(--butter);cursor:pointer;" @click="removeTag(t)">
                #{{ t }} <AppIcon name="x" :size="10" :stroke="2.5" />
              </span>
              <input v-model="tagInput"
                data-testid="input-tag"
                placeholder="add a tag…"
                style="border:none;outline:none;background:transparent;font-family:var(--font-mono);font-size:12px;color:var(--ink-soft);min-width:80px;"
                @keydown="handleTagKeydown"
                @blur="addTag"
              />
            </div>
          </div>

          <div class="row-between" style="margin-top:6px;">
            <button v-if="mode === 'edit'" type="button" class="btn btn-sm"
              data-testid="btn-delete-modal"
              style="color:var(--bad);border-color:var(--bad);box-shadow:2px 2px 0 var(--bad);"
              @click="deleteTx">
              <AppIcon name="trash" :size="13" /> Delete
            </button>
            <span v-else />
            <div class="row" style="gap:10px;">
              <button type="button" class="btn btn-sm" data-testid="btn-cancel" @click="emit('close')">Cancel</button>
              <button type="submit" class="btn btn-sm btn-primary" data-testid="btn-save">
                <AppIcon name="check" :size="14" :stroke="2.5" />
                {{ mode === 'edit' ? 'Save changes' : 'Add transaction' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
