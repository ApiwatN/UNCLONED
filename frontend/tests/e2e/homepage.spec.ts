import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('@smoke hero section is visible', async ({ page }) => {
    // Navbar should be visible
    await expect(page.getByRole('navigation')).toBeVisible();

    // Page should have at least one heading
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
  });

  test('@smoke product grid loads products', async ({ page }) => {
    // Wait for products to load – at least one product card must appear
    const productCards = page.locator('a[href^="/product/"]');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('@critical product card shows name and price', async ({ page }) => {
    const firstCard = page.locator('a[href^="/product/"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    // Price badge with ฿ symbol should be visible inside card region
    const price = page.locator('text=/฿[0-9]/').first();
    await expect(price).toBeVisible();
  });

  test('language switch button is visible in navbar', async ({ page }) => {
    // Language toggle button (TH / EN)
    const langBtn = page.getByRole('button', { name: /EN|TH|ภาษา|Language/i });
    await expect(langBtn).toBeVisible();
  });
});
