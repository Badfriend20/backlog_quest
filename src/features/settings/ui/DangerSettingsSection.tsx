import { useState } from "react";
import { ConfirmationModal } from "../../../shared/ui";

export function DangerSettingsSection({ onReset }: { onReset: () => void }) {
  const [confirmingReset, setConfirmingReset] = useState(false);

  function reset() {
    setConfirmingReset(false);
    onReset();
  }

  return (
    <section className="settings-card danger-zone wide">
      <p className="eyebrow">ZONA PELIGROSA</p>
      <h2>Restaurar datos iniciales</h2>
      <p>Elimina cambios locales y vuelve al JSON incluido con la aplicación.</p>
      <button type="button" className="danger-button" onClick={() => setConfirmingReset(true)}>
        Restaurar respaldo inicial
      </button>
      {confirmingReset && (
        <ConfirmationModal
          title="Restaurar datos iniciales"
          message="Se eliminarán todos los cambios locales y se restaurará el respaldo incluido."
          confirmLabel="Restaurar respaldo"
          onConfirm={reset}
          onClose={() => setConfirmingReset(false)}
        />
      )}
    </section>
  );
}
