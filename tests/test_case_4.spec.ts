// Test Case 4
// Validate generator behaviour when generating a large dataset (500 dates).
// The test verifies:
// - correct number of generated dates
// - correct default date format (MM-DD-YYYY)
// - that generated dates fall within a valid date range
// - potential duplicate values in the generated dataset

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


test.setTimeout(30000); // Set timeout to 30 seconds for all tests in this file
const startDate = '2020-01-01';
const endDate = '2099-12-31';

// Utility function used to detect duplicate values in the generated dataset.
// When generating large datasets, random generators may occasionally return duplicate values.
// Instead of failing the test immediately, duplicates are collected and reported.
function findDuplicates(values: string[]): string[] {
  const counts = new Map<string, number>();

  for (const value of values) {
    const key = value.trim();
    if (!key) continue; // ignore empty lines
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value, count]) => `${value} (x${count})`);
}
test('test check duplicated dates for set 500 generated dates', async ({ page }) => {
  await navigateToDateGenerator(page);
  // Request generation of a large dataset (500 dates) to evaluate generator behaviour under higher load.
  await page.locator('#count').fill('500');
  await clickGenerateRandomDate(page);
// Read generated output from the generator and check for duplicate values.
  const generatedDatesArray = await readGeneratedDates(page);
  const duplicates = findDuplicates(generatedDatesArray);

  // Check if generated date set is equal to 500
  expect(generatedDatesArray.length).toBe(500);

// Validate that generated dates follow the default output format (MM-DD-YYYY).
  for (const date of generatedDatesArray) {
    expect(date).toMatch(/^\d{2}-\d{2}-\d{4}$/);
    const isoDate = toIsoDateFromMmDdYyyy(date);
    expect(isoDate).not.toBeNull();
    expect(isIsoDateInRange(isoDate!, startDate, endDate)).toBe(true);
  }

// Duplicate values are reported as warnings instead of failing the test.
// This allows visibility into generator behaviour without making the test unstable.
  if (duplicates.length > 0) {
    console.warn(`Duplicates detected (${duplicates.length}):\n${duplicates.join('\n')}`);
  }
});
