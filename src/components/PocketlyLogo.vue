<script setup lang="ts">
const props = withDefaults(defineProps<{ size?: number; dark?: boolean }>(), { size: 28, dark: false })
const stroke = () => props.dark ? 'var(--paper)' : 'var(--ink)'
const fill   = () => props.dark ? 'var(--paper)' : 'var(--ink)'
</script>

<template>
  <div style="display:inline-flex;align-items:center;gap:10px;">
    <!-- SVG mark: coral circle + right half-disc fill, matching brand/app-icon-dark.svg -->
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="13" fill="var(--coral)" :stroke="stroke()" stroke-width="2"/>
      <!-- Right half-disc: from (16,7) → arc to (16,25), fill inward -->
      <path d="M 16 7 L 21.5 7 A 8.5 8.5 0 0 1 21.5 25 L 16 25 Z" :fill="fill()"/>
    </svg>
    <div :style="{
      fontFamily: 'var(--font-display)',
      fontSize: size * 0.78 + 'px',
      fontWeight: '700',
      letterSpacing: '-0.02em',
      color: fill(),
    }">Pocketly</div>
  </div>
</template>
