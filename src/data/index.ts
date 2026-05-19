export interface Transaction {
  id: string
  date: string
  merchant: string
  category: string
  amount: number
  type: 'expense' | 'income'
  note: string
  method: string
  tags: string[]
}

export interface Category {
  id: string
  label: string
  color: string
  budget: number
}

export const VALID_EMAIL    = 'demo@pocketly.app'
export const VALID_PASSWORD = 'pocket1234'

export const SEED_TX: Transaction[] = [
  { id: 'tx_001', date: '2026-05-18', merchant: 'Blue Bottle Coffee',     category: 'Food & Drink',   amount: -6.50,    type: 'expense', note: 'Morning oat latte',   method: 'Visa •• 4821', tags: ['coffee']  },
  { id: 'tx_002', date: '2026-05-18', merchant: "Trader Joe's",           category: 'Groceries',      amount: -84.22,   type: 'expense', note: 'Weekly run',          method: 'Visa •• 4821', tags: ['weekly']  },
  { id: 'tx_003', date: '2026-05-17', merchant: 'Acme Corp Payroll',      category: 'Income',         amount: 3120.00,  type: 'income',  note: 'Biweekly salary',    method: 'ACH',          tags: ['payroll'] },
  { id: 'tx_004', date: '2026-05-17', merchant: 'Spotify',                category: 'Subscriptions',  amount: -10.99,   type: 'expense', note: 'Premium',            method: 'Visa •• 4821', tags: ['music']   },
  { id: 'tx_005', date: '2026-05-16', merchant: 'Uber',                   category: 'Transport',      amount: -14.30,   type: 'expense', note: 'Ride to airport',    method: 'Visa •• 4821', tags: ['ride']    },
  { id: 'tx_006', date: '2026-05-15', merchant: 'Rent — Maple Apts.',     category: 'Housing',        amount: -1450.00, type: 'expense', note: 'May rent',           method: 'ACH',          tags: ['monthly'] },
  { id: 'tx_007', date: '2026-05-14', merchant: 'Kindle Store',           category: 'Books',          amount: -12.99,   type: 'expense', note: '"Slow Productivity"',method: 'Visa •• 4821', tags: ['ebook']   },
  { id: 'tx_008', date: '2026-05-13', merchant: 'Etsy',                   category: 'Shopping',       amount: -38.00,   type: 'expense', note: 'Ceramic mug',        method: 'Visa •• 4821', tags: ['gift']    },
]

export const CATEGORIES: Category[] = [
  { id: 'food',   label: 'Food & Drink',  color: 'coral',  budget: 350  },
  { id: 'groc',   label: 'Groceries',     color: 'sage',   budget: 500  },
  { id: 'house',  label: 'Housing',       color: 'ink',    budget: 1500 },
  { id: 'transp', label: 'Transport',     color: 'sky',    budget: 200  },
  { id: 'subs',   label: 'Subscriptions', color: 'lilac',  budget: 80   },
  { id: 'shop',   label: 'Shopping',      color: 'butter', budget: 250  },
]

export const CATEGORY_COLOR: Record<string, string> = {
  'Food & Drink':  'coral',
  'Groceries':     'sage',
  'Housing':       'ink',
  'Transport':     'sky',
  'Subscriptions': 'lilac',
  'Shopping':      'butter',
  'Income':        'mint',
  'Books':         'blush',
}

export interface CategoryMeta { label: string; color: string }

export const ALL_CATEGORIES: CategoryMeta[] = [
  { label: 'Food & Drink',  color: 'coral'  },
  { label: 'Groceries',     color: 'sage'   },
  { label: 'Housing',       color: 'ink'    },
  { label: 'Transport',     color: 'sky'    },
  { label: 'Subscriptions', color: 'lilac'  },
  { label: 'Shopping',      color: 'butter' },
  { label: 'Books',         color: 'blush'  },
  { label: 'Income',        color: 'mint'   },
]

export const ALL_CATEGORY_LABELS = ALL_CATEGORIES.map(c => c.label)

export function money(n: number): string {
  const sign = n < 0 ? '-' : '+'
  const v = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${sign}$${v}`
}

export function moneyAbs(n: number): string {
  return `$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
