"use client";

import { useCallback, useRef, useState } from "react";
import type { RelationshipLenses, RelationshipProfile } from "@/content/schema";
import type { EnneagramType } from "@/domain/enneagram/structure";

export type ContentStatus = "idle" | "loading" | "error";
type Profiles = Partial<Record<EnneagramType, RelationshipProfile>>;

interface Seed {
  profiles?: Profiles;
  lenses?: RelationshipLenses;
}

/**
 * Lazy client cache of the relationship content. The seed (what the server already sent) is never fetched again;
 * every other profile and the lenses are fetched once from the public endpoints and kept in state.
 */
export function useRelationshipContent(seed: Seed = {}) {
  const [profiles, setProfiles] = useState<Profiles>(seed.profiles ?? {});
  const [lenses, setLenses] = useState<RelationshipLenses | undefined>(seed.lenses);
  const [status, setStatus] = useState<Record<string, ContentStatus>>({});
  const have = useRef({ profiles: seed.profiles ?? {}, lenses: seed.lenses });
  const inflight = useRef(new Set<string>());

  const run = useCallback(async (key: string, url: string, store: (json: unknown) => void) => {
    if (inflight.current.has(key)) return;
    inflight.current.add(key);
    setStatus((s) => ({ ...s, [key]: "loading" }));
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("load_failed");
      store(await res.json());
      setStatus((s) => ({ ...s, [key]: "idle" }));
    } catch {
      setStatus((s) => ({ ...s, [key]: "error" }));
    } finally {
      inflight.current.delete(key);
    }
  }, []);

  /** Makes sure the profile of `type` (and the lenses, when missing) are available or loading. */
  const load = useCallback(
    (type: EnneagramType) => {
      if (!have.current.profiles[type]) {
        void run(`profile-${type}`, `/api/content/relationships/${type}`, (json) => {
          const profile = (json as { profile?: RelationshipProfile }).profile;
          if (!profile || profile.type !== type) throw new Error("bad_profile");
          have.current.profiles = { ...have.current.profiles, [type]: profile };
          setProfiles(have.current.profiles);
        });
      }
      if (!have.current.lenses) {
        void run("lenses", "/api/content/relationships/lenses", (json) => {
          const loaded = json as RelationshipLenses;
          if (!Array.isArray(loaded?.disclaimers)) throw new Error("bad_lenses");
          have.current.lenses = loaded;
          setLenses(loaded);
        });
      }
    },
    [run],
  );

  /** Overall status of what showing the pair with `type` needs. */
  const statusOf = useCallback(
    (type: EnneagramType): ContentStatus => {
      const parts = [profiles[type] ? "idle" : (status[`profile-${type}`] ?? "idle"), lenses ? "idle" : (status.lenses ?? "idle")];
      if (parts.includes("error")) return "error";
      if (parts.includes("loading")) return "loading";
      return "idle";
    },
    [profiles, lenses, status],
  );

  return { profiles, lenses, load, statusOf };
}
