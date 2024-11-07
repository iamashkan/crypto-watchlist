export const addPairToWatchlist = (pair: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Emulate API call delay
    setTimeout(() => {
      // Randomly succeed or fail to emulate API response
      Math.random() > 0.2 ? resolve() : reject(new Error('Failed to add pair to watchlist.'));
    }, 500);
  });
};
