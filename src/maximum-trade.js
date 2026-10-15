export function maximumTradeCount(limit, fits) {
  let low = 0, high = Math.max(0, Math.floor(limit));
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (fits(middle)) low = middle; else high = middle - 1;
  }
  return low;
}
