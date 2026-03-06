// Test Case 2 check if page is loading and generating random date button is working if end date is set to value lower than start date. 
// This test is basic and can be expanded with more assertions to verify the generated date format and content.
// e.g. check if generated date end date is 1999-12-31 and start date is 2020-01-01 and if the generated dates are in the correct format default is set to MM-DD-YYYY.
import { test, expect } from '@playwright/test';
import {
  clickGenerateRandomDate,
  navigateToDateGenerator,
  readGeneratedDates,
  toIsoDateFromMmDdYyyy,
} from './helpers/dateGenerator';

test.setTimeout(30000); // Set timeout to 30 seconds for all tests in this file
const startDate = '2020-01-01';
const endDate = '1999-12-31';
const expectedCount = 20;

test('test endDate lower than startDate should not generate dates lower than startDate', async ({ page }) => {
  await navigateToDateGenerator(page);
  await page.locator('#count').fill(String(expectedCount));
  await page.locator('#start').fill(startDate);
  await page.locator('#end').fill(endDate);
  await clickGenerateRandomDate(page);

  const generatedDatesArray = await readGeneratedDates(page);

  // Validate count
  expect(
    generatedDatesArray.length,
    `Expected ${expectedCount} dates, got ${generatedDatesArray.length}`
  ).toBe(expectedCount);

  // Validate format MM-DD-YYYY
  const invalidFormat = generatedDatesArray.filter((date) => !/^\d{2}-\d{2}-\d{4}$/.test(date));
  expect(
    invalidFormat,
    `Invalid MM-DD-YYYY format (${invalidFormat.length}):\n${invalidFormat.join('\n')}`
  ).toEqual([]);

  // For reversed range input, enforce that generated dates must not go below startDate.
  const lowerThanStartDate = generatedDatesArray.filter((date) => {
    const iso = toIsoDateFromMmDdYyyy(date);
    return !iso || iso < startDate;
  });

  expect(
    lowerThanStartDate,
    `Generator returned values lower than startDate (${startDate}) when endDate is lower (${endDate}):\n${lowerThanStartDate.join('\n')}`
  ).toEqual([]);
});