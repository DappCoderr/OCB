import { useMemo } from 'react';

const WhoIsOCBFor = () => {
  const objects = useMemo(
    () => [
      {
        title: 'NFT Collectors',
        description:
          'Give your NFTs real utility by staking them for rewards and chances to win big each week.',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        ),
      },
      {
        title: 'Flow Community',
        description:
          'Support the Flow ecosystem by staking into Flow nodes while getting rewarded.',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        ),
      },
      {
        title: 'Newcomers',
        description:
          'Start your NFT journey with identity, rewards, and an easy on-chain experience packed into one bag.',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        ),
      },
    ],
    []
  );

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Who Is OCB For?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you’re here to collect, trade, or grow your portfolio, OCB
            has something for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {objects.map((item, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="text-emerald-500 mb-5 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoIsOCBFor;
