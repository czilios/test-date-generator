// Test Case 4 check if page is loading and generating random date button is working. 
// This test is basic and can be expanded with more assertions to verify the generated date format and content.
// e.g. check if generated dates is set to 500 check if the generated dates are unique and if the generated dates are in the correct format default is set to MM-DD-YYYY.
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
test('test', async ({ page }) => {
  await page.goto('https://codebeautify.org/generate-random-date');
  await page.locator('#count').fill('500');
  await page.getByRole('button', { name: 'Generate Random Date' }).click();

  const generatedDates = await page.getByRole('textbox', { name: 'Generated Random Integer' }).inputValue();
  const generatedDatesArray = generatedDates
    .split('\n')
    .map((d) => d.trim())
    .filter(Boolean);
    const duplicates = findDuplicates(generatedDatesArray);
    if (duplicates.length > 0) {
        console.log('Duplicate generated dates found:');
        console.log(duplicates.join('\n'));
    } else 
        {console.log('No duplicates found in generatedDatesArray.');
            
        } 
    // check if generated date set is equal to 500
    expect(generatedDatesArray.length).toBe(500);
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
