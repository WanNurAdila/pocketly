<script setup lang="ts">
import AppIcon from './AppIcon.vue'

defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <header class="topbar" data-testid="topbar">
    <div style="min-width:0;">
      <slot name="breadcrumbs" />
      <h1 style="font-family:var(--font-display);font-size:26px;font-weight:700;letter-spacing:-0.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
        {{ title }}
      </h1>
      <p v-if="subtitle" style="color:var(--ink-mute);font-size:13px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ subtitle }}</p>
    </div>
    <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
      <slot />
      <button class="btn btn-icon topbar-icon-btn" data-testid="btn-search" aria-label="Search" disabled style="opacity:0.3;cursor:not-allowed;">
        <AppIcon name="search" />
      </button>
      <button class="btn btn-icon topbar-icon-btn" data-testid="btn-notifications" aria-label="Notifications" disabled style="opacity:0.3;cursor:not-allowed;">
        <AppIcon name="bell" />
      </button>
      <div class="avatar" data-testid="user-avatar">JM</div>
    </div>
  </header>
</template>
