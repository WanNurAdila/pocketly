import { Page } from '@playwright/test'

export async function login(page: Page) {
  await page.goto(process.env.BASE_URL_POCKETLY!)
  await page.getByTestId('input-email').fill(process.env.TEST_EMAIL_POCKETLY!)
  await page.getByTestId('input-password').fill(process.env.TEST_PASSWORD_POCKETLY!)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL(`${process.env.BASE_URL_POCKETLY}/home`)
}
