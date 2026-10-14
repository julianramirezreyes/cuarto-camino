"use client";

import { useEffect, useState } from "react";
import { isIosSafari, readDismissed, writeDismissed } from "./install-hint";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function getStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function PwaRegistrar() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [showIos, setShowIos] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }

    const storage = getStorage();
    if (readDismissed(storage) || isStandalone()) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    if (isIosSafari(navigator.userAgent)) setShowIos(true); // eslint-disable-line react-hooks/set-state-in-effect
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!installEvent && !showIos) return null;

  const dismiss = () => {
    writeDismissed(getStorage());
    setInstallEvent(null);
    setShowIos(false);
  };

  const install = async () => {
    if (!installEvent) return;
    try {
      await installEvent.prompt();
      await installEvent.userChoice;
    } catch {
      /* ignore */
    }
    dismiss();
  };

  return (
    <div
      role="region"
      aria-label="Instalar la aplicación"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-white/15 bg-[#0b1020] p-4 text-sm text-white shadow-lg"
    >
      <p className="flex-1">
        {installEvent
          ? "Instala Cuarto Camino para abrirlo como una app."
          : "Para instalarla: toca Compartir y luego «Añadir a pantalla de inicio»."}
      </p>
      {installEvent && (
        <button type="button" onClick={install} className="rounded-full bg-[#d4af6a] px-3 py-1 font-medium text-[#0b1020]">
          Instalar
        </button>
      )}
      <button type="button" onClick={dismiss} aria-label="Cerrar" className="px-2 py-1">
        ✕
      </button>
    </div>
  );
}
