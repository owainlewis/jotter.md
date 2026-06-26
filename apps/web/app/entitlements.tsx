"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { type Feature, type Plan, planAllows } from "./features";

const PLAN_KEY = "passage.plan.v1";

type EntitlementsValue = {
  plan: Plan;
  setPlan: (plan: Plan) => void;
  can: (feature: Feature) => boolean;
};

const EntitlementsContext = createContext<EntitlementsValue | null>(null);

export function EntitlementsProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlanState] = useState<Plan>("free");

  // Hydrate the plan after mount so SSR and the first client render match.
  useEffect(() => {
    const stored = localStorage.getItem(PLAN_KEY);
    if (stored === "pro" || stored === "free") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlanState(stored);
    }
  }, []);

  const setPlan = useCallback((next: Plan) => {
    setPlanState(next);
    try {
      localStorage.setItem(PLAN_KEY, next);
    } catch {
      // Storage may be unavailable; the plan stays in memory for this session.
    }
  }, []);

  const can = useCallback((feature: Feature) => planAllows(plan, feature), [plan]);

  return <EntitlementsContext value={{ plan, setPlan, can }}>{children}</EntitlementsContext>;
}

export function useEntitlements(): EntitlementsValue {
  const value = useContext(EntitlementsContext);
  if (!value) {
    throw new Error("useEntitlements must be used within an EntitlementsProvider");
  }
  return value;
}
