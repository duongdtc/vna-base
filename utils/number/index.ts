/**
 * thu gọn giá tiền về tr hoặc k
 * @param fare tiền
 * @returns giá tiền thu gọn về tr hoặc k
 */
export const abbreviationFare = (fare: number) => {
  const millions = fare / 1_000_000;
  if (millions > 1) {
    return millions.toFixed(2) + 'tr';
  }

  const k = fare / 1_000;
  return Math.round(k) + 'k';
};
