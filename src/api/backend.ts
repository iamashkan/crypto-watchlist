export const addPairToWatchlist = (pair: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 80% chance of success, 20% chance of failure
      if (Math.random() > 0.2) {
        resolve();
      } else {
        reject(new Error(`Unable to add ${pair} to watchlist. Please try again.`));
      }
    }, 500);
  });
};
