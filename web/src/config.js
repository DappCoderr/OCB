import { config } from '@onflow/fcl';

export const fclConfig = {
  accessNodeUrl: 'https://rest-testnet.onflow.org',
  flowNetwork: 'testnet',
  appDetailTitle: 'OCB',
  appDetailIcon: 'https://example.com/icon.png',
  appDetailDescription: 'OnChainBag',
  appDetailUrl: 'https://myonchainapp.com',
  discoveryWallet: 'https://fcl-discovery.onflow.org/testnet/authn',
  discoveryAuthInclude: [],
};

config(fclConfig);
