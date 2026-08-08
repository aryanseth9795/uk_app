import { describe, it, expect } from "vitest";
import { createRefreshQueue } from "./refreshQueue";

/**
 * Proves the queue settles on BOTH paths. The original implementation resolved
 * subscribers on success but discarded them on failure by reassigning the
 * array, leaving every queued promise pending forever (CA-01).
 *
 * On mobile this is worse than on the web: a frozen screen has no reload, so
 * the user has to force-quit the app.
 */
describe("CA-01: refresh queue settles on failure", () => {
  it("rejects every queued request when refresh fails", async () => {
    const queue = createRefreshQueue();
    const queued = [queue.subscribe(), queue.subscribe(), queue.subscribe()];

    queue.fail(new Error("refresh failed"));

    // Race against a timer: a hung promise never settles, so this is the only
    // way to assert "did not hang" rather than just "did not resolve".
    const settled = await Promise.race([
      Promise.allSettled(queued),
      new Promise((resolve) => setTimeout(() => resolve("HUNG"), 200)),
    ]);

    expect(settled).not.toBe("HUNG");
    expect(
      (settled as PromiseSettledResult<string>[]).every(
        (s) => s.status === "rejected",
      ),
    ).toBe(true);
  });

  it("resolves every queued request with the new token on success", async () => {
    const queue = createRefreshQueue();
    const queued = [queue.subscribe(), queue.subscribe()];

    queue.succeed("new-token");

    await expect(Promise.all(queued)).resolves.toEqual([
      "new-token",
      "new-token",
    ]);
  });

  it("empties the queue after settling, so a later drain is a no-op", async () => {
    const queue = createRefreshQueue();
    const first = queue.subscribe();

    queue.succeed("token-a");
    await expect(first).resolves.toBe("token-a");

    expect(queue.size()).toBe(0);
    queue.fail(new Error("late failure"));
    expect(queue.size()).toBe(0);
  });
});
