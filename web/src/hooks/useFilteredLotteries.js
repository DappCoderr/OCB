import { useMemo } from 'react';

export const useFilteredLotteries = (lotteries, filters) => {
  return useMemo(() => {
    if (!lotteries) return [];

    return lotteries.filter((lottery) => {
      if (filters.nftId && lottery.winner_NFTId !== filters.nftId) {
        return false;
      }
      if (
        filters.winnerAddress &&
        !lottery.winnerAddress
          ?.toLowerCase()
          .includes(filters.winnerAddress.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [lotteries, filters.nftId, filters.winnerAddress]);
};
