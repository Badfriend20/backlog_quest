import type React from "react";
import { useEffect, useId } from "react";
import styled from "styled-components";
import { Eyebrow } from "../layout";

const MODAL_HISTORY_KEY = "backlogQuestModal";

interface ModalHistoryEntry {
  id: string;
  marker: string;
  close(): void;
  cleanupTimer?: number;
}

const modalHistoryStack: ModalHistoryEntry[] = [];
let modalHistoryListening = false;

function currentModalMarker() {
  const state = window.history.state as Record<string, unknown> | null;
  return state?.[MODAL_HISTORY_KEY];
}

function stopModalHistoryListeners() {
  if (!modalHistoryListening || modalHistoryStack.length) return;
  window.removeEventListener("popstate", closeTopModalFromHistory);
  window.removeEventListener("keydown", closeTopModalWithEscape);
  modalHistoryListening = false;
}

function closeTopModalFromHistory() {
  const entry = modalHistoryStack.at(-1);
  if (!entry || currentModalMarker() === entry.marker) return;
  modalHistoryStack.pop();
  entry.close();
  stopModalHistoryListeners();
}

function requestModalClose(id: string) {
  const entry = modalHistoryStack.find(item => item.id === id);
  if (!entry) return;
  if (currentModalMarker() === entry.marker) {
    window.history.back();
    return;
  }
  modalHistoryStack.splice(modalHistoryStack.indexOf(entry), 1);
  entry.close();
  stopModalHistoryListeners();
}

function closeTopModalWithEscape(event: KeyboardEvent) {
  if (event.key !== "Escape") return;
  const entry = modalHistoryStack.at(-1);
  if (entry) requestModalClose(entry.id);
}

function registerModalHistory(id: string, close: () => void) {
  const existing = modalHistoryStack.find(entry => entry.id === id);
  if (existing) {
    if (existing.cleanupTimer) window.clearTimeout(existing.cleanupTimer);
    existing.cleanupTimer = undefined;
    existing.close = close;
    return;
  }

  const marker = `${id}-${Date.now()}`;
  const previousState = window.history.state;
  const safeState =
    previousState && typeof previousState === "object"
      ? (previousState as Record<string, unknown>)
      : {};
  window.history.pushState({ ...safeState, [MODAL_HISTORY_KEY]: marker }, "");
  modalHistoryStack.push({ id, marker, close });

  if (!modalHistoryListening) {
    window.addEventListener("popstate", closeTopModalFromHistory);
    window.addEventListener("keydown", closeTopModalWithEscape);
    modalHistoryListening = true;
  }
}

function unregisterModalHistory(id: string) {
  const entry = modalHistoryStack.find(item => item.id === id);
  if (!entry) return;
  entry.cleanupTimer = window.setTimeout(() => {
    const current = modalHistoryStack.find(item => item.id === id);
    if (!current) return;
    modalHistoryStack.splice(modalHistoryStack.indexOf(current), 1);
    if (currentModalMarker() === current.marker) window.history.back();
    stopModalHistoryListeners();
  }, 0);
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(4, 2, 8, 0.78);

  @media (max-width: 760px) {
    padding: 8px;
  }
`;

const DismissLayer = styled.button`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: default;
`;

const Dialog = styled.dialog<{ $large: boolean }>`
  position: relative;
  z-index: 1;
  width: ${({ $large }) => ($large ? "min(1400px, calc(100vw - 36px))" : "min(820px, 100%)")};
  max-height: ${({ $large }) => ($large ? "94vh" : "92vh")};
  margin: 0;
  padding: 22px;
  overflow-y: auto;
  border: 2px solid var(--purple);
  background: #100b1b;
  color: var(--text);
  box-shadow: 8px 8px 0 #050308;

  @media (max-width: 760px) {
    width: 100%;
    max-height: calc(100dvh - 16px);
    padding: 16px;
  }
`;

const Header = styled.div`
  position: sticky;
  top: -22px;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin: -22px -22px 22px;
  padding: 22px;
  border-bottom: 1px solid var(--border);
  background: inherit;

  @media (max-width: 760px) {
    top: -16px;
    margin: -16px -16px 18px;
    padding: 16px;
  }
`;

const CloseButton = styled.button`
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border: 0;
  border-radius: 8px;
  background: var(--panel-2);
  color: inherit;
  font: inherit;
  font-size: 1.6rem;
  cursor: pointer;
`;

export function Modal({
  title,
  eyebrow,
  onClose,
  children,
  size = "default",
}: Readonly<{
  title: string;
  eyebrow: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "default" | "large";
}>) {
  const modalId = useId();

  useEffect(() => {
    registerModalHistory(modalId, onClose);
    return () => unregisterModalHistory(modalId);
  }, [modalId, onClose]);

  return (
    <Backdrop>
      <DismissLayer
        type="button"
        aria-label="Cerrar modal"
        onClick={() => requestModalClose(modalId)}
      />
      <Dialog open $large={size === "large"} aria-modal="true" aria-label={title}>
        <Header>
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2>{title}</h2>
          </div>
          <CloseButton type="button" onClick={() => requestModalClose(modalId)} aria-label="Cerrar">
            X
          </CloseButton>
        </Header>
        {children}
      </Dialog>
    </Backdrop>
  );
}
