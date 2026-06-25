export const LOCAL_DRAFT_KEY = "jotter.md.localDraft.v1";

export type LocalDraft = {
  body: string;
  lastEditedAt: string;
};

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function readLocalDraft(): LocalDraft | null {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const rawDraft = storage.getItem(LOCAL_DRAFT_KEY);

  if (!rawDraft) {
    return null;
  }

  try {
    const draft = JSON.parse(rawDraft) as Partial<LocalDraft>;

    if (typeof draft.body !== "string" || typeof draft.lastEditedAt !== "string") {
      return null;
    }

    return {
      body: draft.body,
      lastEditedAt: draft.lastEditedAt
    };
  } catch {
    return null;
  }
}

export function writeLocalDraft(body: string): LocalDraft | null {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const draft = {
    body,
    lastEditedAt: new Date().toISOString()
  };

  storage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(draft));

  return draft;
}

export function clearLocalDraft() {
  getStorage()?.removeItem(LOCAL_DRAFT_KEY);
}
