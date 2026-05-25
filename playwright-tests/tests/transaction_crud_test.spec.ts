import test, { expect, Locator } from '@playwright/test'
import { login } from './helpers/auth'

const today = new Date().toISOString().split('T')[0]

test.describe('Transaction CRUD Operations', () => {
  let merchant: Locator
  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: 'Transactions' }).click()
    merchant = page.getByTestId('tx-card-tx_001')
  })

  test('Should create a new transaction', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Transaction' }).click()

    await page.getByLabel('Merchant').fill('MPH')
    await page.getByLabel('Amount').fill('35')
    await page.getByLabel('Category').selectOption('Books')
    await page.getByLabel('Date').fill(today)
    await page.getByLabel('Note').fill('Harry Potter book')
    const form = page.getByRole('dialog')
    await form.getByRole('button', { name: 'Add transaction' }).click()
    const grid = page.getByTestId('tx-grid')
    await expect(grid.getByText('MPH')).toBeVisible()
  })

  test('Should delete a transaction', async ({ page }) => {
    await merchant.click()
    await page.getByRole('button', { name: 'Delete' }).click()
    await page.getByRole('checkbox', { name: " I understand this can't be undone. " }).click()
    await page.getByRole('button', { name: 'Yes, delete it' }).click()
    await expect(merchant).toBeHidden()
  })

  test('Should edit a transaction', async ({ page }) => {
    await merchant.click()
    await page.getByRole('button', { name: 'Edit' }).click()
    await page.getByLabel('Merchant').fill('Youtube')
    await page.getByLabel('Amount').fill('20')
    await page.getByLabel('Category').selectOption('Subscriptions')
    await page.getByLabel('Date').fill(today)
    await page.getByLabel('Note').fill('youtube premium')
    await page.getByRole('button', { name: 'Save Changes' }).click()
    await page.getByRole('button', { name: 'Back' }).click()
    await expect(page.getByText('Youtube')).toBeVisible()
  })
})
