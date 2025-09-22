export const getCleanErrorMessage = (error) => {
  if (!error) return 'Unknown error occurred';

  const message =
    typeof error === 'object'
      ? error.message || error.errorMessage || JSON.stringify(error)
      : String(error);

  if (message.includes('does not have a Bag collection')) {
    return "You don't have a collection yet. Minting your first NFT will create one automatically!";
  }

  const match = message.match(/pre-condition failed: ([^>]+)/);
  return match && match[1]
    ? `pre-condition failed: ${match[1].trim()}`
    : message;
};
