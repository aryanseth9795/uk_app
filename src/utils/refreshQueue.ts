/**
 * Queue of requests parked while a token refresh is in flight.
 *
 * The original queue in api/client.ts had one exit. On success it resolved
 * every subscriber; on failure it did `refreshSubscribers = []`, which discards
 * the callbacks WITHOUT settling their promises. Every parked request then
 * stayed pending forever: no catch block ran, TanStack Query stayed
 * `isPending`, and the screen spun indefinitely.
 *
 * On mobile that is worse than on the web — there is no reload, so the user has
 * to force-quit the app, and returning lands them on the same stuck screen.
 *
 * A queue of pending promises needs a failure drain. For every
 * `new Promise((resolve, reject) => …)`, something must be able to call reject.
 *
 * See review/phase-3-consumer-app/BUG-REPORT.md CA-01.
 */

type RefreshSubscriber = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

export interface RefreshQueue {
  /** Park a request until the in-flight refresh settles. */
  subscribe: () => Promise<string>;
  /** Hand the new token to everyone waiting. */
  succeed: (token: string) => void;
  /** Reject everyone waiting. Must be called on every refresh failure path. */
  fail: (error: unknown) => void;
  /** Number of parked requests — used in tests to assert the queue drains. */
  size: () => number;
}

export function createRefreshQueue(): RefreshQueue {
  let subscribers: RefreshSubscriber[] = [];

  return {
    subscribe: () =>
      new Promise<string>((resolve, reject) => {
        subscribers.push({ resolve, reject });
      }),

    succeed: (token: string) => {
      const pending = subscribers;
      subscribers = [];
      pending.forEach((s) => s.resolve(token));
    },

    fail: (error: unknown) => {
      const pending = subscribers;
      subscribers = [];
      pending.forEach((s) => s.reject(error));
    },

    size: () => subscribers.length,
  };
}
