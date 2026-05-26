export function subHours(date: Date, hours: number) {
  return new Date(date.getTime() - hours * 60 * 60 * 1000);
}

export function startOfHour(date: Date) {
  const value = new Date(date);
  value.setMinutes(0, 0, 0);
  return value;
}

