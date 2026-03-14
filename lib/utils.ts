export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatWeight(value: number) {
  return `${new Intl.NumberFormat("en-US").format(value)} lbs`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function toNumber(value: FormDataEntryValue | null) {
  return Number.parseFloat(String(value ?? ""));
}
