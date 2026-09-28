export const formatPeso = (amount) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(amount) || 0);

export const formatLongDate = (date = new Date()) =>
  new Intl.DateTimeFormat("en-PH", { dateStyle: "long" }).format(date);