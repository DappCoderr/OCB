import { config } from '@onflow/fcl';

config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
  'discovery.authn.endpoint': 'https://fcl-discovery.onflow.org/testnet/authn',
  'discovery.authn.include': [
    '0xead892083b3e2c6c', // Dapper Wallet
    '0x82ec283f88a62e65', // Blocto
    '0x9d2e44203cb13051', // Ledger
  ],
  'app.detail.title': 'OCB',
  'app.detail.icon': 'https://example.com/icon.png',
  'app.detail.description': 'A decentralized app on Flow',
  'app.detail.url': 'https://myonchainapp.com',
});
