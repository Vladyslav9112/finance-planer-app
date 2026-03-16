export const cn = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(" ");

export const formatMoney = (value: number) =>
  new Intl.NumberFormat("uk-UA", { style: "currency", currency: "UAH", maximumFractionDigits: 0 }).format(value);

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const today = () => new Date().toISOString().slice(0, 10);

