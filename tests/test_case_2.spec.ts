// Test Case 2
// Validate generator behaviour when the end date is lower than the start date.
// The test verifies that the generator does not produce values outside the valid range.

import { test, expect } from '@playwright/test';
// Helper functions used across tests to:
// - navigate to the date generator page
// - trigger date generation
// - read generated output
// This avoids code duplication and improves test readability.

import {
  clickGenerateRandomDate,
  navigateToDateGenerator,
  readGeneratedDates,
  toIsoDateFromMmDdYyyy,
} from './helpers/dateGenerator';

//Define date boundaries used for validation in this test case.
// Configure generator with a reversed date range (end date earlier than start date).
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

// Validate that the generator returns the expected number of values.
  expect(
    generatedDatesArray.length,
    `Expected ${expectedCount} dates, got ${generatedDatesArray.length}`
  ).toBe(expectedCount);

  // Validate that generated dates follow the default format (MM-DD-YYYY).
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
// Detect values that fall below the defined startDate.
// Such values would indicate incorrect handling of reversed date ranges.
  expect(
    lowerThanStartDate,
    `Generator returned values lower than startDate (${startDate}) when endDate is lower (${endDate}):\n${lowerThanStartDate.join('\n')}`
  ).toEqual([]);
});