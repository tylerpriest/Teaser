import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should display welcome message', async ({ page }) => {
    await page.goto('/')
    
    await expect(page).toHaveTitle(/Terragon Project/)
    
    const heading = page.getByRole('heading', { 
      name: 'Welcome to Terragon Project' 
    })
    await expect(heading).toBeVisible()
    
    const description = page.getByText('A production-ready Next.js application')
    await expect(description).toBeVisible()
  })

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/')
    
    const description = await page.getAttribute('meta[name="description"]', 'content')
    expect(description).toBe('A modular Next.js application')
  })
})