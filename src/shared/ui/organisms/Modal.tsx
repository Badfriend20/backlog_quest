import type React from "react";

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
    <div className="modal-backdrop">
      <button
        type="button"
        className="modal-dismiss-layer"
        aria-label="Cerrar modal"
        onClick={onClose}
      />
      <dialog
        open
        className={size === "large" ? "modal modal-large" : "modal"}
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar">
            X
          </button>
        </div>
        {children}
      </dialog>
    </div>
  );
}
