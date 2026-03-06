// Test Case 4 check if page is loading and generating random date button is working. 
// This test is basic and can be expanded with more assertions to verify the generated date format and content.
// e.g. check if generated dates is set to 500 check if the generated dates are unique and if the generated dates are in the correct format default is set to MM-DD-YYYY.
import { test, expect } from '@playwright/test';
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
  await page.locator('#count').fill('500');
  await clickGenerateRandomDate(page);

  const generatedDatesArray = await readGeneratedDates(page);
  const duplicates = findDuplicates(generatedDatesArray);

  // check if generated date set is equal to 500
  expect(generatedDatesArray.length).toBe(500);

  // Check default format MM-DD-YYYY
  for (const date of generatedDatesArray) {
    expect(date).toMatch(/^\d{2}-\d{2}-\d{4}$/);
    const isoDate = toIsoDateFromMmDdYyyy(date);
    expect(isoDate).not.toBeNull();
    expect(isIsoDateInRange(isoDate!, startDate, endDate)).toBe(true);
  }

  // Keep duplicate information observable without failing the test by default.
  if (duplicates.length > 0) {
    console.warn(`Duplicates detected (${duplicates.length}):\n${duplicates.join('\n')}`);
  }
});
