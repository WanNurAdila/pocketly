import test, { expect } from '@playwright/test'

test.describe('Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://pocketly-budgeting.vercel.app')
  })

  test('Login test', async ({ page }) => {
    await page.goto('https://pocketly-budgeting.vercel.app')

    // Fill in the username and password fields
    await page.getByTestId('input-email').fill('demo@pocketly.app')
    await page.getByTestId('input-password').fill('pocket1234')

    // Click the login button
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Expect to be redirected to the dashboard
    await expect(page).toHaveURL('https://pocketly-budgeting.vercel.app/home')
  })

  test('Login with invalid credentials', async ({ page }) => {
    await page.goto('https://pocketly-budgeting.vercel.app')

    // Fill in the username and password fields with invalid credentials
    await page.getByTestId('input-email').fill('wrongEmail@example.com')
    await page.getByTestId('input-password').fill('wrongPassword')

    // Click the login button
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Expect to see an error message
    await expect(page.getByText('Incorrect email or password. Try again.')).toBeVisible()
  })
})
