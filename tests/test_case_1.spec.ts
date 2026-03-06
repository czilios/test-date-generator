// Test Case 1 check if page is loading and generating random date button is working. 
// This test is basic and can be expanded with more assertions to verify the generated date format and content.
// e.g. check if generated date set is equal to 10, 20 ect and if the generated dates are in the correct format default is set to MM-DD-YYYY.
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

test('test count if number of generated dates is correct', async ({ page }) => {
  await navigateToDateGenerator(page);
  await page.locator('#count').fill('20', { timeout: 5000 });
  await clickGenerateRandomDate(page);

  const generatedDatesArray = await readGeneratedDates(page);

  // check if generated date set is equal to 20
  expect(generatedDatesArray.length).toBe(20);

  // Check default format MM-DD-YYYY and range
  for (const date of generatedDatesArray) {
    expect(date).toMatch(/^\d{2}-\d{2}-\d{4}$/);
    const isoDate = toIsoDateFromMmDdYyyy(date);
    expect(isoDate).not.toBeNull();
    expect(isIsoDateInRange(isoDate!, startDate, endDate)).toBe(true);
  }
});