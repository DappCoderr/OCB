import { useState, useRef, useEffect } from 'react';
import { FlowIcon } from '../FlowIcon';

const WeeklyReward = () => {
  const [participants, setParticipants] = useState(4567);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const dragHandleRef = useRef(null);

  const calculateWinAmount = (participantsCount) => {
    return ((participantsCount * 60 * 11) / 100 / 52).toFixed(2);
  };

  const winAmount = calculateWinAmount(participants);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    let position = e.clientX - containerRect.left;

    // Constrain position within container bounds
    position = Math.max(0, Math.min(containerWidth, position));

    // Calculate participants based on position (0 to 7777)
    const newParticipants = Math.floor((position / containerWidth) * 7777);
    setParticipants(newParticipants);

    // Update handle position
    if (dragHandleRef.current) {
      dragHandleRef.current.style.left = `${position}px`;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    let position = e.touches[0].clientX - containerRect.left;

    // Constrain position within container bounds
    position = Math.max(0, Math.min(containerWidth, position));

    // Calculate participants based on position (0 to 7777)
    const newParticipants = Math.floor((position / containerWidth) * 7777);
    setParticipants(newParticipants);

    // Update handle position
    if (dragHandleRef.current) {
      dragHandleRef.current.style.left = `${position}px`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  // Initialize handle position based on initial participants
  useEffect(() => {
    if (containerRef.current && dragHandleRef.current) {
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const position = (participants / 7777) * containerWidth;
      dragHandleRef.current.style.left = `${position}px`;
    }
  }, []);

  return (
    <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Weekly Reward</h3>
        <div className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full flex items-center gap-2">
          {winAmount} <FlowIcon width={20} height={20} />
        </div>
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2 flex justify-between">
          <span>0</span>
          <span className="font-medium">
            NFTs: {participants.toLocaleString()}
          </span>
          <span>7777</span>
        </div>

        <div
          ref={containerRef}
          className="h-3 bg-gray-200 rounded-full relative cursor-pointer"
          onClick={(e) => {
            if (!isDragging) {
              const containerRect = e.currentTarget.getBoundingClientRect();
              const containerWidth = containerRect.width;
              const position = e.clientX - containerRect.left;

              // Calculate participants based on position (0 to 7777)
              const newParticipants = Math.floor(
                (position / containerWidth) * 7777
              );
              setParticipants(newParticipants);

              // Update handle position
              if (dragHandleRef.current) {
                dragHandleRef.current.style.left = `${position}px`;
              }
            }
          }}
        >
          <div
            ref={dragHandleRef}
            className="absolute top-1/2 w-6 h-6 -ml-3 -mt-3 bg-amber-500 rounded-full shadow-lg cursor-grab active:cursor-grabbing z-10"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          ></div>

          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
            style={{ width: `${(participants / 7777) * 100}%` }}
          ></div>
        </div>

        <div className="flex justify-center text-sm text-gray-500 mt-2">
          <span>{Math.floor((participants / 7777) * 100)}% filled</span>
        </div>

        <div className="text-xs text-gray-400 mt-1 text-center">
          Drag the circle to adjust participant count →
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-emerald-600">
            {participants.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">NFTs Minted</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-emerald-600">11%</div>
          <div className="text-xs text-gray-500">APY</div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
        <div className="flex items-center text-blue-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">
            Weekly Prize: {winAmount} FLOW
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReward;
