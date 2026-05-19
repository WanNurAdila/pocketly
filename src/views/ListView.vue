<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'
import AppIcon from '@/components/AppIcon.vue'
import TxCard from '@/components/TxCard.vue'
import TxModal from '@/components/TxModal.vue'
import { useTransactionsStore } from '@/stores/transactions'
import { ALL_CATEGORIES, moneyAbs } from '@/data'
import { exportStatement } from '@/utils/exportStatement'

const store = useTransactionsStore()
const modalOpen  = ref(false)
const searchQuery = ref('')
const typeFilter = ref<'all' | 'expense' | 'income'>('all')

// ── Category filter ────────────────────────────────────────────────────────
const catDropdownOpen    = ref(false)
const selectedCategories = ref<string[]>([])

function toggleCategory(label: string) {
  const i = selectedCategories.value.indexOf(label)
  if (i >= 0) selectedCategories.value.splice(i, 1)
  else         selectedCategories.value.push(label)
}
function clearCategories() { selectedCategories.value = [] }
function applyCategories() { catDropdownOpen.value = false }

// ── Date filter ────────────────────────────────────────────────────────────
const dateDropdownOpen = ref(false)
const calYear          = ref(2026)
const calMonth         = ref(4)   // 0-indexed; 4 = May
const rangeStart       = ref<string | null>(null)   // ISO date '2026-05-01'
const rangeEnd         = ref<string | null>(null)
const activePreset     = ref<string | null>(null)

const monthNames = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December']

const calGrid = computed(() => {
  const firstDay = new Date(calYear.value, calMonth.value, 1).getDay()
  const daysInMonth = new Date(calYear.value, calMonth.value + 1, 0).getDate()
  const cells: (number | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
})

function prevMonth() {
  if (calMonth.value === 0) { calMonth.value = 11; calYear.value-- }
  else calMonth.value--
}
function nextMonth() {
  if (calMonth.value === 11) { calMonth.value = 0; calYear.value++ }
  else calMonth.value++
}

function isoDay(d: number) {
  return `${calYear.value}-${String(calMonth.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function selectDay(d: number) {
  const iso = isoDay(d)
  if (rangeStart.value === null || rangeEnd.value !== null) {
    rangeStart.value   = iso
    rangeEnd.value     = null
    activePreset.value = null
  } else {
    if (iso < rangeStart.value) { rangeEnd.value = rangeStart.value; rangeStart.value = iso }
    else                         rangeEnd.value = iso
  }
}

const DATE_PRESETS: { id: string; label: string }[] = [
  { id: '7d',    label: 'Last 7 days'  },
  { id: '30d',   label: 'Last 30 days' },
  { id: 'month', label: 'This month'   },
  { id: 'ytd',   label: 'YTD'          },
]

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function applyPreset(preset: string) {
  activePreset.value = preset
  const today = new Date()
  calYear.value  = today.getFullYear()
  calMonth.value = today.getMonth()
  rangeEnd.value = toISO(today)
  if (preset === '7d') {
    const s = new Date(today); s.setDate(today.getDate() - 6)
    rangeStart.value = toISO(s)
  }
  if (preset === '30d') {
    const s = new Date(today); s.setDate(today.getDate() - 29)
    rangeStart.value = toISO(s)
  }
  if (preset === 'month') {
    rangeStart.value = `${calYear.value}-${String(calMonth.value + 1).padStart(2, '0')}-01`
  }
  if (preset === 'ytd') {
    rangeStart.value = `${calYear.value}-01-01`
  }
}

function clearDate() {
  rangeStart.value = null; rangeEnd.value = null; activePreset.value = null
}
function applyDate() { dateDropdownOpen.value = false }

function dayClass(d: number) {
  const iso = isoDay(d)
  const s = rangeStart.value, e = rangeEnd.value
  if (iso === s || iso === e) return 'cal-day--edge'
  if (s && e && iso > s && iso < e) return 'cal-day--range'
  return ''
}

function parseISO(iso: string) {
  const [y, m, d] = iso.split('-')
  return { year: y, month: monthNames[parseInt(m) - 1] ?? '', day: parseInt(d) }
}

const rangeFromLabel = computed(() => {
  if (!rangeStart.value) return '—'
  const { month, day, year } = parseISO(rangeStart.value)
  return `${month} ${day}, ${year}`
})
const rangeToLabel = computed(() => {
  if (!rangeEnd.value) return '—'
  const { month, day, year } = parseISO(rangeEnd.value)
  return `${month} ${day}, ${year}`
})

const hasDateFilter   = computed(() => rangeStart.value !== null)
const hasCatFilter    = computed(() => selectedCategories.value.length > 0)
const dateFilterLabel = computed(() => {
  if (!hasDateFilter.value) return 'Date'
  if (activePreset.value === '7d')  return 'Last 7 days'
  if (activePreset.value === '30d') return 'Last 30 days'
  if (activePreset.value === 'month') return 'This month'
  if (activePreset.value === 'ytd')   return 'YTD'
  const mon = (monthNames[calMonth.value] ?? '').slice(0, 3)
  return rangeEnd.value
    ? `${mon} ${rangeStart.value}–${rangeEnd.value}`
    : `${mon} ${rangeStart.value}`
})

// Close dropdowns on outside click
function handleOutsideClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('[data-dropdown]')) {
    catDropdownOpen.value  = false
    dateDropdownOpen.value = false
  }
}
onMounted(()    => document.addEventListener('click', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick))

// ── Filtered list ──────────────────────────────────────────────────────────
const filtered = computed(() => {
  let list = store.transactions
  if (typeFilter.value === 'expense') list = list.filter(t => t.amount < 0)
  if (typeFilter.value === 'income')  list = list.filter(t => t.amount > 0)
  if (hasCatFilter.value)
    list = list.filter(t => selectedCategories.value.includes(t.category))
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(t =>
      t.merchant.toLowerCase().includes(q) ||
      t.note.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    )
  }
  return list
})

const totalSpent  = computed(() =>
  store.transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
)
const expenseCount = computed(() => store.transactions.filter(t => t.amount < 0).length)
const incomeCount  = computed(() => store.transactions.filter(t => t.amount > 0).length)
</script>

<template>
  <div data-testid="screen-list" class="page" style="height:100vh;">
    <AppSidebar active="list" />

    <div class="main">
      <AppTopbar
        title="Transactions"
        :subtitle="`${store.transactions.length} entries · ${moneyAbs(totalSpent)} spent this month`"
      >
        <button class="btn btn-sm btn-coral" data-testid="btn-create-tx" @click="modalOpen = true">
          <AppIcon name="plus" :size="14" :stroke="2.5" /> Add transaction
        </button>
      </AppTopbar>

      <div class="content" style="overflow-y:auto;">
        <!-- ── Filter bar ── -->
        <div class="row" style="gap:10px;margin-bottom:22px;flex-wrap:wrap;" data-testid="filter-bar">

          <!-- Search -->
          <div style="position:relative;flex:0 0 300px;">
            <div style="position:absolute;left:14px;top:0;bottom:0;display:flex;align-items:center;color:var(--ink-mute);">
              <AppIcon name="search" :size="16" />
            </div>
            <input v-model="searchQuery" class="input" type="text"
              placeholder="Search…"
              style="width:100%;padding-left:40px;height:44px;"
              data-testid="input-search" />
          </div>

          <!-- Type filters -->
          <button class="btn btn-sm" data-testid="filter-all"
            :style="typeFilter === 'all' ? 'background:var(--ink);color:var(--paper);' : ''"
            @click="typeFilter = 'all'">
            All <span class="mono" style="opacity:0.7;">· {{ store.transactions.length }}</span>
          </button>
          <button class="btn btn-sm" data-testid="filter-expense"
            :style="typeFilter === 'expense' ? 'background:var(--ink);color:var(--paper);' : ''"
            @click="typeFilter = 'expense'">
            Expenses · {{ expenseCount }}
          </button>
          <button class="btn btn-sm" data-testid="filter-income"
            :style="typeFilter === 'income' ? 'background:var(--ink);color:var(--paper);' : ''"
            @click="typeFilter = 'income'">
            Income · {{ incomeCount }}
          </button>

          <!-- Category dropdown trigger -->
          <div style="position:relative;" data-dropdown>
            <button class="btn btn-sm" data-testid="filter-category"
              :style="hasCatFilter ? 'background:var(--butter);' : ''"
              @click.stop="catDropdownOpen = !catDropdownOpen; dateDropdownOpen = false">
              <AppIcon name="tag" :size="14" />
              Category
              <span v-if="hasCatFilter" class="mono" style="opacity:0.8;">· {{ selectedCategories.length }}</span>
            </button>

            <!-- Category dropdown -->
            <div v-if="catDropdownOpen"
              data-testid="dropdown-category"
              role="menu"
              style="position:absolute;top:calc(100% + 10px);left:0;width:280px;background:var(--paper-2);border:2px solid var(--ink);border-radius:16px;box-shadow:6px 6px 0 0 var(--ink);padding:12px;z-index:50;">
              <!-- caret -->
              <div style="position:absolute;top:-10px;left:28px;width:16px;height:16px;background:var(--paper-2);border-left:2px solid var(--ink);border-top:2px solid var(--ink);transform:rotate(45deg);" />

              <div class="row-between" style="padding:4px 6px 10px;">
                <div class="label-xs">Filter by category</div>
                <button class="btn btn-sm btn-ghost" data-testid="btn-cat-clear"
                  style="height:24px;padding:0 8px;font-size:11px;" @click="clearCategories">Clear</button>
              </div>

              <div style="display:flex;flex-direction:column;" data-testid="cat-options">
                <label
                  v-for="c in ALL_CATEGORIES" :key="c.label"
                  :data-testid="`cat-opt-${c.label.toLowerCase().replace(/[^a-z]+/g,'-')}`"
                  :style="{
                    display:'flex',alignItems:'center',gap:'10px',
                    padding:'8px 8px',borderRadius:'8px',cursor:'pointer',
                    background: selectedCategories.includes(c.label) ? 'var(--cream)' : 'transparent',
                  }"
                  @click.stop="toggleCategory(c.label)"
                >
                  <!-- custom checkbox -->
                  <div :style="{
                    width:'18px',height:'18px',borderRadius:'5px',
                    border:'2px solid var(--ink)',
                    background: selectedCategories.includes(c.label) ? 'var(--ink)' : 'var(--paper-2)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    color:'var(--paper)',flexShrink:'0',
                  }">
                    <AppIcon v-if="selectedCategories.includes(c.label)" name="check" :size="12" :stroke="3" />
                  </div>
                  <!-- color swatch -->
                  <div :style="{
                    width:'14px',height:'14px',
                    background: c.color === 'ink' ? 'var(--ink)' : `var(--${c.color})`,
                    border:'1.5px solid var(--ink)',borderRadius:'4px',flexShrink:'0',
                  }" />
                  <div style="font-size:13px;font-weight:500;flex:1;">{{ c.label }}</div>
                </label>
              </div>

              <div class="row-between" style="padding:10px 6px 4px;margin-top:6px;border-top:1.5px solid rgba(22,20,15,0.12);">
                <span class="mono" style="font-size:11px;color:var(--ink-mute);">
                  {{ selectedCategories.length }} of {{ ALL_CATEGORIES.length }} selected
                </span>
                <button class="btn btn-sm btn-primary" data-testid="btn-cat-apply"
                  style="height:28px;padding:0 12px;font-size:12px;" @click="applyCategories">Apply</button>
              </div>
            </div>
          </div>

          <!-- Date dropdown trigger -->
          <div style="position:relative;" data-dropdown>
            <button class="btn btn-sm" data-testid="filter-date"
              :style="hasDateFilter ? 'background:var(--sky);' : ''"
              @click.stop="dateDropdownOpen = !dateDropdownOpen; catDropdownOpen = false">
              <AppIcon name="calendar" :size="14" />
              {{ dateFilterLabel }}
            </button>

            <!-- Date dropdown -->
            <div v-if="dateDropdownOpen"
              data-testid="dropdown-date"
              role="menu"
              style="position:absolute;top:calc(100% + 10px);left:0;width:340px;background:var(--paper-2);border:2px solid var(--ink);border-radius:16px;box-shadow:6px 6px 0 0 var(--ink);padding:16px;z-index:50;">
              <!-- caret -->
              <div style="position:absolute;top:-10px;left:36px;width:16px;height:16px;background:var(--paper-2);border-left:2px solid var(--ink);border-top:2px solid var(--ink);transform:rotate(45deg);" />

              <!-- Preset chips -->
              <div class="row" style="gap:6px;flex-wrap:wrap;margin-bottom:14px;" data-testid="date-presets">
                <button v-for="p in DATE_PRESETS" :key="p.id"
                  :class="['chip', activePreset === p.id ? 'chip-butter' : '']"
                  :data-testid="`preset-${p.id}`"
                  @click.stop="applyPreset(p.id)">{{ p.label }}</button>
              </div>

              <!-- Month nav -->
              <div class="row-between" style="margin-bottom:10px;">
                <button class="btn btn-icon btn-ghost" data-testid="cal-prev"
                  style="width:28px;height:28px;" @click.stop="prevMonth">
                  <AppIcon name="chevron-left" :size="14" />
                </button>
                <div style="font-family:var(--font-display);font-weight:700;font-size:16px;" data-testid="cal-month">
                  {{ monthNames[calMonth] }} {{ calYear }}
                </div>
                <button class="btn btn-icon btn-ghost" data-testid="cal-next"
                  style="width:28px;height:28px;transform:rotate(180deg);" @click.stop="nextMonth">
                  <AppIcon name="chevron-left" :size="14" />
                </button>
              </div>

              <!-- Weekday headers -->
              <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:4px;">
                <div v-for="d in ['S','M','T','W','T','F','S']" :key="d"
                  class="mono" style="text-align:center;font-size:10px;color:var(--ink-mute);letter-spacing:0.08em;padding:4px 0;">
                  {{ d }}
                </div>
              </div>

              <!-- Days grid -->
              <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;" data-testid="cal-grid">
                <div v-for="(d, i) in calGrid" :key="i">
                  <button v-if="d !== null"
                    :data-testid="`cal-day-${d}`"
                    :style="{
                      height:'32px',width:'100%',
                      border: (d === rangeStart || d === rangeEnd) ? '2px solid var(--ink)' : '1.5px solid transparent',
                      background: (d === rangeStart || d === rangeEnd) ? 'var(--ink)'
                                : (rangeStart && rangeEnd && d > rangeStart && d < rangeEnd) ? 'var(--butter)'
                                : 'transparent',
                      color: (d === rangeStart || d === rangeEnd) ? 'var(--paper)' : 'var(--ink)',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize:'12px',fontWeight:'500',cursor:'pointer',
                    }"
                    @click.stop="selectDay(d)">{{ d }}</button>
                  <div v-else />
                </div>
              </div>

              <!-- Range readout -->
              <div style="margin-top:14px;padding:10px;border:1.5px solid var(--ink);border-radius:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px;background:var(--cream);"
                data-testid="date-range-readout">
                <div>
                  <div class="label-xs" style="font-size:9px;">From</div>
                  <div class="mono" style="font-size:13px;font-weight:600;" data-testid="range-from">
                    {{ rangeFromLabel }}
                  </div>
                </div>
                <div>
                  <div class="label-xs" style="font-size:9px;">To</div>
                  <div class="mono" style="font-size:13px;font-weight:600;" data-testid="range-to">
                    {{ rangeToLabel }}
                  </div>
                </div>
              </div>

              <div class="row-between" style="margin-top:14px;">
                <button class="btn btn-sm btn-ghost" data-testid="btn-date-clear"
                  style="height:28px;font-size:12px;" @click.stop="clearDate">Clear</button>
                <button class="btn btn-sm btn-primary" data-testid="btn-date-apply"
                  style="height:28px;padding:0 14px;font-size:12px;" @click.stop="applyDate">Apply range</button>
              </div>
            </div>
          </div>

          <div style="margin-left:auto;">
            <button class="btn btn-sm" data-testid="btn-export" @click="exportStatement(filtered)">
              <AppIcon name="download" :size="14" /> Export
            </button>
          </div>
        </div>

        <!-- ── Transaction cards grid ── -->
        <div v-if="filtered.length > 0"
          style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;"
          data-testid="tx-grid">
          <TxCard v-for="tx in filtered" :key="tx.id" :tx="tx" />
        </div>

        <!-- Empty state -->
        <div v-else style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 0;gap:16px;text-align:center;">
          <div style="font-size:48px;">◌</div>
          <div style="font-family:var(--font-display);font-size:22px;font-weight:700;">No transactions found</div>
          <div style="color:var(--ink-mute);font-size:14px;">Try adjusting your search or filters.</div>
          <button class="btn btn-sm" @click="searchQuery='';typeFilter='all';clearCategories();clearDate()">
            Clear all filters
          </button>
        </div>
      </div>
    </div>

    <TxModal :open="modalOpen" mode="create" @close="modalOpen = false" />
  </div>
</template>
