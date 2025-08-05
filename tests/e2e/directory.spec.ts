import { test, expect } from '@playwright/test'

test.describe('Directory Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/directory')
  })

  test('should display directory heading and search', async ({ page }) => {
    await expect(page.getByRole('heading', { 
      name: 'Find ADHD Professionals in NSW' 
    })).toBeVisible()

    // Search elements
    await expect(page.getByPlaceholder('Search by name or specialty...')).toBeVisible()
    await expect(page.getByPlaceholder('Suburb or postcode...')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Filters' })).toBeVisible()
  })

  test('should toggle filter panel', async ({ page }) => {
    const filterButton = page.getByRole('button', { name: 'Filters' })
    
    // Initially filters should be hidden
    await expect(page.getByText('Service Type')).not.toBeVisible()
    
    // Click to show filters
    await filterButton.click()
    await expect(page.getByText('Service Type')).toBeVisible()
    await expect(page.getByText('Age Groups')).toBeVisible()
    await expect(page.getByText('Additional Options')).toBeVisible()
  })

  test('should have service type filters', async ({ page }) => {
    await page.getByRole('button', { name: 'Filters' }).click()
    
    await expect(page.getByText('Psychiatrist')).toBeVisible()
    await expect(page.getByText('Psychologist')).toBeVisible()
    await expect(page.getByText('ADHD Coach')).toBeVisible()
  })

  test('should have additional filter options', async ({ page }) => {
    await page.getByRole('button', { name: 'Filters' }).click()
    
    await expect(page.getByText('Accepting new patients')).toBeVisible()
    await expect(page.getByText('Offers telehealth')).toBeVisible()
    await expect(page.getByText('NDIS registered only')).toBeVisible()
  })

  test('should show popular search links in SEO section', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    await expect(page.getByRole('link', { name: 'ADHD Psychiatrists' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sydney ADHD Specialists' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Telehealth Options' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'NDIS Providers' })).toBeVisible()
  })

  test('should have SEO content sections', async ({ page }) => {
    await expect(page.getByText('Finding the Right ADHD Professional in NSW')).toBeVisible()
    await expect(page.getByText('Types of ADHD Professionals')).toBeVisible()
    await expect(page.getByText('Popular Searches')).toBeVisible()
  })
})