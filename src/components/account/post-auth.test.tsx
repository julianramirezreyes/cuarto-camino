// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace, refresh: vi.fn(), push: vi.fn() }) }));

import { PostAuth } from "./post-auth";

beforeEach(() => {
  replace.mockClear();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const resolveTo = (path: string) => vi.fn().mockResolvedValue(path);

describe("PostAuth", () => {
  it("claims exactly once (even under StrictMode double effects), confirms calmly and redirects", async () => {
    const claim = vi.fn().mockResolvedValue({ status: "claimed", claimed: 1 });
    render(
      <StrictMode>
        <PostAuth intent="sign-up" next={null} claim={claim} resolve={resolveTo("/resultado")} redirectDelayMs={50} />
      </StrictMode>,
    );
    expect(await screen.findByText(/guardamos tu resultado en tu cuenta/i)).toBeInTheDocument();
    expect(claim).toHaveBeenCalledTimes(1);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(replace).toHaveBeenCalledWith("/resultado");
    expect(replace).toHaveBeenCalledTimes(1);
  });

  it("handles claimed 0 without claiming to have saved anything", async () => {
    const claim = vi.fn().mockResolvedValue({ status: "nothing" });
    render(<PostAuth intent="sign-in" next={null} claim={claim} resolve={resolveTo("/resultado")} redirectDelayMs={10} />);
    expect(await screen.findByText(/tu cuenta está lista/i)).toBeInTheDocument();
    expect(screen.queryByText(/guardamos tu resultado/i)).not.toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(50);
    });
    expect(replace).toHaveBeenCalledWith("/resultado");
  });

  it("on failure keeps the account usable: non-blocking notice, retry works, no auto redirect", async () => {
    const claim = vi
      .fn()
      .mockResolvedValueOnce({ status: "failed" })
      .mockResolvedValueOnce({ status: "claimed", claimed: 1 });
    render(<PostAuth intent="sign-up" next={null} claim={claim} resolve={resolveTo("/resultado")} redirectDelayMs={10} />);
    expect(await screen.findByText(/no pudimos guardar tu resultado/i)).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(replace).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: /continuar/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /reintentar/i }));
    expect(await screen.findByText(/guardamos tu resultado en tu cuenta/i)).toBeInTheDocument();
    expect(claim).toHaveBeenCalledTimes(2);
  });

  it("disables retry while a retry is in flight", async () => {
    let resolveSecond!: (v: unknown) => void;
    const claim = vi
      .fn()
      .mockResolvedValueOnce({ status: "failed" })
      .mockReturnValueOnce(new Promise((r) => (resolveSecond = r)));
    render(<PostAuth intent="sign-up" next={null} claim={claim} resolve={resolveTo("/resultado")} redirectDelayMs={10} />);
    await userEvent.click(await screen.findByRole("button", { name: /reintentar/i }));
    expect(screen.queryByRole("button", { name: /reintentar/i })).not.toBeInTheDocument();
    expect(claim).toHaveBeenCalledTimes(2);
    resolveSecond({ status: "nothing" });
  });
});
