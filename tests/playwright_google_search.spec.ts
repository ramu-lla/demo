import { test, expect } from '@playwright/test';

test('Google search for Playwright scenarios', async ({ page }) => {
  // Navigate to Google
  await page.goto('https://www.google.com/');

  // Handle consent popup if present
  try {
    const acceptBtn = page.locator('button:has-text("I agree"), button:has-text("Accept all")').first();
    if (await acceptBtn.count() > 0) {
      await acceptBtn.click();
    }
  } catch (e) {
    // ignore
  }

  // Fill search box and submit
  await page.fill('input[name="q"]', 'Playwright scenarios');
  await page.keyboard.press('Enter');

  // Wait for results
  await page.waitForSelector('#search, text=Playwright', { timeout: 5000 }).catch(() => {});

  // Basic assertion: ensure results title or results exist
  const title = await page.title();
  // Not strict—some locales may change title formatting
  expect(title.toLowerCase()).toContain('playwright');

  // Close browser context explicitly (test runner will normally handle cleanup)
  await page.context().close();
});
