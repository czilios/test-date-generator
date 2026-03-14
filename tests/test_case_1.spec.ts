// Test Case 1
// Validate basic generator functionality.
// The test verifies that the generator returns the requested number of dates
// and that generated values follow the default format (MM-DD-YYYY).
import { test, expect } from '@playwright/test';
// Helper functions used across tests to:
// - navigate to the date generator page
// - trigger date generation
// - read generated output
// This avoids code duplication and improves test readability.

import {
  clickGenerateRandomDate,
  isIsoDateInRange,
  navigateToDateGenerator,
  readGeneratedDates,
  toIsoDateFromMmDdYyyy,
} from './helpers/dateGenerator';
// Define date and time boundaries used for validation in this test case.
test.setTimeout(30000); // Set timeout to 30 seconds for all tests in this file
const startDate = '2020-01-01';
const endDate = '2099-12-31';

test('test count if number of generated dates is correct', async ({ page }) => {

  await test.step('Navigate to generator page', async () => {
    await navigateToDateGenerator(page);
  });

  await test.step('Generate 20 random dates', async () => {
    await page.locator('#count').fill('20');
    await clickGenerateRandomDate(page);
  });

  const generatedDatesArray = await readGeneratedDates(page);

// Validate that the generator returns the expected number of values.
  await test.step('Validate number of generated dates', async () => {
    expect(generatedDatesArray.length).toBe(20);
  });

  // Validate that generated dates follow the default format (MM-DD-YYYY) and fall within the specified range.
  await test.step('Validate format and range', async () => {
    for (const date of generatedDatesArray) {
      expect(date).toMatch(/^\d{2}-\d{2}-\d{4}$/);
      
      const isoDate = toIsoDateFromMmDdYyyy(date);
      expect(isoDate).not.toBeNull();
      expect(isIsoDateInRange(isoDate!, startDate, endDate)).toBe(true);
    }
  });

});