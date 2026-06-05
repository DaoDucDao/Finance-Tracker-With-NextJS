import { differenceInCalendarDays, format, parseISO } from "date-fns";

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (dateStr: string): string =>
  format(parseISO(dateStr), "MMM d, yyyy");

const getMonthKey = (dateStr: string): string =>
  format(parseISO(dateStr), "yyyy-MM");

const daysUntil = (dateStr: string): number =>
  differenceInCalendarDays(parseISO(dateStr), new Date());

const getMonthLabel = (monthKey: string): string => {
  const [year, month] = monthKey.split("-");

  return format(new Date(Number(year), Number(month) - 1), "MMM yyyy");
};

export { formatCurrency, formatDate, getMonthKey, getMonthLabel, daysUntil };
