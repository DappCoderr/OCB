import { useQuery } from '@tanstack/react-query';
import { getAllBagLottery } from '../flow/Script/Lottery/get_allLottries.script';

const transformLotteryData = (response) => {
  return response
    .map((lottery) => ({
      uuid: lottery.uuid || lottery.id,
      id: lottery.id?.toString() || 'N/A',
      winner_NFTId: lottery.winnerNFTId?.toString() || '',
      prizeVault: parseFloat(lottery.winnings || '0'),
      winnerAddress: lottery.winnerAddress || '',
      isResolved: lottery.isResolved || false,
      prizeDistributed: lottery.prizeDistributed || false,
    }))
    .sort((a, b) => {
      const idA = parseInt(a.id) || 0;
      const idB = parseInt(b.id) || 0;
      return idB - idA;
    });
};

export const useLotteries = () => {
  return useQuery({
    queryKey: ['lotteries'],
    queryFn: async () => {
      const response = await getAllBagLottery();
      return transformLotteryData(response);
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, // More reasonable interval
    retry: 3,
    refetchOnWindowFocus: false, // Prevent refetch on tab focus
  });
};
