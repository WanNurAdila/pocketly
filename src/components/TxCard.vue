<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Transaction } from '@/data'
import { CATEGORY_COLOR } from '@/data'

const props = defineProps<{ tx: Transaction }>()
const router = useRouter()

const colorKey = computed(() => CATEGORY_COLOR[props.tx.category] ?? 'butter')
const swatch   = computed(() => colorKey.value === 'ink' ? 'var(--ink)' : `var(--${colorKey.value})`)
const isIncome = computed(() => props.tx.amount > 0)

const cornerRadius = computed(() => {
  const k = colorKey.value
  if (k === 'coral')  return '50%'
  if (k === 'mint')   return '50% 50% 0 50%'
  if (k === 'sky')    return '50% 0 0 50%'
  if (k === 'lilac')  return '50% 50% 50% 0'
  return '8px'
})
</script>

<template>
  <a
    href="#"
    :data-testid="`tx-card-${tx.id}`"
    :data-tx-id="tx.id"
    style="display:flex;flex-direction:column;background:var(--paper-2);border:2px solid var(--ink);border-radius:18px;padding:16px;text-decoration:none;color:inherit;position:relative;min-height:168px;box-shadow:3px 3px 0 0 var(--ink);overflow:hidden;"
    @click.prevent="router.push(`/transaction/${tx.id}`)"
  >
    <!-- colour block decoration -->
    <div :style="{
      position: 'absolute', top: '-20px', right: '-20px',
      width: '70px', height: '70px',
      background: swatch,
      border: '2px solid var(--ink)',
      borderRadius: cornerRadius,
    }" />

    <div class="row" style="gap:8px;">
      <span :class="`chip chip-${colorKey === 'ink' ? 'ink' : colorKey}`"
        :data-testid="`tx-card-${tx.id}-category`">
        {{ tx.category }}
      </span>
    </div>

    <p style="margin-top:12px;font-family:var(--font-display);font-weight:700;font-size:18px;letter-spacing:-0.01em;line-height:1.15;"
      :data-testid="`tx-card-${tx.id}-merchant`"
      class="truncate">
      {{ tx.merchant }}
    </p>
    <p style="font-size:12px;color:var(--ink-mute);margin-top:2px;">{{ tx.method }}</p>

    <div style="margin-top:auto;">
      <div class="row-between" style="margin-top:14px;">
        <span style="font-family:var(--font-mono);font-size:11px;color:var(--ink-mute);"
          :data-testid="`tx-card-${tx.id}-date`">
          {{ tx.date }}
        </span>
        <span class="display" :style="{ fontSize: '22px', color: isIncome ? 'var(--good)' : 'var(--ink)' }"
          :data-testid="`tx-card-${tx.id}-amount`">
          {{ isIncome ? '+' : '−' }}${{ Math.abs(tx.amount).toFixed(2) }}
        </span>
      </div>
    </div>
  </a>
</template>
