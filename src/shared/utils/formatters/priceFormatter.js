export const formatINR = (amount) => {
  if (amount == null || Number.isNaN(amount)) return '';
  return amount.toLocaleString('en-IN');
};
