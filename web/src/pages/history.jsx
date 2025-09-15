import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllBagLottery } from "../flow/Script/Lottery/get_allLottries.script"

function History() {
  const [lotteries, setLotteries] = useState([]);
  const [filteredLotteries, setFilteredLotteries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    nftId: '',
    winnerAddress: ''
  });
  const itemsPerPage = 5;

  const fetchLotteries = async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      // Use the actual getAllBagLottery function
      const response = await getAllBagLottery();
      
      // Transform the response to match your expected format
      const transformedLotteries = response.map(lottery => ({
        uuid: lottery.uuid || lottery.id,
        id: lottery.id?.toString() || 'N/A',
        winner_NFTId: lottery.winnerNFTId?.toString() || '',
        prizeVault: parseFloat(lottery.winnings || '0'),
        winnerAddress: lottery.winnerAddress || '',
        isResolved: lottery.isResolved || false,
        prizeDistributed: lottery.prizeDistributed || false
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
      console.error("Error fetching lottery history:", e);
      toast.error('Failed to load lottery history');
      
      // Fallback to mock data if the API call fails (optional)
      const mockLotteries = [
        { uuid:"48378511783040", id:"1", winner_NFTId:"7", prizeVault:1744.20, winnerAddress:"0x6ed8a095ca278bf8", isResolved:true, prizeDistributed:true },
        { uuid:"48378511783041", id:"2", winner_NFTId:"45", prizeVault:180.0, winnerAddress:"0x6373847jdhhf738", isResolved:true, prizeDistributed:true },
        { uuid:"48378511783042", id:"3", winner_NFTId:"123", prizeVault:250.0, winnerAddress:"0x337e140cac71c1f0", isResolved:false, prizeDistributed:false },
        { uuid:"48378511783043", id:"4", winner_NFTId:"92", prizeVault:220.0, winnerAddress:"0x893748274abc123", isResolved:true, prizeDistributed:true },
        { uuid:"48378511783044", id:"5", winner_NFTId:"67", prizeVault:190.0, winnerAddress:"0x6373847jdhhf738", isResolved:true, prizeDistributed:true },
        { uuid:"48378511783045", id:"6", winner_NFTId:"81", prizeVault:210.0, winnerAddress:"0x123456789abcdef", isResolved:true, prizeDistributed:true },
        { uuid:"48378511783046", id:"7", winner_NFTId:"104", prizeVault:230.0, winnerAddress:"0x9876543210fedcba", isResolved:false, prizeDistributed:false }
      ];
      
      const sortedMock = mockLotteries.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      setLotteries(sortedMock);
      setFilteredLotteries(sortedMock);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters whenever filters or lotteries change
  useEffect(() => {
    const filtered = lotteries.filter(lottery => {
      // Filter by NFT ID
      if (filters.nftId && lottery.winner_NFTId !== filters.nftId) {
        return false;
      }
      
      // Filter by winner address
      if (filters.winnerAddress && !lottery.winnerAddress?.toLowerCase().includes(filters.winnerAddress.toLowerCase())) {
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
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Active</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Resolved</span>;
  };

  const getPrizeAmount = (lottery) => {
    return lottery.prizeVault?.toFixed(2) || '0.00';
  };

  const clearFilters = () => {
    setFilters({
      nftId: '',
      winnerAddress: ''
    });
  };

  const hasActiveFilters = filters.nftId || filters.winnerAddress;

  // Calculate total FLOW distributed
  const totalFlowDistributed = lotteries
    .filter(lottery => lottery.prizeDistributed)
    .reduce((total, lottery) => total + (lottery.prizeVault || 0), 0);

  // Pagination logic
  const totalPages = Math.ceil(filteredLotteries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLotteries = filteredLotteries.slice(startIndex, startIndex + itemsPerPage);
  
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

  if (isLoading && lotteries.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lottery history...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">History</h1>
        <p className="text-gray-600">
          Track all past lotteries and their outcomes
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by NFT ID
            </label>
            <input
              type="text"
              placeholder="Enter NFT ID (e.g., 7)"
              value={filters.nftId}
              onChange={(e) => setFilters(prev => ({ ...prev, nftId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Address
            </label>
            <input
              type="text"
              placeholder="Enter address (e.g., 0x6ed8...)"
              value={filters.winnerAddress}
              onChange={(e) => setFilters(prev => ({ ...prev, winnerAddress: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={`px-4 py-2 rounded-md ${
                hasActiveFilters
                  ? 'bg-gray-500 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              } transition-colors`}
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Active filters:</span>
            {filters.nftId && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                NFT ID: {filters.nftId}
              </span>
            )}
            {filters.winnerAddress && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Address: {formatAddress(filters.winnerAddress)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{lotteries.length}</div>
          <div className="text-sm text-gray-600">Total Lotteries</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {lotteries.filter(l => l.isResolved).length}
          </div>
          <div className="text-sm text-gray-600">Resolved Lotteries</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {totalFlowDistributed.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">FLOW Distributed</div>
        </div>
      </div>

      {/* Results Count and Pagination Info */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          Showing {paginatedLotteries.length} of {filteredLotteries.length} lotteries
          {hasActiveFilters && ' (filtered)'}
        </p>
        
        {filteredLotteries.length > itemsPerPage && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Page {currentPage} of {totalPages}</span>
          </div>
        )}
      </div>

      {/* Lottery Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lottery ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Winning NFT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Winner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prize
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distributed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedLotteries.map((lottery) => (
                <tr key={lottery.uuid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">#{lottery.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(lottery)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lottery.winner_NFTId ? (
                      <span className="text-sm text-gray-900">Bag #{lottery.winner_NFTId}</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lottery.winnerAddress ? (
                      <a
                        href={`https://testnet.flowscan.io/account/${lottery.winnerAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        {formatAddress(lottery.winnerAddress)}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-green-600">
                      {getPrizeAmount(lottery)} FLOW
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      lottery.prizeDistributed ? 'text-green-600' : 'text-red-600'
                    }`}>
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
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <p className="text-gray-500 mb-2">No lotteries found</p>
            <p className="text-gray-400 text-sm">
              {hasActiveFilters 
                ? 'Try adjusting your filters to see more results.'
                : 'The first lottery hasn\'t been created yet.'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredLotteries.length > itemsPerPage && (
        <div className="flex justify-evenly items-center my-12">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-colors`}
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-colors`}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}

export default History;