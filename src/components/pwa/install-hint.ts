export const DISMISS_KEY = "cc:install-hint-dismissed";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

export function isIosSafari(userAgent: string): boolean {
  const ios = /iPhone|iPad|iPod/.test(userAgent);
  const otherBrowser = /CriOS|FxiOS|EdgiOS|OPiOS/.test(userAgent);
  return ios && !otherBrowser && /Safari/.test(userAgent);
}

export function readDismissed(storage: StorageLike | null): boolean {
  try {
    return storage?.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeDismissed(storage: StorageLike | null): void {
  try {
    storage?.setItem(DISMISS_KEY, "1");
  } catch {
    /* storage unavailable: the hint may reappear next visit */
  }
}
