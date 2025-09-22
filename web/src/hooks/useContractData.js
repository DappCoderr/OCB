import { useQuery } from '@tanstack/react-query';
import { useCurrentFlowUser } from '@onflow/kit';
import { getTotalSupply } from '../flow/Script/get_totalSupply.script';
import { getCheckCollection } from '../flow/Script/get_checkCollection.script';
import { getBagPrice } from '../flow/Script/get_bagPrice.script';
import { getFlowTokenBalance } from '../flow/Script/getFlowTokenBalance.script';
import { getMaxSupply } from '../flow/Script/get_maxSupply.script';
import { getCollectionLength } from '../flow/Script/get_collectionLength.script';

export const useContractData = () => {
  const { user } = useCurrentFlowUser();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['contract-data', user?.addr],
    queryFn: async () => {
      const [totalSupply, bagPrice, maxSupply, contractBalance] =
        await Promise.all([
          getTotalSupply(),
          getBagPrice(),
          getMaxSupply(),
          getFlowTokenBalance('0x11106fe6700496e8'),
        ]);

      let hasCollection = false;
      let flowBalance = 0;
      let userNFTCount = 0;

      if (user?.addr) {
        try {
          [hasCollection, flowBalance, userNFTCount] = await Promise.all([
            getCheckCollection(user.addr),
            getFlowTokenBalance(user.addr),
            getCollectionLength(user.addr).catch(() => 0), // Return 0 if collection doesn't exist
          ]);
        } catch (error) {
          // Handle case where user doesn't have a collection yet
          if (error.message.includes('does not have a Bag collection')) {
            hasCollection = false;
            userNFTCount = 0;
          } else {
            throw error;
          }
        }
      }

      return {
        totalSupply,
        bagPrice,
        maxSupply,
        contractBalance,
        hasCollection: Boolean(hasCollection),
        flowBalance,
        userNFTCount,
        maxNFTsReached: userNFTCount >= 20,
      };
    },
    enabled: !!user?.addr,
    retry: (failureCount, error) => {
      // Don't retry if it's a "no collection" error
      if (error.message.includes('does not have a Bag collection')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    user,
  };
};
