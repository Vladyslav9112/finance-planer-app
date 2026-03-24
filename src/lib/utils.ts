import dayjs from "dayjs";
import { clsx, type ClassValue } from "clsx";

// ────────────────────────────────────────────────────────────────────────────────

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const formatCurrency = (amount: number, currency = "₴"): string => {
  return `${currency}${new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

export const formatDate = (date: string): string =>
  dayjs(date).format("DD.MM.YYYY");

export const formatDateTime = (date: string, time?: string): string => {
  if (time) return `${dayjs(date).format("DD.MM")} ${time}`;
  return dayjs(date).format("DD.MM.YYYY");
};

export const today = (): string => dayjs().format("YYYY-MM-DD");

export const dateFromDaysAgo = (days: number): string =>
  dayjs().subtract(days, "day").format("YYYY-MM-DD");

export const isInRange = (date: string, from: string, to: string): boolean =>
  date >= from && date <= to;

export const generateId = (): string => crypto.randomUUID();

export const truncate = (text: string, maxLen: number): string =>
  text.length > maxLen ? `${text.slice(0, maxLen)}…` : text;

export const getRelativeDate = (date: string): string => {
  const d = dayjs(date);
  const todayD = dayjs();
  if (d.isSame(todayD, "day")) return "Сьогодні";
  if (d.isSame(todayD.subtract(1, "day"), "day")) return "Вчора";
  if (d.isSame(todayD.add(1, "day"), "day")) return "Завтра";
  return formatDate(date);
};

export const sumArray = (arr: number[]): number =>
  arr.reduce((s, v) => s + v, 0);
