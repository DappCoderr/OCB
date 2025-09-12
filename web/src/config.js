import { config } from '@onflow/fcl';

config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("flow.network", "testnet")
  .put("app.detail.title", "OCB")
  .put("app.detail.icon", "https://example.com/icon.png")
  .put("app.detail.description", "OnChainBag")
  .put("app.detail.url", "https://myonchainapp.com")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("discovery.authn.include", []);
