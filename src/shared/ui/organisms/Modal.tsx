import type React from "react";
import styled from "styled-components";
import { Eyebrow } from "../layout";

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
  return (
    <Backdrop>
      <DismissLayer type="button" aria-label="Cerrar modal" onClick={onClose} />
      <Dialog open $large={size === "large"} aria-modal="true" aria-label={title}>
        <Header>
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2>{title}</h2>
          </div>
          <CloseButton type="button" onClick={onClose} aria-label="Cerrar">
            X
          </CloseButton>
        </Header>
        {children}
      </Dialog>
    </Backdrop>
  );
}
