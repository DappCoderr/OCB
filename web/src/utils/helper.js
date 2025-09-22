import { TRANSACTION_STATUS } from './constants';
import confetti from 'canvas-confetti';

export const getProgressPercentage = (status) => {
  switch (status) {
    case TRANSACTION_STATUS.PENDING:
      return 25;
    case TRANSACTION_STATUS.FINALIZED:
      return 50;
    case TRANSACTION_STATUS.EXECUTED:
      return 75;
    case TRANSACTION_STATUS.SEALED:
      return 100;
    case TRANSACTION_STATUS.FAILED:
      return 100;
    case TRANSACTION_STATUS.CANCELLED:
      return 100;
    case TRANSACTION_STATUS.DECLINED:
      return 25;
    default:
      return 2;
  }
};

export const getCleanErrorMessage = (error) => {
  if (!error) return '';
  if (typeof error === 'object' && error.message) return error.message;
  if (typeof error === 'string') {
    const match = error.match(/pre-condition failed: ([^>]+)/);
    if (match && match[1]) return `pre-condition failed: ${match[1].trim()}`;
    return error;
  }
  return 'Transaction failed. Please try again.';
};

export const fireConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#00ef8b', '#0090ff', '#ff00aa', '#ffd700', '#00e5ff'],
  });

  setTimeout(() => {
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
  }, 250);

  setTimeout(() => {
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });
  }, 400);
};
