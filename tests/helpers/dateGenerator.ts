import { expect, Page } from '@playwright/test';

export const DATE_GENERATOR_URL = 'https://codebeautify.org/generate-random-date';

export async function navigateToDateGenerator(page: Page): Promise<void> {
  await page.goto(DATE_GENERATOR_URL, { waitUntil: 'domcontentloaded' });
  await acceptConsentIfVisible(page);
  await expect(page.getByRole('button', { name: 'Generate Random Date' })).toBeVisible();
}

export async function acceptConsentIfVisible(page: Page): Promise<void> {
  const consentFrame = page.frameLocator('iframe[title="SP Consent Message"]');
  const acceptButton = consentFrame.getByRole('button', { name: 'Accept' });

  // The consent prompt is geo/browser dependent. Click only if it appears.
  if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await acceptButton.click();
  }
}

export async function readGeneratedDates(page: Page): Promise<string[]> {
  await expect(page.getByRole('textbox', { name: 'Generated Random Integer' })).toBeVisible();
  const output = await page
    .getByRole('textbox', { name: 'Generated Random Integer' })
    .inputValue({ timeout: 10000 });

  return output
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function clickGenerateRandomDate(page: Page): Promise<void> {
  const button = page.getByRole('button', { name: 'Generate Random Date' });
  await acceptConsentIfVisible(page);

  try {
    await button.click({ timeout: 10000 });
  } catch {
    await acceptConsentIfVisible(page);
    await button.click({ timeout: 10000 });
  }
}

export function toIsoDateFromMmDdYyyy(dateStr: string): string | null {
  const match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) {
    return null;
  }

  const [, month, day, year] = match;
  return `${year}-${month}-${day}`;
}

export function isIsoDateInRange(isoDate: string, startIso: string, endIso: string): boolean {
  const min = startIso <= endIso ? startIso : endIso;
  const max = startIso <= endIso ? endIso : startIso;
  return isoDate >= min && isoDate <= max;
}

export function isTimeInRange(time: string, startTime: string, endTime: string): boolean {
  const normalize = (value: string): number => {
    const parts = value.split(':').map((v) => Number(v));
    if (parts.length !== 3 || parts.some((v) => Number.isNaN(v))) {
      return Number.NaN;
    }

    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  };

  const current = normalize(time);
  const start = normalize(startTime);
  const end = normalize(endTime);

  if ([current, start, end].some(Number.isNaN)) {
    return false;
  }

  const min = Math.min(start, end);
  const max = Math.max(start, end);
  return current >= min && current <= max;
}