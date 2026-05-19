<script setup lang="ts">
withDefaults(defineProps<{ name: string; size?: number; stroke?: number }>(), { size: 18, stroke: 2 })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" :stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round">
    <template v-if="name === 'home'"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></template>
    <template v-else-if="name === 'list'"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></template>
    <template v-else-if="name === 'chart'"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></template>
    <template v-else-if="name === 'cog'"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4.9a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.5a7 7 0 0 0-2 1.2l-2.4-.9-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-.9a7 7 0 0 0 2 1.2L10 21h4l.5-2.5a7 7 0 0 0 2-1.2l2.4.9 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z"/></template>
    <template v-else-if="name === 'plus'"><path d="M12 5v14M5 12h14"/></template>
    <template v-else-if="name === 'search'"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></template>
    <template v-else-if="name === 'bell'"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></template>
    <template v-else-if="name === 'arrow-down-left'"><path d="M17 7L7 17M17 17H7V7"/></template>
    <template v-else-if="name === 'arrow-up-right'"><path d="M7 17L17 7M7 7h10v10"/></template>
    <template v-else-if="name === 'pencil'"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></template>
    <template v-else-if="name === 'trash'"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></template>
    <template v-else-if="name === 'check'"><path d="M5 12l5 5L20 7"/></template>
    <template v-else-if="name === 'x'"><path d="M6 6l12 12M18 6L6 18"/></template>
    <template v-else-if="name === 'chevron-left'"><path d="M15 18l-6-6 6-6"/></template>
    <template v-else-if="name === 'eye'"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></template>
    <template v-else-if="name === 'eye-off'"><path d="M17.94 17.94A10 10 0 0 1 12 19c-7 0-11-7-11-7a18 18 0 0 1 5.06-5.94"/><path d="M9.9 4.24A10 10 0 0 1 12 4c7 0 11 7 11 7a18 18 0 0 1-3.16 4.19"/><path d="M1 1l22 22"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></template>
    <template v-else-if="name === 'tag'"><path d="M20 12l-8 8a2 2 0 0 1-3 0l-7-7V5a2 2 0 0 1 2-2h8z"/><circle cx="7.5" cy="7.5" r="1"/></template>
    <template v-else-if="name === 'wallet'"><path d="M21 12V8a2 2 0 0 0-2-2H5a2 2 0 0 1 0-4h13v4"/><path d="M3 6v12a2 2 0 0 0 2 2h16v-4"/><circle cx="18" cy="14" r="1.5"/></template>
    <template v-else-if="name === 'download'"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></template>
    <template v-else-if="name === 'calendar'"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></template>
    <template v-else-if="name === 'filter'"><path d="M3 6h18M6 12h12M10 18h4"/></template>
    <template v-else-if="name === 'dots'"><circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></template>
  </svg>
</template>
