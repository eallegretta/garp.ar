export function formatMoney(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function parseMoney(value) {
  const cleanValue = value.replace(/[^\d]/g, "");
  return cleanValue ? Number(cleanValue) : 0;
}
