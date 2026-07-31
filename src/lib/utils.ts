import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes safely.
 * 
 * clsx: Handles conditional classes (e.g., { 'bg-red': isError })
 * twMerge: Handles Tailwind conflict resolution (e.g., 'px-2 px-4' becomes 'px-4')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}