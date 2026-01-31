import type { TimeObject } from "@/domain/models/Schedule";

/**
 * Parses a time string in "HH:mm:ss" format into a TimeObject.
 * @param timeStr The time string to parse (e.g., "09:00:00")
 * @returns A TimeObject with hour, minute, second, and nano set to 0.
 */
export const parseTimeString = (timeStr: string): TimeObject => {
  if (!timeStr) {
    return { hour: 0, minute: 0, second: 0, nano: 0 };
  }
  
  const parts = timeStr.toString().split(':');
  const hour = parseInt(parts[0] || '0', 10);
  const minute = parseInt(parts[1] || '0', 10);
  const second = parseInt(parts[2] || '0', 10);

  return { 
    hour, 
    minute, 
    second, 
    nano: 0 
  };
};
