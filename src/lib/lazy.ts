import { lazy, type ComponentType } from "react";

const RELOAD_KEY = "vendli-chunk-reload";

/**
 * React.lazy that survives a stale deploy: if a code-split chunk has been
 * replaced on the server, reload once to pick up the new build instead of
 * leaving the user on a blank screen.
 */
export function lazyWithReload<T extends ComponentType>(factory: () => Promise<{ default: T }>) {
  return lazy(async () => {
    try {
      const mod = await factory();
      try { sessionStorage.removeItem(RELOAD_KEY); } catch { /* storage unavailable */ }
      return mod;
    } catch (err) {
      let alreadyReloaded = true;
      try {
        alreadyReloaded = sessionStorage.getItem(RELOAD_KEY) === "1";
        sessionStorage.setItem(RELOAD_KEY, "1");
      } catch { /* storage unavailable: don't risk a reload loop */ }
      if (!alreadyReloaded) {
        window.location.reload();
        return new Promise<never>(() => {});
      }
      throw err;
    }
  });
}
