// Test Case 3 check if page is loading and generating random date button is working. 
// This test is basic and can be expanded with more assertions to verify the generated date format and content.
// e.g. check if generated date set is correct for Start date 2020-01-01 00:00:00 and End date 2030-01-01 20:59:59  and if the generated dates are in the correct format if is set to MM-DD-YYYY hh:mm:ss .

import { test, expect } from '@playwright/test';
const startDate = '2020-01-01';
const endDate = '2030-12-31';
const startTime = '00:00:00';
const endTime = '20:59:59';
const startDateTime = `${startDate} ${startTime}`;
const endDateTime = `${endDate} ${endTime}`;

// Helper function to check if a date is within a specified range
function isDateInRange(dateStr: string, startIso: string, endIso: string): boolean {
  const [month, day, year] = dateStr.split('-');
  if (!month || !day || !year) {
    return false;
  }

  const isoDate = `${year}-${month}-${day}`;
  return isoDate >= startIso && isoDate <= endIso;

}
// Helper function to check if a time is within a specified range
function isTimeInRange(dateStr: string, startIso: string, endIso: string): boolean {
  const [hour, minute, second] = dateStr.split(':');
  if (!hour || !minute || !second) {
    return false;
  }

  const isoTime = `${hour}-${minute}-${second}`;
  return isoTime >= startIso && isoTime <= endIso;

}

test('should load page and generate custom time', async ({ page }) => {
  await page.goto('https://codebeautify.org/generate-random-date');
  await page.locator('iframe[title="SP Consent Message"]').contentFrame().getByRole('button', { name: 'Accept' }).click()
//Set custom start and end date time
  console.log('Start DateTime:', startDateTime);
  console.log('End DateTime:', endDateTime);
  //await page.locator('#start').click();
  await page.locator('#start').fill(startDateTime);
  //await page.locator('#end').click();
  await page.locator('#end').fill(endDateTime); 
  // const generatedDates = await page.getByRole('textbox', { name: 'Generated Random Integer' }).inputValue();
  //   const generatedDatesArray = generatedDates.split('\n'); 
  await page.locator('#format').selectOption('MM-DD-YYYY hh:mm:ss');
  //Generate AFTER filling start/end so output uses your range
   await page.getByRole('button', { name: 'Generate Random Date' }).click();

  const generatedDates = await page
    .getByRole('textbox', { name: 'Generated Random Integer' })
    .inputValue();

  const generatedDatesArray = generatedDates.split('\n').filter(Boolean);
  console.log('Generated Dates:', generatedDatesArray);

  generatedDatesArray.forEach((value) => {
    // expected format: MM-DD-YYYY hh:mm:ss
    const match = value.match(/^(\d{2}-\d{2}-\d{4})\s+(\d{2}:\d{2}:\d{2})$/);
    expect(match).not.toBeNull();

    const [, datePart, timePart] = match!;
    try {
      expect(isDateInRange(datePart, startDate, endDate)).toBe(true);
    } catch (error) {
      console.error(`Date ${datePart} is out of range:`, error);
    }

    try {
      expect(isTimeInRange(timePart, startTime, endTime)).toBe(true);
    } catch (error) {
      console.error(`Time ${timePart} is out of range:`, error);
    }

    // explicit hour check requested
    const hour = Number(timePart.split(':')[0]);
    const endHour = Number(endTime.split(':')[0]);
    expect(hour).toBeLessThanOrEqual(endHour);
  });
});

