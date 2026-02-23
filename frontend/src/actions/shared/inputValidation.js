export function limitTextLength(value, maxLength) {
  if (value == null) return "";
  return String(value).slice(0, maxLength);
}

export function clampNumberInput(value, options = {}) {
  const {
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
    integer = false,
    allowEmpty = true,
    decimals = null,
  } = options;

  const raw = String(value ?? "");
  if (raw === "") return allowEmpty ? "" : String(min);

  const normalized = raw.replace(",", ".");
  const num = Number(normalized);
  if (Number.isNaN(num)) return allowEmpty ? "" : String(min);

  let clamped = Math.min(Math.max(num, min), max);
  if (integer) {
    clamped = Math.round(clamped);
  } else if (Number.isInteger(decimals) && decimals >= 0) {
    clamped = Number(clamped.toFixed(decimals));
  }

  return String(clamped);
}
