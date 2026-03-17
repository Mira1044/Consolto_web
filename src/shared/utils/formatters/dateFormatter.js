export const formatDateShort = (date) => {
  if (!date) return '';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const toInputDateValue = (date) => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};
