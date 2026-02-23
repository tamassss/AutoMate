let pendingRequests = 0;
const listeners = new Set();

function notify() {
  for (const listener of listeners) {
    listener(pendingRequests);
  }
}

export function subscribeLoading(listener) {
  listeners.add(listener);
  listener(pendingRequests);
  return () => listeners.delete(listener);
}

function inc() {
  pendingRequests += 1;
  notify();
}

function dec() {
  pendingRequests = Math.max(0, pendingRequests - 1);
  notify();
}

export function installFetchLoadingTracker() {
  if (typeof window === "undefined") return;
  if (window.__automateFetchPatched) return;

  const originalFetch = window.fetch.bind(window);
  window.__automateFetchPatched = true;

  window.fetch = async (...args) => {
    inc();
    try {
      return await originalFetch(...args);
    } finally {
      dec();
    }
  };
}
