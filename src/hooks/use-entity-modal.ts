import { useState } from "react";

export type EntityModalMode = "create" | "edit" | "view";

type UseEntityModalOptions<TEntity, TDraft> = {
  blankDraft: TDraft;
  toDraft: (entity: TEntity) => TDraft;
};

export function useEntityModal<TEntity, TDraft>({ blankDraft, toDraft }: UseEntityModalOptions<TEntity, TDraft>) {
  const [mode, setMode] = useState<EntityModalMode | null>(null);
  const [selected, setSelected] = useState<TEntity | null>(null);
  const [draft, setDraft] = useState<TDraft>(blankDraft);

  const openCreate = () => {
    setSelected(null);
    setDraft(blankDraft);
    setMode("create");
  };

  const openEdit = (entity: TEntity) => {
    setSelected(entity);
    setDraft(toDraft(entity));
    setMode("edit");
  };

  const openView = (entity: TEntity) => {
    setSelected(entity);
    setDraft(toDraft(entity));
    setMode("view");
  };

  const close = () => setMode(null);

  return {
    isOpen: mode !== null,
    mode,
    selected,
    draft,
    setDraft,
    openCreate,
    openEdit,
    openView,
    close,
  };
}
