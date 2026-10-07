import time
from collections import defaultdict, deque
from threading import Lock


class RateLimiter:
    """Sliding-window limiter kept in memory.

    Fine for a single API instance. If you ever run several instances behind a
    load balancer, move this to Redis.
    """

    def __init__(self, limit: int, window_seconds: int) -> None:
        self.limit = limit
        self.window = window_seconds
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = Lock()

    def allow(self, key: str) -> bool:
        now = time.monotonic()
        with self._lock:
            hits = self._hits[key]
            while hits and now - hits[0] > self.window:
                hits.popleft()
            if len(hits) >= self.limit:
                return False
            hits.append(now)
            if len(self._hits) > 50_000:  # don't grow forever
                self._hits = defaultdict(deque, {k: v for k, v in self._hits.items() if v})
            return True
