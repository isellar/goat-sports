import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 * 
 * Combines clsx and tailwind-merge to handle conditional classes
 * and resolve Tailwind class conflicts properly.
 * 
 * @param inputs - Class values (strings, objects, arrays, etc.)
 * @returns Merged class string
 * 
 * @example
 * ```typescript
 * cn('base-class', condition && 'conditional-class', { 'object-class': true })
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

