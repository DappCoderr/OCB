import { useQuery } from '@tanstack/react-query';
import { getDelegatorIDs } from '../flow/Script/Staking/get_delegateIds.script';
import { getTokenStaked } from '../flow/Script/Staking/get_tokenStaked.script';
import { getTokenRewarded } from '../flow/Script/Staking/get_tokensRewarded.script';

const STAKING_ADDRESS = '0x11106fe6700496e8';

export const useStakingData = () => {
  // First, fetch delegator IDs
  const {
    data: delegatorData,
    isLoading: isLoadingDelegators,
    error: delegatorsError,
    isError: isDelegatorsError,
  } = useQuery({
    queryKey: ['delegators', STAKING_ADDRESS],
    queryFn: () => getDelegatorIDs(STAKING_ADDRESS),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Helper function to fetch data for all delegators
  const fetchDelegatorData = async (fetchFunction, queryKey) => {
    if (!delegatorData || delegatorData.length === 0) {
      return [];
    }

    try {
      // Use Promise.allSettled to handle partial failures
      const promises = delegatorData.map((delegator) =>
        fetchFunction(delegator.delegatorNodeID, delegator.delegatorID)
      );

      const results = await Promise.allSettled(promises);

      // Filter out failed requests and log errors
      return results
        .map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value;
          } else {
            console.error(
              `Failed to fetch ${queryKey} for delegator ${delegatorData[index].delegatorID}:`,
              result.reason
            );
            return null;
          }
        })
        .filter((item) => item !== null);
    } catch (error) {
      console.error(`Error in ${queryKey} fetch:`, error);
      throw error;
    }
  };

  // Fetch staked tokens
  const {
    data: tokenStakedData,
    isLoading: isLoadingTokens,
    error: tokensError,
    isError: isTokensError,
  } = useQuery({
    queryKey: [
      'tokenStaked',
      delegatorData?.map((d) => `${d.delegatorNodeID}-${d.delegatorID}`),
    ],
    queryFn: () => fetchDelegatorData(getTokenStaked, 'tokenStaked'),
    enabled: !!delegatorData && delegatorData.length > 0,
    staleTime: 2 * 1000, // 2 minutes
  });

  // Fetch token rewards
  const {
    data: tokenRewardData,
    isLoading: isLoadingTokensReward,
    error: tokensRewardError,
    isError: isTokensRewardError,
  } = useQuery({
    queryKey: [
      'tokenRewarded',
      delegatorData?.map((d) => `${d.delegatorNodeID}-${d.delegatorID}`),
    ],
    queryFn: () => fetchDelegatorData(getTokenRewarded, 'tokenRewarded'),
    enabled: !!delegatorData && delegatorData.length > 0,
    staleTime: 2 * 1000, // 2 minutes
  });

  // Calculate totals
  const totalStaked =
    tokenStakedData?.reduce(
      (total, current) => total + (Number(current) || 0),
      0
    ) || 0;

  const totalRewards =
    tokenRewardData?.reduce(
      (total, current) => total + (Number(current) || 0),
      0
    ) || 0;

  // Debug logs (consider removing in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('------- Delegator Data -------', delegatorData);
    // console.log("------- Token Staked Data -------", tokenStakedData);
    // console.log("------- Token Reward Data -------", tokenRewardData);
    // console.log("------- Totals -------", { totalStaked, totalRewards });
  }

  return {
    // Raw data
    delegatorData,
    tokenStakedData,
    tokenRewardData,

    // Calculated values
    totalStaked,
    totalRewards,
    delegatorCount: delegatorData?.length || 0,

    // Loading states
    isLoading: isLoadingDelegators || isLoadingTokens || isLoadingTokensReward,
    isLoadingDelegators,
    isLoadingTokens,
    isLoadingTokensReward,

    // Error states
    error: delegatorsError || tokensError || tokensRewardError,
    isError: isDelegatorsError || isTokensError || isTokensRewardError,

    // Individual errors for granular handling
    delegatorsError,
    tokensError,
    tokensRewardError,
  };
};
