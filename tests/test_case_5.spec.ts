// Test Case 5
// Validates that generated random dates match the selected output format.
// The test iterates through all available formats, generates dates,
// and verifies that the output conforms to the expected patterns.

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
} from './helpers/dateGenerator';

// Based on the formats available in the generator UI,
// this test validates that generated dates match the selected output format.
test.setTimeout(60000); // Format loop can take longer due dynamic consent/ad overlays.
const formats = [
  'MM-DD-YYYY',
  'YYYY-MM-DD hh:mm:ss',
  'YYYY-DD-MM hh:mm:ss',
  'MM-DD-YYYY hh:mm:ss',
  'ISO 8601',
  'Year Month Date hh:mm:ss',
  'Year Date Month hh:mm:ss',
  'Month Date Year hh:mm:ss',
  'Custom date format',
];
// For custom date format, we will skip strict regex validation as the output can vary widely based on user input and may not follow 
// a predictable pattern.
const yearMonthDatePattern = /^\d{4} [A-Za-z]+ \d{1,2} \d{2}:\d{2}:\d{2}$/;
const yearDateMonthPattern = /^\d{4} \d{1,2} [A-Za-z]+ \d{2}:\d{2}:\d{2}$/;
// Each format is mapped to a corresponding regex pattern
// used to validate the generated output.
function getPattern(format: string): RegExp | null {
  switch (format) {
    case 'MM-DD-YYYY':
      return /^\d{2}-\d{2}-\d{4}$/;
    case 'YYYY-MM-DD hh:mm:ss':
      return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    case 'YYYY-DD-MM hh:mm:ss':
      return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    case 'MM-DD-YYYY hh:mm:ss':
      return /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/;
    case 'ISO 8601':
      return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/;
    case 'Year Month Date hh:mm:ss':
      return /^\d{4} [A-Za-z]+ \d{1,2} \d{2}:\d{2}:\d{2}$/;
    case 'Year Date Month hh:mm:ss':
      return yearDateMonthPattern;
    case 'Month Date Year hh:mm:ss':
      return /^[A-Za-z]+ \d{1,2} \d{4} \d{2}:\d{2}:\d{2}$/;
    case 'Custom date format':
      return null; // Skip validation for custom format
    default:
      throw new Error(`Unhandled format: ${format}`);
  }
}
// Note: The test will log warnings if the selected format does not appear to change the output as expected, 
// but it will not fail solely based on that. The primary assertion is that the output matches the expected pattern for the selected format.
test('should load page and generate custom date format', async ({ page }) => {
  await navigateToDateGenerator(page);
// Iterate through each format, select it, generate dates, and validate the output.
// test.step improves readability of Playwright HTML reports
// by clearly separating validation steps for each format.
  for (const format of formats) {
    await test.step(`Validate format: ${format}`, async () => {
      await page.locator('#format').selectOption(format);
      await clickGenerateRandomDate(page);

      const generatedDatesArray = await readGeneratedDates(page);

      expect(generatedDatesArray.length, `No dates generated for format "${format}"`).toBeGreaterThan(0);

      const pattern = getPattern(format);

      if (!pattern) {
        console.log(`Skipping strict regex validation for format: ${format}`);
        return;
      }

      const invalidDates = generatedDatesArray.filter((date) => !pattern.test(date));
// For the "Year Date Month hh:mm:ss" format, we will check if any output still matches the "Year Month Date" pattern, 
// which would indicate that the format selection might not be working as intended.
// Filter out any generated values that do not match the expected pattern.
      if (format === 'Year Date Month hh:mm:ss') {
        const stillYearMonthDate = generatedDatesArray.filter((date) => yearMonthDatePattern.test(date));
        if (stillYearMonthDate.length > 0) {
          console.warn(
            `Warning: selected format "${format}", but output still appears as "Year Month Date" for ${stillYearMonthDate.length} values.`
          );
        }
// This is a soft assertion to highlight potential issues with format selection without failing the test outright, 
// as there may be edge cases or fallback behaviors in the generator.
        expect(
          stillYearMonthDate,
          `Selected format "${format}" appears not to change output. Values still match "Year Month Date" format:\n${stillYearMonthDate.join('\n')}`
        ).toEqual([]);
      }
// Assert that all generated dates match the expected pattern for the selected format. 
// If any do not, the test will fail and provide details on which values were invalid.
      expect(
        invalidDates,
        `Format "${format}" validation failed. Invalid dates:\n${invalidDates.join('\n')}`
      ).toEqual([]);
    });
  }
});
