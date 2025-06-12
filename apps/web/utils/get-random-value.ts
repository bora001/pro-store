export const getRandomValue = (array: string[]) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};
