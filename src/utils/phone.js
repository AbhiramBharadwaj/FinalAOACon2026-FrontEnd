export const normalizeIndianPhone = (value) => {
  const digits = String(value || '').replace(/\D/g, '');

  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }

  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }

  return digits;
};

export const isValidIndianPhone = (value) => /^\d{10}$/.test(normalizeIndianPhone(value));
