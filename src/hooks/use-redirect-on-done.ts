import { useEffect, useRef } from "react";

/**
 * Runs `go` once when `status` becomes "done".
 *
 * With cacheComponents React keeps a hidden page's state alive (Activity) and re-runs its effects when it
 * is shown again, so a plain `useEffect(() => status === "done" && go())` would redirect a second time with
 * the stale "done" status (e.g. after restarting an assessment from the results page).
 */
export function useRedirectOnDone(status: string, go: () => void) {
  const handled = useRef(false);
  useEffect(() => {
    if (status !== "done") {
      handled.current = false;
      return;
    }
    if (handled.current) return;
    handled.current = true;
    go();
  }, [status, go]);
}
