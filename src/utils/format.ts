const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const getMonthKey = (dateStr: string): string => {
  const date = new Date(dateStr);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const daysUntil = (dateStr: string): number => {
  const target = new Date(dateStr).getTime();
  const now = new Date().getTime();

  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
};

const getMonthLabel = (monthKey: string): string => {
  const [year, month] = monthKey.split("-");

  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

export { formatCurrency, formatDate, getMonthKey, getMonthLabel, daysUntil };
