import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("rateLimit (in-memory fallback)", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it("allows requests up to the limit", async () => {
    const { rateLimit } = await import("./rateLimit");

    for (let i = 0; i < 3; i++) {
      const result = await rateLimit("user-a", 3, 1000);
      expect(result.success).toBe(true);
    }
  });

  it("blocks requests past the limit", async () => {
    const { rateLimit } = await import("./rateLimit");

    await rateLimit("user-b", 2, 1000);
    await rateLimit("user-b", 2, 1000);

    const blocked = await rateLimit("user-b", 2, 1000);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("tracks separate keys independently", async () => {
    const { rateLimit } = await import("./rateLimit");

    await rateLimit("key-1", 1, 1000);

    const other = await rateLimit("key-2", 1, 1000);
    expect(other.success).toBe(true);

    const same = await rateLimit("key-1", 1, 1000);
    expect(same.success).toBe(false);
  });

  it("resets once the window passes", async () => {
    vi.useFakeTimers();
    const { rateLimit } = await import("./rateLimit");

    expect((await rateLimit("window-key", 1, 1000)).success).toBe(true);
    expect((await rateLimit("window-key", 1, 1000)).success).toBe(false);

    vi.advanceTimersByTime(1001);

    expect((await rateLimit("window-key", 1, 1000)).success).toBe(true);
  });
});

describe("rateLimit (redis path)", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.doUnmock("@upstash/redis");
    vi.doUnmock("@upstash/ratelimit");
  });

  it("uses the Upstash limiter when configured", async () => {
    const limit = vi.fn().mockResolvedValue({ success: true, remaining: 4, reset: 12345 });

    vi.doMock("@upstash/redis", () => ({
      Redis: { fromEnv: vi.fn(() => ({})) },
    }));
    vi.doMock("@upstash/ratelimit", () => ({
      Ratelimit: class {
        static slidingWindow = vi.fn(() => ({}));
        limit = limit;
      },
    }));

    const { rateLimit } = await import("./rateLimit");
    const result = await rateLimit("redis-user", 5, 60_000);

    expect(limit).toHaveBeenCalledWith("redis-user");
    expect(result).toEqual({ success: true, remaining: 4, resetAt: 12345 });
  });

  it("falls back to memory when Redis throws", async () => {
    const limit = vi.fn().mockRejectedValue(new Error("redis down"));

    vi.doMock("@upstash/redis", () => ({
      Redis: { fromEnv: vi.fn(() => ({})) },
    }));
    vi.doMock("@upstash/ratelimit", () => ({
      Ratelimit: class {
        static slidingWindow = vi.fn(() => ({}));
        limit = limit;
      },
    }));

    const { rateLimit } = await import("./rateLimit");
    const result = await rateLimit("fallback-user", 2, 1000);

    expect(limit).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });
});
