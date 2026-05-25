import test, { expect } from '@playwright/test'

test.describe('Test API call', () => {
  test('Test API Call', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/users/1')

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body).toHaveProperty('id', 1)
    expect(body).toHaveProperty('name')
    expect(body).toHaveProperty('email')
  })
})
