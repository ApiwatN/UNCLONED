import { test, expect } from '@playwright/test';

test.describe('Admin Products Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    // Wait for the product table to load
    await page.waitForTimeout(1500);
  });

  test('@smoke admin page loads without errors', async ({ page }) => {
    // Admin layout sidebar is always visible when on admin pages
    await expect(page.getByText('คลังสินค้า (Products)')).toBeVisible({ timeout: 10000 });
    // Main content area should show the table
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
  });

  test('@smoke product count badge is shown', async ({ page }) => {
    // The badge with "X รายการ" is a span inside the h1 — use contains text
    await expect(page.locator('span').filter({ hasText: /รายการ/ }).first()).toBeVisible({ timeout: 10000 });
  });

  test('@critical search box filters products', async ({ page }) => {
    const searchBox = page.getByPlaceholder(/ค้นหาสินค้า/i);
    await expect(searchBox).toBeVisible({ timeout: 10000 });

    // Type a search term
    await searchBox.fill('เสื้อ');
    await page.waitForTimeout(500);

    // Table rows (tr) should still exist (filtered results)
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('@critical category filter works', async ({ page }) => {
    const categorySelect = page.locator('select').first();
    await expect(categorySelect).toBeVisible({ timeout: 10000 });

    // Select "Tops"
    await categorySelect.selectOption('tops');
    await page.waitForTimeout(500);

    // After filtering, rows should exist
    const rows = page.locator('tbody tr');
    await expect(rows.first()).toBeVisible();
  });

  test('@critical pagination appears when products > 10', async ({ page }) => {
    // If more than 10 products exist, pagination should be visible
    const productCount = await page.locator('tbody tr').count();
    if (productCount >= 10) {
      const nextBtn = page.getByRole('button', { name: /ถัดไป/i });
      await expect(nextBtn).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('pagination next/prev navigation works', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: /ถัดไป/i });
    const isVisible = await nextBtn.isVisible();
    if (!isVisible) {
      test.skip();
      return;
    }

    // Click next
    await nextBtn.click();
    await page.waitForTimeout(300);

    // Page 2 button should now be active (has bg-craft-800 class)
    const page2Btn = page.getByRole('button', { name: '2' });
    await expect(page2Btn).toBeVisible();

    // Back button should be enabled
    const prevBtn = page.getByRole('button', { name: /ก่อนหน้า/i });
    await expect(prevBtn).toBeEnabled();
  });

  test('"นำสินค้าเข้าโกดัง" button opens the form', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /นำสินค้าเข้าโกดัง/i });
    await expect(addBtn).toBeVisible({ timeout: 10000 });
    await addBtn.click();

    // The ProductForm should appear
    await expect(page.getByRole('button', { name: /ยกเลิก|Cancel/i })).toBeVisible({ timeout: 5000 });
  });

  test('edit button opens the edit modal', async ({ page }) => {
    // Find the first edit button in the table
    const editBtn = page.locator('[id^="edit-"]').first();
    await expect(editBtn).toBeVisible({ timeout: 10000 });
    await editBtn.click();

    // Edit modal should appear with save button
    await expect(page.getByRole('button', { name: /บันทึกการแก้ไข/i })).toBeVisible({ timeout: 5000 });
  });
});
