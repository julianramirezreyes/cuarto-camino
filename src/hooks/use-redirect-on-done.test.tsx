// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react";
import { Activity } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useRedirectOnDone } from "./use-redirect-on-done";

afterEach(cleanup);

function Probe({ status, go }: { status: string; go: () => void }) {
  useRedirectOnDone(status, go);
  return null;
}

describe("useRedirectOnDone", () => {
  it("redirects once when the status becomes done", () => {
    const go = vi.fn();
    const { rerender } = render(<Probe status="question" go={go} />);
    expect(go).not.toHaveBeenCalled();
    rerender(<Probe status="done" go={go} />);
    expect(go).toHaveBeenCalledTimes(1);
    rerender(<Probe status="done" go={go} />);
    expect(go).toHaveBeenCalledTimes(1);
  });

  it("does not redirect again when a cached page is hidden and shown again with a stale done status", () => {
    const go = vi.fn();
    const ui = (mode: "visible" | "hidden", status: string) => (
      <Activity mode={mode}>
        <Probe status={status} go={go} />
      </Activity>
    );
    const { rerender } = render(ui("visible", "question"));
    rerender(ui("visible", "done"));
    expect(go).toHaveBeenCalledTimes(1);
    // Navigating away hides the page (its effects are cleaned up); coming back shows it again.
    act(() => rerender(ui("hidden", "done")));
    act(() => rerender(ui("visible", "done")));
    expect(go).toHaveBeenCalledTimes(1);
  });

  it("can redirect again after the flow left the done state (a new assessment finished)", () => {
    const go = vi.fn();
    const { rerender } = render(<Probe status="done" go={go} />);
    rerender(<Probe status="consent" go={go} />);
    rerender(<Probe status="done" go={go} />);
    expect(go).toHaveBeenCalledTimes(2);
  });

  it("redirects when it starts already done (finished assessment found on load)", () => {
    const go = vi.fn();
    render(<Probe status="done" go={go} />);
    expect(go).toHaveBeenCalledTimes(1);
  });
});
