import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for product grid and click the first product
    await page.locator('a[href^="/product/"]').first().waitFor({ timeout: 10000 });
    await page.locator('a[href^="/product/"]').first().click();
    await page.waitForURL(/\/product\/.+/);
  });

  test('@smoke product detail page loads correctly', async ({ page }) => {
    // Product title (h1) must be visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 8000 });

    // Price must be visible
    await expect(page.locator('text=/฿[0-9]/').first()).toBeVisible();
  });

  test('@critical size selection buttons are visible', async ({ page }) => {
    // At least one size selection button should be rendered
    // They are inside the variant selection section
    await expect(page.getByText(/เลือกแบบ\/ไซส์|Select Size/i)).toBeVisible({ timeout: 8000 });

    const sizeButtons = page.locator('button').filter({ hasText: /S|M|L|XL|Waist|Free/i });
    await expect(sizeButtons.first()).toBeVisible();
  });

  test('@critical selecting a size enables quantity control', async ({ page }) => {
    // Click the first available size button
    const sizeButtons = page.locator('button').filter({ hasText: /^(XS|S|M|L|XL|Free Size|Waist \d+")$/ });
    await sizeButtons.first().click({ timeout: 8000 });

    // Quantity stepper should now appear
    const qtySection = page.locator('text=/จำนวนสินค้า|Quantity/i');
    await expect(qtySection).toBeVisible();
  });

  test('@critical add to cart button works when size is selected', async ({ page }) => {
    // Click first available size
    const sizeButtons = page.locator('button').filter({ hasText: /^(XS|S|M|L|XL|Free Size|Waist \d+")$/ });
    await sizeButtons.first().click({ timeout: 8000 });

    // Click add to cart
    const addBtn = page.getByRole('button', { name: /หยิบใส่ตะกร้า|Add to Cart/i });
    await expect(addBtn).toBeEnabled({ timeout: 5000 });
    await addBtn.click();

    // Button should still be intact (not navigated away)
    await expect(addBtn).toBeVisible();
  });

  test('product story section is visible', async ({ page }) => {
    await expect(page.getByText(/เรื่องราวของชุด|The Story/i)).toBeVisible({ timeout: 8000 });
  });

  test('materials section is visible', async ({ page }) => {
    await expect(page.getByText(/วัสดุและเนื้อผ้า|Materials/i)).toBeVisible({ timeout: 8000 });
  });

  test('care instructions section is visible', async ({ page }) => {
    await expect(page.getByText(/การดูแลรักษา|Care Instructions/i)).toBeVisible({ timeout: 8000 });
  });

  test('size guide section is visible', async ({ page }) => {
    await expect(page.getByText(/ขนาดและสัดส่วน|Size Guide/i)).toBeVisible({ timeout: 8000 });
  });

  test('shipping section is visible', async ({ page }) => {
    await expect(page.getByText(/การจัดส่ง|Shipping/i)).toBeVisible({ timeout: 8000 });
  });
});
