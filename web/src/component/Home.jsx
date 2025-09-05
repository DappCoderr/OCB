function Home() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center space-y-6">

  <p className="text-[14px] text-gray-700 leading-relaxed">
    <span className="font-medium">OCB</span> is the first NFT collection where your mint isn’t just art —
    it’s an <span className="font-semibold">investment in the network</span>.
    Every mint is staked into Flow nodes, generating yield.
    Each week, one Bag holder wins the staking rewards through
    <span className="font-medium text-green-600"> Flow-VRF</span>.
  </p>

  <p className="text-[14px] text-gray-700 leading-relaxed">
    This is art with utility. Provenance with purpose.
    A collection that <span className="font-semibold text-green-600">gives back</span> — and lets you
    <span className="font-bold text-green-700"> win yield</span>.
  </p>

  <p className="text-[14px] font-semibold text-gray-900">
    <span className="text-green-600 ">Identity</span>,{" "}
    <span className="text-green-600">Collection</span>, and{" "}
    <span className="text-green-600">Rewards</span> — all packed into one Bag.
  </p>
</div>


      {/* Features */}
      {/* <div className="space-y-6 mb-12">
        <div>
          <h3 className="font-bold mb-2">• 100% community-owned</h3>
          <p className="text-gray-600 ml-4">
            No corporate backing. No celebrity endorsements. Just pure
            <br />
            community-driven art.{" "}
            <button
              onClick={() => setCurrentPage("mint")}
              className="text-black underline hover:text-gray-600 transition-colors"
            >
              ★ Mint Now
            </button>
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">• Fair launch from day one</h3>
          <p className="text-gray-600 ml-4">
            No pre-sales. No whitelist advantages. Transparent
            <br />
            minting process. Equal opportunity for all.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">• Creator royalties forever</h3>
        </div>

        <div>
          <h3 className="font-bold mb-2">• Transferable by design</h3>
        </div>
      </div> */}

      {/* Divider */}
      <div className="border-t border-dotted border-gray-400 my-8"></div>

      {/* Call to Action */}
      <div className="mb-8">
        <h3 className="font-bold mb-4">Who is Bag For?</h3>

        <div className="space-y-2">
          <div>
            <h3 className="font-bold mb-2">• Believers</h3>
            <p className="text-gray-600 ml-4">
              Those who see Flow not just as tech — but as a foundation for
              creative freedom.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">• Collectors</h3>
            <p className="text-gray-600 ml-4">
              Those who value identity, provenance, and purpose — not just
              flipping JPEGs.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">• Community-First</h3>
            <p className="text-gray-600 ml-4">
              Those believe in ownership, value should be shared, and culture
              should be created.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">• You</h3>
            <p className="text-gray-600 ml-4">
              Believe in decentralized art, and in power of community — Bag is
              yours.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Message */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
        <p>
          This isn’t just a collection — it’s a movement.
          <br />
          Owned by the community. Powered by belief.
        </p>
      </div>
    </main>
  );
}

export default Home;
