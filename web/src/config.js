import { config } from '@onflow/fcl';

config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'flow.network': 'testnet',
  'app.detail.title': 'OCB',
  'app.detail.icon': 'https://example.com/icon.png',
  'app.detail.description': 'OnChainBag',
  'app.detail.url': 'https://myonchainapp.com',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
  'discovery.authn.include': [],
  //Bag Contract
  '0xBag': '0x11106fe6700496e8',
  '0xBagRegistry': '0x11106fe6700496e8',
  '0xBagLottery': '0x11106fe6700496e8',

  // Flow core contract standard
  '0xFlowToken': '0x7e60df042a9c0868',
  '0xFungibleToken': '0x9a0766d93b6608b7',
  '0xNonFungibleToken': '0x631e88ae7f1d7c20',
  '0xMetadataViews': '0x631e88ae7f1d7c20',

  //Staking Contract
  '0xFlowEpoch': '0x9eca2b38b18b5dfe',
  '0xLockedTokens': '0x95e019a17d0e23d7',
  '0xFlowIDTableStaking': '0x9eca2b38b18b5dfe',
  '0xFlowStakingCollection': '0x95e019a17d0e23d7',
});
