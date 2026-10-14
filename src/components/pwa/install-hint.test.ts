import { describe, expect, it } from "vitest";
import { isIosSafari, readDismissed, writeDismissed } from "./install-hint";

const iphoneSafari =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
const iphoneChrome =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0 Mobile/15E148 Safari/604.1";
const desktopChrome =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36";

describe("isIosSafari", () => {
  it("detects iOS Safari", () => expect(isIosSafari(iphoneSafari)).toBe(true));
  it("rejects iOS Chrome and desktop", () => {
    expect(isIosSafari(iphoneChrome)).toBe(false);
    expect(isIosSafari(desktopChrome)).toBe(false);
  });
});

describe("dismissal storage", () => {
  const store = () => {
    const data = new Map<string, string>();
    return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
  };
  it("remembers a dismissal", () => {
    const s = store();
    expect(readDismissed(s)).toBe(false);
    writeDismissed(s);
    expect(readDismissed(s)).toBe(true);
  });
  it("survives a throwing storage", () => {
    const broken = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("denied");
      },
    };
    expect(readDismissed(broken)).toBe(false);
    expect(() => writeDismissed(broken)).not.toThrow();
  });
  it("tolerates a missing storage", () => {
    expect(readDismissed(null)).toBe(false);
    expect(() => writeDismissed(null)).not.toThrow();
  });
});
