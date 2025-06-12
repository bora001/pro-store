/**
 * Measures performance of an async function.
 * Ideal for tracking backend response time during development.
 */

export const measurePerformance = async <T>(callback: () => Promise<T>, label: string): Promise<T> => {
  const start = performance.now();
  const result = await callback();
  const end = performance.now();
  console.log(`${label} - Response time: ${(end - start).toFixed(2)} ms`);
  return result;
};
