// Home Page Component
function Home({ setCurrentPage }) {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <p className="text-gray-600 text-[16px] mb-6">
          OCB is a randomized adventurer gear, generated & stored fully on-chain
          built for believers. First collection where mint stakes are pooled,
          and holders have a weekly chance to <b>win yield</b>.
          <br />
          <b>Identity</b>, <b>Collection</b>, and <b>Rewards</b> — all packed
          into one Bag.
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
