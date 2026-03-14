// Test Case 3
// Validate generator behaviour when custom date-time boundaries are defined.
// The test verifies that generated values:
// - match the selected format (MM-DD-YYYY hh:mm:ss)
// - fall within the specified date range
// - fall within the specified time range

import { test, expect } from '@playwright/test';
// Helper functions used across tests to:
// - navigate to the date generator page
// - trigger date generation
// - read generated output
// This avoids code duplication and improves test readability.

import {
  clickGenerateRandomDate,
  isIsoDateInRange,
  isTimeInRange,
  navigateToDateGenerator,
  readGeneratedDates,
  toIsoDateFromMmDdYyyy,
} from './helpers/dateGenerator';
// Define date and time boundaries used for validation in this test case. The generator should produce values that fall within these boundaries.

test.setTimeout(30000); // Set timeout to 30 seconds for all tests in this file
const startDate = '2020-01-01';
const endDate = '2030-12-31';
const startTime = '00:00:00';
const endTime = '20:59:59';
const startDateTime = `${startDate} ${startTime}`;
const endDateTime = `${endDate} ${endTime}`;

test('should load page and generate custom time', async ({ page }) => {
  await navigateToDateGenerator(page);
  // Set custom start and end date-time boundaries.
  await page.locator('#start').fill(startDateTime);
  await page.locator('#end').fill(endDateTime);
  await page.locator('#format').selectOption('MM-DD-YYYY hh:mm:ss');
  await clickGenerateRandomDate(page);
// Read generated output and validate format and content.
  const generatedDatesArray = await readGeneratedDates(page);
//Expect at least one generated date to be present in the output before further validations.
  expect(generatedDatesArray.length, 'No generated dates found in output').toBeGreaterThan(0);

  const invalidFormatValues: string[] = [];
  const outOfRangeDates: string[] = [];
  const outOfRangeTimes: string[] = [];
//Loop through generated values to validate format and content. For each value, 
// check if it matches the expected format (MM-DD-YYYY hh:mm:ss).
  for (const value of generatedDatesArray) {
    // expected format: MM-DD-YYYY hh:mm:ss
    const match = value.match(/^(\d{2}-\d{2}-\d{4})\s+(\d{2}:\d{2}:\d{2})$/);
    if (!match) {
      invalidFormatValues.push(value);
      continue;
    }
// match groups: [full match, date part, time part]
    const [, datePart, timePart] = match;
    const isoDate = toIsoDateFromMmDdYyyy(datePart);
    if (!isoDate) {
      invalidFormatValues.push(value);
      continue;
    }
// Validate that the date part falls within the specified date range.
    if (!isIsoDateInRange(isoDate, startDate, endDate)) {
      outOfRangeDates.push(`${datePart} ${timePart}`);
    }
// Validate that the time part falls within the specified time range.
    const isWithinRange = isTimeInRange(timePart, startTime, endTime);
    if (!isWithinRange) {
      outOfRangeTimes.push(`${datePart} ${timePart}`);
    }
  }
// Assertions to report any format issues or out-of-range values found during validation.
  expect(
    invalidFormatValues,
    `Found values that do not match MM-DD-YYYY hh:mm:ss:\n${invalidFormatValues.join('\n')}`
  ).toEqual([]);

  expect(
    outOfRangeDates,
    `Found generated dates outside expected range ${startDate}..${endDate}:\n${outOfRangeDates.join('\n')}`
  ).toEqual([]);

  expect(
    outOfRangeTimes,
    `Found generated times outside expected range ${startTime}..${endTime}:\n${outOfRangeTimes.join('\n')}`
  ).toEqual([]);
});

