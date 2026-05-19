import type { Transaction } from '@/data'
import { money } from '@/data'

function fmt(iso: string) {
  const [y, m, d] = iso.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(m!) - 1]} ${parseInt(d!)}, ${y}`
}

function periodLabel(txs: Transaction[]) {
  if (!txs.length) return 'No transactions'
  const sorted = [...txs].sort((a, b) => a.date.localeCompare(b.date))
  const first = sorted[0]!.date
  const last  = sorted[sorted.length - 1]!.date
  return first === last ? fmt(first) : `${fmt(first)} – ${fmt(last)}`
}

function amountColor(n: number) {
  return n > 0 ? '#1a7a4a' : '#c0392b'
}

function rowsHtml(txs: Transaction[]) {
  if (!txs.length) {
    return `<tr><td colspan="5" style="text-align:center;color:#999;padding:24px 0;">No transactions</td></tr>`
  }
  return [...txs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((t, i) => `
      <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f9f9f7'};">
        <td style="padding:10px 14px;font-size:12px;color:#555;white-space:nowrap;">${fmt(t.date)}</td>
        <td style="padding:10px 14px;">
          <div style="font-weight:600;font-size:13px;">${t.merchant}</div>
          ${t.note ? `<div style="font-size:11px;color:#888;margin-top:2px;">${t.note}</div>` : ''}
        </td>
        <td style="padding:10px 14px;">
          <span style="display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;background:#f0ede6;color:#444;">${t.category}</span>
        </td>
        <td style="padding:10px 14px;font-size:12px;color:#666;">${t.method}</td>
        <td style="padding:10px 14px;font-family:monospace;font-size:13px;font-weight:700;text-align:right;white-space:nowrap;color:${amountColor(t.amount)};">
          ${money(t.amount)}
        </td>
      </tr>`)
    .join('')
}

export function exportStatement(txs: Transaction[]) {
  const totalCredits  = txs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const totalDebits   = txs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const netBalance    = totalCredits - totalDebits
  const period        = periodLabel(txs)
  const generated     = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Pocketly · Account Statement</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #fff;
      color: #1a1a1a;
      padding: 40px 48px;
      max-width: 860px;
      margin: 0 auto;
    }

    /* ── Header ── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 24px;
      border-bottom: 3px solid #1a1a1a;
      margin-bottom: 28px;
    }
    .logo-wordmark {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.04em;
    }
    .logo-wordmark span { color: #e05a3a; }
    .header-right { text-align: right; }
    .statement-title {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #666;
    }
    .account-num {
      font-family: monospace;
      font-size: 15px;
      font-weight: 700;
      margin-top: 4px;
    }
    .period {
      font-size: 12px;
      color: #888;
      margin-top: 4px;
    }

    /* ── Summary band ── */
    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0;
      border: 1.5px solid #e0ddd6;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 32px;
    }
    .summary-cell {
      padding: 16px 20px;
      border-right: 1.5px solid #e0ddd6;
    }
    .summary-cell:last-child { border-right: none; }
    .summary-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #999;
      margin-bottom: 6px;
    }
    .summary-value {
      font-family: monospace;
      font-size: 20px;
      font-weight: 700;
    }
    .credit  { color: #1a7a4a; }
    .debit   { color: #c0392b; }
    .net-pos { color: #1a7a4a; }
    .net-neg { color: #c0392b; }

    /* ── Table ── */
    .section-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #888;
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1.5px solid #e0ddd6;
      border-radius: 10px;
      overflow: hidden;
    }
    thead tr { background: #1a1a1a; color: #fff; }
    thead th {
      padding: 11px 14px;
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    thead th:last-child { text-align: right; }
    tbody tr { border-top: 1px solid #ece9e1; }

    /* ── Footer ── */
    .footer {
      margin-top: 36px;
      padding-top: 16px;
      border-top: 1.5px solid #e0ddd6;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-left { font-size: 11px; color: #aaa; }
    .footer-right { font-size: 11px; color: #aaa; text-align: right; }

    @media print {
      body { padding: 20px 24px; }
      @page { margin: 12mm 10mm; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div>
      <div class="logo-wordmark">pocket<span>ly</span></div>
      <div style="font-size:12px;color:#888;margin-top:4px;">pocketly.app · demo account</div>
    </div>
    <div class="header-right">
      <div class="statement-title">Account Statement</div>
      <div class="account-num">•••• •••• •••• 4821</div>
      <div class="period">${period}</div>
    </div>
  </div>

  <!-- Summary -->
  <div class="summary">
    <div class="summary-cell">
      <div class="summary-label">Transactions</div>
      <div class="summary-value">${txs.length}</div>
    </div>
    <div class="summary-cell">
      <div class="summary-label">Total Credits</div>
      <div class="summary-value credit">+$${totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    </div>
    <div class="summary-cell">
      <div class="summary-label">Total Debits</div>
      <div class="summary-value debit">-$${totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    </div>
    <div class="summary-cell">
      <div class="summary-label">Net Balance</div>
      <div class="summary-value ${netBalance >= 0 ? 'net-pos' : 'net-neg'}">${money(netBalance)}</div>
    </div>
  </div>

  <!-- Transaction table -->
  <div class="section-title">Transaction detail</div>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Category</th>
        <th>Method</th>
        <th style="text-align:right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml(txs)}
    </tbody>
  </table>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-left">
      Pocketly · Demo Account · Statement generated ${generated}
    </div>
    <div class="footer-right">
      This is a demo statement for QA purposes only.
    </div>
  </div>

  <script>
    window.onload = function() { window.print() }
  <\/script>
</body>
</html>`

  const win = window.open('', '_blank', 'width=900,height=700')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}
