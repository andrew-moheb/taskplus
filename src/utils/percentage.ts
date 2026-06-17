export const calculateTaskPercentage = (
  taskTypeTotal: number,
  totalTaskNumber: number,
) => {
  if (totalTaskNumber === 0) return 0;

  const percentage = (taskTypeTotal / totalTaskNumber) * 100;

  return Math.min(100, Math.round(percentage));
};
