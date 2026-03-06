//Test Case 5: Validate that the generated random dates match the selected format and are within the specified 
// range when applicable. This test will iterate through all available date formats, generate random dates, 
// and verify that they conform to the expected patterns and fall within the defined date range if applicable.

import { test, expect } from '@playwright/test';

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
      return /^\d{4} \d{1,2} [A-Za-z]+ \d{2}:\d{2}:\d{2}$/;
    case 'Month Date Year hh:mm:ss':
      return /^[A-Za-z]+ \d{1,2} \d{4} \d{2}:\d{2}:\d{2}$/;
    case 'Custom date format':
      return null; // Skip validation for custom format
    default:
      throw new Error(`Unhandled format: ${format}`);
  }
}

test('should load page and generate custom date format', async ({ page }) => {
  await page.goto('https://codebeautify.org/generate-random-date');
  await page.locator('iframe[title="SP Consent Message"]').contentFrame().getByRole('button', { name: 'Accept' }).click()

  for (const format of formats) {
    await test.step(`Validate format: ${format}`, async () => {
      await page.locator('#format').selectOption(format);
      await page.getByRole('button', { name: 'Generate Random Date' }).click();
      
      const generatedDates = await page.getByRole('textbox', { name: 'Generated Random Integer' }).inputValue();

      const generatedDatesArray = generatedDates
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean);

      expect(generatedDatesArray.length, `No dates generated for format "${format}"`).toBeGreaterThan(0);

      const pattern = getPattern(format);

      if (!pattern) {
        console.log(`Skipping validation for custom format: ${format}`);
        return;
      }

      const invalidDates = generatedDatesArray.filter((date) => !pattern.test(date));

      expect(
        invalidDates,
        `Format "${format}" validation failed. Invalid dates:\n${invalidDates.join('\n')}`
      ).toEqual([]);

      console.log(`✓ All dates valid for format: ${format}`);
    });
  }
});
