import type { ReactNode } from "react";
import { useState } from "react";
import { Button, CardSurface, ConfirmationModal, Eyebrow, ModalActions } from "../../../shared/ui";
import { SettingsCard, SettingsSectionHeading } from "./SettingsStyles";

interface CatalogSectionText<T> {
  eyebrow: string;
  title: string;
  description: string;
  addLabel: string;
  saveLabel: string;
  emptyLabel: string;
  removeTitle: string;
  removeLabel: string;
  removeMessage(item: T, references: number): string;
}

interface CatalogEditorContext<T> {
  items: T[];
  replace(next: T): void;
}

export function EditableCatalogSection<T>({
  initialItems,
  createItem,
  getKey,
  texts,
  renderEditor,
  renderNotice,
  referenceCount = () => 0,
  blockedRemovalMessage,
  invalid = () => false,
  normalizeItems = items => items,
  onSave,
}: {
  initialItems: T[];
  createItem(): T;
  getKey(item: T): string;
  texts: CatalogSectionText<T>;
  renderEditor(item: T, context: CatalogEditorContext<T>): ReactNode;
  renderNotice?(item: T, items: T[]): ReactNode;
  referenceCount?(item: T): number;
  blockedRemovalMessage?(item: T, references: number): string | undefined;
  invalid?(item: T, items: T[]): boolean;
  normalizeItems?(items: T[]): T[];
  onSave(items: T[]): void;
}) {
  const [draft, setDraft] = useState<T[]>(() => structuredClone(initialItems));
  const [pendingRemoval, setPendingRemoval] = useState<T>();

  function replace(item: T, next: T) {
    const key = getKey(item);
    setDraft(current => current.map(candidate => (getKey(candidate) === key ? next : candidate)));
  }

  function requestRemoval(item: T) {
    const references = referenceCount(item);
    const blocked = blockedRemovalMessage?.(item, references);
    if (blocked) {
      window.alert(blocked);
      return;
    }
    setPendingRemoval(item);
  }

  function confirmRemoval() {
    if (!pendingRemoval) return;
    const key = getKey(pendingRemoval);
    setDraft(current => current.filter(item => getKey(item) !== key));
    setPendingRemoval(undefined);
  }

  return (
    <SettingsCard $wide>
      <SettingsSectionHeading>
        <div>
          <Eyebrow>{texts.eyebrow}</Eyebrow>
          <h2>{texts.title}</h2>
          <p>{texts.description}</p>
        </div>
        <Button onClick={() => setDraft(current => [...current, createItem()])}>
          {texts.addLabel}
        </Button>
      </SettingsSectionHeading>
      <div className="catalog-settings-list">
        {draft.map(item => {
          const references = referenceCount(item);
          return (
            <CardSurface className="catalog-settings-card" key={getKey(item)}>
              {renderEditor(item, {
                items: draft,
                replace: next => replace(item, next),
              })}
              {renderNotice?.(item, draft)}
              <div className="relation-actions">
                <small>
                  {references} {references === 1 ? "referencia" : "referencias"}
                </small>
                <Button variant="danger" size="compact" onClick={() => requestRemoval(item)}>
                  {texts.removeLabel}
                </Button>
              </div>
            </CardSurface>
          );
        })}
        {!draft.length && <p className="catalog-empty-state">{texts.emptyLabel}</p>}
      </div>
      <ModalActions $inline>
        <Button onClick={() => setDraft(structuredClone(initialItems))}>Descartar</Button>
        <Button
          variant="primary"
          disabled={draft.some(item => invalid(item, draft))}
          onClick={() => {
            const normalized = normalizeItems(draft);
            onSave(normalized);
            setDraft(structuredClone(normalized));
          }}
        >
          {texts.saveLabel}
        </Button>
      </ModalActions>
      {pendingRemoval && (
        <ConfirmationModal
          title={texts.removeTitle}
          message={texts.removeMessage(pendingRemoval, referenceCount(pendingRemoval))}
          confirmLabel={texts.removeLabel}
          onConfirm={confirmRemoval}
          onClose={() => setPendingRemoval(undefined)}
        />
      )}
    </SettingsCard>
  );
}
