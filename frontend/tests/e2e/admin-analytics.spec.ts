import { test, expect } from '@playwright/test';

test.describe('Analytics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/analytics');
  });

  test('@smoke analytics page loads without crash', async ({ page }) => {
    // Sidebar link confirms we are in admin section
    await expect(page.getByText('วิเคราะห์ข้อมูล (Analytics)')).toBeVisible({ timeout: 10000 });
    // Main H1 exists (exact text may have icons inside)
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  });

  test('@smoke core metric cards are visible', async ({ page }) => {
    // Revenue card — text inside a <span>
    await expect(page.locator('span').filter({ hasText: /รายได้รวม/ }).first()).toBeVisible({ timeout: 10000 });
    // Orders card
    await expect(page.locator('span').filter({ hasText: /ออเดอร์/ }).first()).toBeVisible({ timeout: 10000 });
  });

  test('date preset dropdown is functional', async ({ page }) => {
    const select = page.locator('select').first();
    await expect(select).toBeVisible({ timeout: 10000 });

    // Switch to "7 วันที่ผ่านมา"
    await select.selectOption('7days');
    await page.waitForTimeout(500);

    // Page should still show metric cards (no crash)
    await expect(page.getByText(/รายได้รวม|Revenue/i)).toBeVisible();
  });

  test('custom date range shows date pickers', async ({ page }) => {
    const select = page.locator('select').first();
    await expect(select).toBeVisible({ timeout: 10000 });

    await select.selectOption('custom');
    await page.waitForTimeout(300);

    // Two date inputs should appear
    const dateInputs = page.locator('input[type="date"]');
    await expect(dateInputs.first()).toBeVisible();
    await expect(dateInputs.nth(1)).toBeVisible();
  });

  test('customer insight section is visible', async ({ page }) => {
    await expect(page.getByText(/วิเคราะห์ฐานลูกค้า/i)).toBeVisible({ timeout: 10000 });
  });

  test('time-based trend charts are visible', async ({ page }) => {
    await expect(page.getByText(/วิเคราะห์ช่วงเวลาขายดี/i)).toBeVisible({ timeout: 10000 });

    // Bar chart headings using icons + text
    await expect(page.getByText(/ยอดขายตามวัน/i)).toBeVisible();
    await expect(page.getByText(/ช่วงเวลาทอง/i)).toBeVisible();
    await expect(page.getByText(/ยอดขายเติบโต/i)).toBeVisible();
  });
});
