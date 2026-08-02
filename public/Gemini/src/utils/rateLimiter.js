const requests = [];

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;

export function checkRateLimit() {
  const now = Date.now();

  while (
    requests.length &&
    now - requests[0] > WINDOW_MS
  ) {
    requests.shift();
  }

  if (requests.length >= MAX_REQUESTS) {
    throw new Error(
      "Rate limit exceeded. Please wait before sending more requests."
    );
  }

  requests.push(now);
}