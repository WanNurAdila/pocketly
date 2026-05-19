import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { SEED_TX, CATEGORIES, type Transaction } from '@/data'

export const useTransactionsStore = defineStore('transactions', () => {
  function load(): Transaction[] {
    try {
      const raw = localStorage.getItem('pocketly_tx')
      return raw ? (JSON.parse(raw) as Transaction[]) : [...SEED_TX]
    } catch {
      return [...SEED_TX]
    }
  }

  const transactions = ref<Transaction[]>(load())

  function persist() {
    localStorage.setItem('pocketly_tx', JSON.stringify(transactions.value))
  }

  function nextId(): string {
    const nums = transactions.value.map(t => parseInt(t.id.replace('tx_', '')) || 0)
    const max = nums.length ? Math.max(...nums) : 0
    return `tx_${String(max + 1).padStart(3, '0')}`
  }

  function add(tx: Omit<Transaction, 'id'>) {
    transactions.value.unshift({ id: nextId(), ...tx })
    persist()
  }

  function update(id: string, data: Partial<Omit<Transaction, 'id'>>) {
    const i = transactions.value.findIndex(t => t.id === id)
    if (i >= 0) {
      transactions.value[i] = { ...transactions.value[i]!, ...data }
      persist()
    }
  }

  function remove(id: string) {
    transactions.value = transactions.value.filter(t => t.id !== id)
    persist()
  }

  function reset() {
    transactions.value = [...SEED_TX]
    localStorage.removeItem('pocketly_tx')
  }

  // Computed: spent per category label (expenses only, current month)
  const spentByCategory = computed(() => {
    const map: Record<string, number> = {}
    transactions.value
      .filter(t => t.amount < 0)
      .forEach(t => {
        map[t.category] = (map[t.category] ?? 0) + Math.abs(t.amount)
      })
    return map
  })

  // Categories enriched with live spent amounts
  const budgetCategories = computed(() =>
    CATEGORIES.map(c => ({
      ...c,
      spent: Math.round((spentByCategory.value[c.label] ?? 0) * 100) / 100,
    }))
  )

  const totalBudget  = computed(() => CATEGORIES.reduce((s, c) => s + c.budget, 0))
  const totalSpent   = computed(() => budgetCategories.value.reduce((s, c) => s + c.spent, 0))
  const totalIncome  = computed(() => transactions.value.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0))
  const totalExpense = computed(() => transactions.value.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0))

  return {
    transactions, add, update, remove, reset,
    budgetCategories, totalBudget, totalSpent, totalIncome, totalExpense,
  }
})
