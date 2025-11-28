/**
 * Validation utilities for task operations
 */

import { MCPError, ErrorCode } from '../../types/index';
import { validateId as validateSharedId } from '../../utils/validation';

/**
 * Validates that a date string is in the specific ISO 8601 format required by Vikunja
 * Format: YYYY-MM-DDTHH:mm:ss.sssZ (with milliseconds)
 */
export function validateDateString(date: string, fieldName: string): void {
  // Check if it matches the specific format with milliseconds
  const isoWithMillisecondsRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  
  if (!isoWithMillisecondsRegex.test(date)) {
    throw new MCPError(
      ErrorCode.VALIDATION_ERROR,
      `${fieldName} must be in ISO 8601 format with milliseconds: YYYY-MM-DDTHH:mm:ss.sssZ. Example: 2025-10-30T04:05:22.422Z. Received: ${date}`,
    );
  }
  
  // Additional validation: ensure it's a valid date
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    throw new MCPError(
      ErrorCode.VALIDATION_ERROR,
      `${fieldName} must be a valid date. Received: ${date}`,
    );
  }
}

/**
 * Formats a Date object to the required ISO format with milliseconds
 */
export function formatDateToISO(date: Date): string {
  // Get the ISO string and ensure it has milliseconds
  const isoString = date.toISOString();
  
  // The toISOString() already returns the correct format: YYYY-MM-DDTHH:mm:ss.sssZ
  return isoString;
}

/**
 * Creates a date string in the required format for current time
 */
export function getCurrentTimeString(): string {
  return formatDateToISO(new Date());
}

/**
 * Creates a date string in the required format for a specific date
 */
export function createDateString(year: number, month: number, day: number, hour: number = 0, minute: number = 0, second: number = 0): string {
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  return formatDateToISO(date);
}

/**
 * Validates that an ID is a positive integer
 * @deprecated Use validateSharedId from '../../utils/validation' instead
 */
export const validateId = validateSharedId;

/**
 * Convert repeat configuration from user-friendly format to Vikunja API format
 *
 * Vikunja API expects:
 * - repeat_after: time in seconds
 * - repeat_mode: 0 = default (use repeat_after), 1 = monthly, 2 = from current date
 *
 * We accept:
 * - repeatAfter: number (interpreted based on repeatMode)
 * - repeatMode: 'day' | 'week' | 'month' | 'year'
 */
export function convertRepeatConfiguration(
  repeatAfter?: number,
  repeatMode?: 'day' | 'week' | 'month' | 'year',
): { repeat_after?: number; repeat_mode?: number } {
  const result: { repeat_after?: number; repeat_mode?: number } = {};

  if (repeatMode === 'month') {
    // For monthly repeat, use repeat_mode = 1 (ignores repeat_after)
    result.repeat_mode = 1;
    // Still set repeat_after for consistency, though it will be ignored
    if (repeatAfter !== undefined) {
      result.repeat_after = repeatAfter * 30 * 24 * 60 * 60; // Approximate month in seconds
    }
  } else if (repeatAfter !== undefined) {
    // For other modes, use repeat_mode = 0 and convert to seconds
    result.repeat_mode = 0;

    switch (repeatMode) {
      case 'day':
        result.repeat_after = repeatAfter * 24 * 60 * 60; // Days to seconds
        break;
      case 'week':
        result.repeat_after = repeatAfter * 7 * 24 * 60 * 60; // Weeks to seconds
        break;
      case 'year':
        result.repeat_after = repeatAfter * 365 * 24 * 60 * 60; // Years to seconds (approximate)
        break;
      default:
        // If no mode specified, assume the value is already in seconds
        result.repeat_after = repeatAfter;
    }
  }

  return result;
}

/**
 * Process an array in batches
 */
export async function processBatches<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R[]>,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await processor(batch);
    results.push(...batchResults);
  }
  return results;
}
