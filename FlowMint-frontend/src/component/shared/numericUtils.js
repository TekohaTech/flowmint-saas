/**
 * Numeric input utilities for FlowMint forms.
 * Prevents non-numeric characters at keystroke level.
 */

/**
 * Only allows digits (0-9). Blocks letters, symbols, and special chars.
 * Use on onChange for integer fields (telefono, DNI, duracion).
 */
export const onlyDigits = (value) => {
  return value.replace(/[^0-9]/g, "");
};

/**
 * Allows digits and one decimal point. For future price fields with cents.
 * Use on onChange for float fields (precio).
 */
export const onlyDecimal = (value) => {
  const cleaned = value.replace(/[^0-9.]/g, "");
  // Prevent multiple dots
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    return parts[0] + "." + parts.slice(1).join("");
  }
  return cleaned;
};

/**
 * onKeyDown handler that blocks non-numeric keystrokes.
 * Attach to <input onKeyDown={blockNonNumeric} /> for extra safety.
 */
export const blockNonNumeric = (e) => {
  const blocked = [
    "e", "E", "+", "-", "ArrowUp", "ArrowDown",
  ];
  if (blocked.includes(e.key)) {
    e.preventDefault();
  }
};

/**
 * Format number as Argentine peso: 3000 -> "3.000"
 * For display only, not input.
 */
export const formatArNumber = (num) => {
  if (num == null || isNaN(num)) return "0";
  return Number(num).toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

/**
 * Format as peso currency: 3000 -> "$3.000"
 */
export const formatPeso = (num) => {
  return `$${formatArNumber(num)}`;
};
