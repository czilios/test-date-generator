// Test Case 3 check if page is loading and generating random date button is working. 
// This test is basic and can be expanded with more assertions to verify the generated date format and content.
// e.g. check if generated date set is correct for Start date 2020-01-01 00:00:00 and End date 2030-01-01 20:59:59  and if the generated dates are in the correct format if is set to MM-DD-YYYY hh:mm:ss .

import { test, expect } from '@playwright/test';
import {
  clickGenerateRandomDate,
  isIsoDateInRange,
  isTimeInRange,
  navigateToDateGenerator,
  readGeneratedDates,
  toIsoDateFromMmDdYyyy,
} from './helpers/dateGenerator';

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

  const generatedDatesArray = await readGeneratedDates(page);
  expect(generatedDatesArray.length, 'No generated dates found in output').toBeGreaterThan(0);

  const invalidFormatValues: string[] = [];
  const outOfRangeDates: string[] = [];
  const outOfRangeTimes: string[] = [];

  for (const value of generatedDatesArray) {
    // expected format: MM-DD-YYYY hh:mm:ss
    const match = value.match(/^(\d{2}-\d{2}-\d{4})\s+(\d{2}:\d{2}:\d{2})$/);
    if (!match) {
      invalidFormatValues.push(value);
      continue;
    }

    const [, datePart, timePart] = match;
    const isoDate = toIsoDateFromMmDdYyyy(datePart);
    if (!isoDate) {
      invalidFormatValues.push(value);
      continue;
    }

    if (!isIsoDateInRange(isoDate, startDate, endDate)) {
      outOfRangeDates.push(`${datePart} ${timePart}`);
    }

    const isWithinRange = isTimeInRange(timePart, startTime, endTime);
    if (!isWithinRange) {
      outOfRangeTimes.push(`${datePart} ${timePart}`);
    }
  }

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

