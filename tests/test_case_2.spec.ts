// Test Case 2 check if page is loading and generating random date button is working if end date is set to value lower than start date. 
// This test is basic and can be expanded with more assertions to verify the generated date format and content.
// e.g. check if generated date end date is 1999-12-31 and start date is 2020-01-01 and if the generated dates are in the correct format default is set to MM-DD-YYYY.
import { test, expect } from '@playwright/test';

const startDate = '2020-01-01';
const endDate = '1999-12-31';
const expectedCount = 20;

// Helper function to check if a date is within a specified range
function isDateInRange(dateStr: string, minIso: string, maxIso: string): boolean {
  const [month, day, year] = dateStr.trim().split('-');
  if (!month || !day || !year) return false;

  const isoDate = `${year}-${month}-${day}`;
  return isoDate >= minIso && isoDate <= maxIso;
}

test('test endDate lower than startDate generates valid dates', async ({ page }) => {
  await page.goto('https://codebeautify.org/generate-random-date');
  await page.locator('iframe[title="SP Consent Message"]').contentFrame().getByRole('button', { name: 'Accept' }).click()
  await page.locator('#count').fill(String(expectedCount));
  await page.locator('#start').fill(startDate);
  await page.locator('#end').fill(endDate);
  await page.getByRole('button', { name: 'Generate Random Date' }).click();

  const generatedDates = await page
    .getByRole('textbox', { name: 'Generated Random Integer' })
    .inputValue();

  const generatedDatesArray = generatedDates
    .split('\n')
    .map((d) => d.trim())
    .filter(Boolean);

  // Normalize range since endDate < startDate
const minIso = startDate
const maxIso = endDate

  // Validate count
  expect(
    generatedDatesArray.length,
    `Expected ${expectedCount} dates, got ${generatedDatesArray.length}`
  ).toBe(expectedCount);

  // Validate format MM-DD-YYYY
  const invalidFormat = generatedDatesArray.filter((date) => !/^\d{2}-\d{2}-\d{4}$/.test(date));
  try{
  expect(
    invalidFormat,
    `Invalid MM-DD-YYYY format (${invalidFormat.length}):\n${invalidFormat.join('\n')}`
    ).toEqual([]);
} catch (error) {
  console.error('Format validation error:', error);
  console.error('Invalid format values:', invalidFormat);
}

  // Validate date range
  const outOfRange = generatedDatesArray.filter((date) => !isDateInRange(date, minIso, maxIso));
  expect(
    outOfRange,
    `Out-of-range values (${outOfRange.length}) for incorrect range ${minIso}..${maxIso}:\n${outOfRange.join('\n')}`
  ).toEqual([]);

  console.log(`✓ All ${expectedCount} dates are valid format and within range ${minIso}..${maxIso}`);
});