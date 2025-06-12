export const delayTester = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
