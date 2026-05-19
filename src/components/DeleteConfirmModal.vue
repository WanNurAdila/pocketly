<script setup lang="ts">
import { ref, computed } from 'vue'
import AppIcon from './AppIcon.vue'
import { useTransactionsStore } from '@/stores/transactions'

const props = defineProps<{
  open: boolean
  txId: string
}>()

const emit = defineEmits<{
  close: []
  deleted: []
}>()

const store     = useTransactionsStore()
const confirmed = ref(false)

const tx = computed(() => store.transactions.find(t => t.id === props.txId))

function handleDelete() {
  if (!confirmed.value || !tx.value) return
  store.remove(props.txId)
  confirmed.value = false
  emit('deleted')
}

function handleClose() {
  confirmed.value = false
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open && tx" class="scrim" data-testid="confirm-scrim" @click.self="handleClose">
      <div
        class="modal"
        data-testid="modal-delete-confirm"
        role="alertdialog"
        aria-labelledby="confirm-title"
        style="max-width:460px;padding:28px;text-align:left;"
      >
        <!-- Corner decoration — red warning circle -->
        <div style="position:absolute;top:-14px;left:-14px;width:36px;height:36px;background:var(--bad);border:2px solid var(--ink);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--paper);">
          <AppIcon name="trash" :size="16" :stroke="2.4" />
        </div>

        <div class="label-xs" style="color:var(--bad);" data-testid="confirm-eyebrow">
          Destructive action
        </div>
        <div id="confirm-title" class="display" style="font-size:26px;margin-top:6px;line-height:1.1;"
          data-testid="confirm-title">
          Delete this transaction?
        </div>
        <div style="margin-top:10px;font-size:14px;color:var(--ink-soft);line-height:1.55;"
          data-testid="confirm-body">
          You're about to permanently delete <strong>{{ tx.merchant }}</strong>
          (<span class="mono">{{ tx.amount < 0 ? '−' : '+' }}${{ Math.abs(tx.amount).toFixed(2) }}</span>)
          from {{ tx.date }}. This can't be undone.
        </div>

        <!-- Transaction preview row -->
        <div style="margin-top:18px;padding:12px 14px;background:var(--cream);border:1.5px solid var(--ink);border-radius:10px;display:flex;align-items:center;gap:12px;"
          data-testid="confirm-preview">
          <div style="width:30px;height:30px;background:var(--coral);border:2px solid var(--ink);border-radius:6px;flex-shrink:0;" />
          <div style="flex:1;min-width:0;">
            <div class="truncate" style="font-weight:600;font-size:14px;">{{ tx.merchant }}</div>
            <div class="mono" style="font-size:11px;color:var(--ink-mute);">{{ tx.id }} · {{ tx.date }}</div>
          </div>
          <div class="display" style="font-size:18px;flex-shrink:0;">
            <span class="mono" style="font-family:var(--font-display);">
              {{ tx.amount < 0 ? '−' : '+' }}${{ Math.abs(tx.amount).toFixed(2) }}
            </span>
          </div>
        </div>

        <!-- Acknowledgement checkbox -->
        <label style="margin-top:16px;display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-soft);cursor:pointer;"
          data-testid="confirm-acknowledge">
          <input
            v-model="confirmed"
            type="checkbox"
            style="width:16px;height:16px;accent-color:var(--bad);"
            data-testid="checkbox-confirm-understood"
          />
          I understand this can't be undone.
        </label>

        <div class="row-between" style="margin-top:22px;">
          <button type="button" class="btn btn-sm" data-testid="btn-confirm-cancel" @click="handleClose">
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-sm"
            data-testid="btn-confirm-delete"
            :disabled="!confirmed"
            :style="{
              background: confirmed ? 'var(--bad)' : 'var(--cream)',
              color: confirmed ? 'var(--paper)' : 'var(--ink-mute)',
              borderColor: 'var(--ink)',
              opacity: confirmed ? 1 : 0.6,
              cursor: confirmed ? 'pointer' : 'not-allowed',
            }"
            @click="handleDelete"
          >
            <AppIcon name="trash" :size="13" :stroke="2.5" /> Yes, delete it
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
