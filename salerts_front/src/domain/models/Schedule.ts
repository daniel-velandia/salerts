export interface TimeObject {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface Schedule {
  id: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface ScheduleInput {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}
