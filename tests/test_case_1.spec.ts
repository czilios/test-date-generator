// Test Case 1 check if page is loading and generating random date button is working. 
// This test is basic and can be expanded with more assertions to verify the generated date format and content.
// e.g. check if generated date set is equal to 10, 20 ect and if the generated dates are in the correct format default is set to MM-DD-YYYY.
import { test, expect } from '@playwright/test';
const startDate = '2020-01-01';
const endDate = '2099-12-31';
// Helper function to check if a date is within a specified range
function isDateInRange(dateStr: string, startIso: string, endIso: string): boolean {
  const [month, day, year] = dateStr.split('-');
  if (!month || !day || !year) {
    return false;
  }

  const isoDate = `${year}-${month}-${day}`;
  return isoDate >= startIso && isoDate <= endIso;
}

test('test', async ({ page }) => {
  await page.goto('https://codebeautify.org/generate-random-date');
  //await page.locator('#count').click();
  await page.locator('#count').fill('20');
  await page.getByRole('button', { name: 'Generate Random Date' }).click();

  const generatedDates = await page.getByRole('textbox', { name: 'Generated Random Integer' }).inputValue();
    const generatedDatesArray = generatedDates.split('\n');
    // check if generated date set is equal to 20
    expect(generatedDatesArray.length).toBe(20);
    // Check default format MM-DD-YYYY
   generatedDatesArray.forEach(date => {
      expect(date).toMatch(/^\d{2}-\d{2}-\d{4}$/);  
      try {
        expect(isDateInRange(date, startDate, endDate)).toBe(true);
      } catch (error) {
        console.error(`Date ${date} is out of range:`, error);
      }
    });

    console.log(generatedDatesArray);
    console.log('All generated dates are in the correct format and within the specified range:', startDate,'and', endDate, generatedDatesArray.every(date => isDateInRange(date, startDate, endDate)));
   
});