import { describe, it, expect, beforeEach, vi } from "vitest";

const { getUser, rateLimitMock } = vi.hoisted(() => ({
  getUser: vi.fn(),
  rateLimitMock: vi.fn(),
}));

vi.mock("@/src/services/supabase/server", () => ({
  createClient: () => ({ auth: { getUser } }),
}));

vi.mock("@/src/lib/rateLimit", () => ({
  rateLimit: rateLimitMock,
}));

import { authenticateAiRequest } from "@/src/lib/aiGuard";

describe("authenticateAiRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when there is no user", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    const res = await authenticateAiRequest();

    expect(res).not.toBeNull();
    expect(res?.status).toBe(401);
    expect(rateLimitMock).not.toHaveBeenCalled();
  });

  it("returns null for an authenticated user within the limit", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    rateLimitMock.mockResolvedValue({
      success: true,
      remaining: 1,
      resetAt: Date.now() + 1000,
    });

    const res = await authenticateAiRequest();

    expect(res).toBeNull();
    expect(rateLimitMock).toHaveBeenCalledWith("ai:u1", 20, 60_000);
  });

  it("returns 429 when the user is over the limit", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    rateLimitMock.mockResolvedValue({
      success: false,
      remaining: 0,
      resetAt: Date.now() + 5000,
    });

    const res = await authenticateAiRequest();

    expect(res?.status).toBe(429);
    expect(res?.headers.get("Retry-After")).not.toBeNull();
  });
});
