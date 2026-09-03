const monthNames = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function parseDate(value) {
  if (!value) return new Date();
  if (value instanceof Date) return new Date(value);

  const datePart = String(value).slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) return new Date(value);

  return new Date(year, month - 1, day);
}

export function startOfNaturalWeek(value = new Date()) {
  const date = parseDate(value);
  date.setHours(0, 0, 0, 0);

  const weekday = date.getDay();
  const diff = weekday === 0 ? -6 : 1 - weekday;
  date.setDate(date.getDate() + diff);

  return date;
}

export function toDateValue(value) {
  const date = parseDate(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDayMonthYear(value) {
  const date = parseDate(value);

  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatNaturalWeek(value) {
  const start = startOfNaturalWeek(value);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return `${formatDayMonthYear(start)} - ${formatDayMonthYear(end)}`;
}

export function getWeekOptions(center = new Date(), before = 8, after = 8) {
  const currentMonday = startOfNaturalWeek(center);

  return Array.from({ length: before + after + 1 }, (_, index) => {
    const date = new Date(currentMonday);
    date.setDate(currentMonday.getDate() + (index - before) * 7);

    return {
      value: toDateValue(date),
      label: formatNaturalWeek(date),
    };
  });
}
