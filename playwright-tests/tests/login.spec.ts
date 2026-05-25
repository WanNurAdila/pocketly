import test, { expect } from '@playwright/test'
import { login } from './helpers/auth'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL_POCKETLY!)
  })

  test('user can log in with valid credentials', async ({ page }) => {
    await login(page)
    await expect(page).toHaveURL(`${process.env.BASE_URL_POCKETLY}/home`)
  })

  test('user sees error message with invalid credentials', async ({ page }) => {
    // Fill in the username and password fields with invalid credentials
    await page.getByTestId('input-email').fill('wrongEmail@example.com')
    await page.getByTestId('input-password').fill('wrongPassword')

    // Click the login button
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Expect to see an error message
    await expect(page.getByText('Incorrect email or password. Try again.')).toBeVisible()
  })

  test('login get by label', async ({ page }) => {
    await page.getByLabel('Email').fill(process.env.TEST_EMAIL_POCKETLY!)
    await page.getByLabel('Password').fill(process.env.TEST_PASSWORD_POCKETLY!)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(`${process.env.BASE_URL_POCKETLY}/home`)
  })
})
