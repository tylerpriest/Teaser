import { test, expect } from '@playwright/test'

test.describe('ADHDNSW Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the main heading and search form', async ({ page }) => {
    // Check main heading
    const heading = page.getByRole('heading', { 
      name: 'Your Guide to ADHD Support in NSW' 
    })
    await expect(heading).toBeVisible()

    // Check search form elements
    await expect(page.getByPlaceholder('Search professionals by name or specialty...')).toBeVisible()
    await expect(page.getByPlaceholder('Suburb or postcode')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Search Directory' })).toBeVisible()
  })

  test('should have navigation menu', async ({ page }) => {
    // Check main navigation items
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Directory' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Resources' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible()
  })

  test('should display statistics', async ({ page }) => {
    await expect(page.getByText('500+')).toBeVisible()
    await expect(page.getByText('Verified Professionals')).toBeVisible()
    await expect(page.getByText('100+')).toBeVisible()
    await expect(page.getByText('Expert Articles')).toBeVisible()
  })

  test('should have working popular search links', async ({ page }) => {
    const psychiatristLink = page.getByRole('link', { name: 'ADHD Psychiatrist' })
    await expect(psychiatristLink).toHaveAttribute('href', '/directory?services=psychiatrist')
    
    const sydneyLink = page.getByRole('link', { name: 'Sydney' })
    await expect(sydneyLink).toHaveAttribute('href', '/directory?location=Sydney')
  })

  test('should show service grid', async ({ page }) => {
    await expect(page.getByText('Psychiatrists')).toBeVisible()
    await expect(page.getByText('Psychologists')).toBeVisible()
    await expect(page.getByText('Paediatricians')).toBeVisible()
    await expect(page.getByText('ADHD Coaches')).toBeVisible()
  })

  test('should have FAQ section', async ({ page }) => {
    await expect(page.getByText('How do I get an ADHD diagnosis in NSW?')).toBeVisible()
    await expect(page.getByText('Does Medicare cover ADHD assessments?')).toBeVisible()
    await expect(page.getByText('What\'s the typical wait time for ADHD specialists in NSW?')).toBeVisible()
  })

  test('should have footer with links', async ({ page }) => {
    const footer = page.locator('footer')
    
    await expect(footer.getByText('ADHD NSW')).toBeVisible()
    await expect(footer.getByRole('link', { name: 'Find Professionals' })).toBeVisible()
    await expect(footer.getByRole('link', { name: 'Privacy Policy' })).toBeVisible()
    await expect(footer.getByText('info@adhdnsw.org')).toBeVisible()
  })
})