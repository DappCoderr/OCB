import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllBagLottery } from '../flow/Script/Lottery/get_allLottries.script';

function Lottery() {
  const [lotteries, setLotteries] = useState([]);
  const [filteredLotteries, setFilteredLotteries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    nftId: '',
    winnerAddress: '',
  });
  const itemsPerPage = 8;

  const fetchLotteries = async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      // Use the actual getAllBagLottery function
      const response = await getAllBagLottery();

      // Transform the response to match your expected format
      const transformedLotteries = response.map((lottery) => ({
        uuid: lottery.uuid || lottery.id,
        id: lottery.id?.toString() || 'N/A',
        winner_NFTId: lottery.winnerNFTId?.toString() || '',
        prizeVault: parseFloat(lottery.winnings || '0'),
        winnerAddress: lottery.winnerAddress || '',
        isResolved: lottery.isResolved || false,
        prizeDistributed: lottery.prizeDistributed || false,
      }));

      // Sort by ID descending (newest first)
      const sortedLotteries = transformedLotteries.sort((a, b) => {
        const idA = parseInt(a.id) || 0;
        const idB = parseInt(b.id) || 0;
        return idB - idA;
      });

      setLotteries(sortedLotteries);
      setFilteredLotteries(sortedLotteries);
      setCurrentPage(1); // Reset to first page when data changes
    } catch (e) {
      setIsError(true);
      setError(e);
      console.error('Error fetching lottery history:', e);
      toast.error('Failed to load lottery history');

      // Fallback to mock data if the API call fails (optional)
      const mockLotteries = [
        {
          uuid: '48378511783040',
          id: '1',
          winner_NFTId: '7',
          prizeVault: 1744.2,
          winnerAddress: '0x6ed8a095ca278bf8',
          isResolved: true,
          prizeDistributed: true,
        },
        {
          uuid: '48378511783041',
          id: '2',
          winner_NFTId: '45',
          prizeVault: 180.0,
          winnerAddress: '0x6373847jdhhf738',
          isResolved: true,
          prizeDistributed: true,
        },
        {
          uuid: '48378511783042',
          id: '3',
          winner_NFTId: '123',
          prizeVault: 250.0,
          winnerAddress: '0x337e140cac71c1f0',
          isResolved: false,
          prizeDistributed: false,
        },
        {
          uuid: '48378511783043',
          id: '4',
          winner_NFTId: '92',
          prizeVault: 220.0,
          winnerAddress: '0x893748274abc123',
          isResolved: true,
          prizeDistributed: true,
        },
        {
          uuid: '48378511783044',
          id: '5',
          winner_NFTId: '67',
          prizeVault: 190.0,
          winnerAddress: '0x6373847jdhhf738',
          isResolved: true,
          prizeDistributed: true,
        },
        {
          uuid: '48378511783045',
          id: '6',
          winner_NFTId: '81',
          prizeVault: 210.0,
          winnerAddress: '0x123456789abcdef',
          isResolved: true,
          prizeDistributed: true,
        },
        {
          uuid: '48378511783046',
          id: '7',
          winner_NFTId: '104',
          prizeVault: 230.0,
          winnerAddress: '0x9876543210fedcba',
          isResolved: false,
          prizeDistributed: false,
        },
      ];

      const sortedMock = mockLotteries.sort(
        (a, b) => parseInt(b.id) - parseInt(a.id)
      );
      setLotteries(sortedMock);
      setFilteredLotteries(sortedMock);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters whenever filters or lotteries change
  useEffect(() => {
    const filtered = lotteries.filter((lottery) => {
      // Filter by NFT ID
      if (filters.nftId && lottery.winner_NFTId !== filters.nftId) {
        return false;
      }

      // Filter by winner address
      if (
        filters.winnerAddress &&
        !lottery.winnerAddress
          ?.toLowerCase()
          .includes(filters.winnerAddress.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

    setFilteredLotteries(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, lotteries]);

  useEffect(() => {
    fetchLotteries();
  }, []);

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusBadge = (lottery) => {
    if (!lottery.isResolved) {
      return (
        <span className="px-2.5 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30">
          Active
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
        Resolved
      </span>
    );
  };

  const getPrizeAmount = (lottery) => {
    return lottery.prizeVault?.toFixed(2) || '0.00';
  };

  const clearFilters = () => {
    setFilters({
      nftId: '',
      winnerAddress: '',
    });
  };

  const hasActiveFilters = filters.nftId || filters.winnerAddress;

  // Calculate total FLOW distributed
  const totalFlowDistributed = lotteries
    .filter((lottery) => lottery.prizeDistributed)
    .reduce((total, lottery) => total + (lottery.prizeVault || 0), 0);

  // Pagination logic
  const totalPages = Math.ceil(filteredLotteries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLotteries = filteredLotteries.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading && lotteries.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <main className=" px-6 py-8">
      <div className="max-w-7xl mx-auto bg-black rounded-2xl">
        <div className="px-8 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Lottery</h1>
            <p className="text-gray-400">
              Track all past lotteries and their outcomes
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1A1D28] border border-[#2A2D3A] rounded-2xl p-6 text-center shadow-lg">
              <div className="text-2xl font-bold text-blue-400">
                {lotteries.length}
              </div>
              <div className="text-sm text-gray-400">Total Lotteries</div>
            </div>
            <div className="bg-[#1A1D28] border border-[#2A2D3A] rounded-2xl p-6 text-center shadow-lg">
              <div className="text-2xl font-bold text-green-400">
                {lotteries.filter((l) => l.isResolved).length}
              </div>
              <div className="text-sm text-gray-400">Resolved Lotteries</div>
            </div>
            <div className="bg-[#1A1D28] border border-[#2A2D3A] rounded-2xl p-6 text-center shadow-lg">
              <div className="text-2xl font-bold text-purple-400">
                {totalFlowDistributed.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">FLOW Distributed</div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-[#1A1D28] rounded-2xl p-6 mb-8 border border-[#2A2D3A] shadow-lg">
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Filter by NFT ID
                </label>
                <input
                  type="text"
                  placeholder="Enter NFT ID (e.g., 7)"
                  value={filters.nftId}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, nftId: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-[#232734] border border-[#2A2D3A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Filter by Address
                </label>
                <input
                  type="text"
                  placeholder="Enter address (e.g., 0x6ed8...)"
                  value={filters.winnerAddress}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      winnerAddress: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 bg-[#232734] border border-[#2A2D3A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className={`px-4 py-2.5 rounded-lg transition-colors ${
                    hasActiveFilters
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Active filters:</span>
                {filters.nftId && (
                  <span className="bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/30">
                    NFT ID: {filters.nftId}
                  </span>
                )}
                {filters.winnerAddress && (
                  <span className="bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full border border-green-500/30">
                    Address: {formatAddress(filters.winnerAddress)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Count and Pagination Info */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-400">
              Showing {paginatedLotteries.length} of {filteredLotteries.length}{' '}
              lotteries
              {hasActiveFilters && ' (filtered)'}
            </p>

            {filteredLotteries.length > itemsPerPage && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </div>

          {/* Lottery Table */}
          <div className="bg-[#1A1D28] border border-[#2A2D3A] rounded-2xl overflow-hidden mb-4 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#232734]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Lottery ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Winning NFT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Winner
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Prize
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Distributed
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2D3A]">
                  {paginatedLotteries.map((lottery) => (
                    <tr
                      key={lottery.uuid}
                      className="hover:bg-[#232734]/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-white">
                          #{lottery.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(lottery)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lottery.winner_NFTId ? (
                          <span className="text-sm text-white">
                            Bag #{lottery.winner_NFTId}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lottery.winnerAddress ? (
                          <a
                            href={`https://testnet.flowscan.io/account/${lottery.winnerAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 underline transition-colors"
                          >
                            {formatAddress(lottery.winnerAddress)}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-green-400">
                          {getPrizeAmount(lottery)} FLOW
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${
                            lottery.prizeDistributed
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {lottery.prizeDistributed ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredLotteries.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-6xl mb-4">🔍</div>
                <p className="text-gray-400 mb-2">No lotteries found</p>
                <p className="text-gray-500 text-sm">
                  {hasActiveFilters
                    ? 'Try adjusting your filters to see more results.'
                    : "The first lottery hasn't been created yet."}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredLotteries.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div className="text-sm text-gray-400">
                Showing {startIndex + 1} to{' '}
                {Math.min(startIndex + itemsPerPage, filteredLotteries.length)}{' '}
                of {filteredLotteries.length} results
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-[#232734] text-white hover:bg-[#2A2D3A]'
                  }`}
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-8 h-8 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#232734] text-white hover:bg-[#2A2D3A]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={() => goToPage(totalPages)}
                      className="w-8 h-8 bg-[#232734] text-white rounded-lg hover:bg-[#2A2D3A] transition-colors"
                    >
                      {totalPages}
                    </button>
                  )}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-[#232734] text-white hover:bg-[#2A2D3A]'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Lottery;
