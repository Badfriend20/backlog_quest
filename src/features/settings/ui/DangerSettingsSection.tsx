import { useState } from "react";
import { Button, ConfirmationModal, Eyebrow } from "../../../shared/ui";

export function DangerSettingsSection({ onReset }: { onReset: () => void }) {
  const [confirmingReset, setConfirmingReset] = useState(false);

  function reset() {
    setConfirmingReset(false);
    onReset();
  }

  return (
    <SettingsCard $wide $danger>
      <Eyebrow>ZONA PELIGROSA</Eyebrow>
      <h2>Restaurar datos iniciales</h2>
      <p>Elimina cambios locales y vuelve al JSON incluido con la aplicación.</p>
      <Button variant="danger" onClick={() => setConfirmingReset(true)}>
        Restaurar respaldo inicial
      </Button>
      {confirmingReset && (
        <ConfirmationModal
          title="Restaurar datos iniciales"
          message="Se eliminarán todos los cambios locales y se restaurará el respaldo incluido."
          confirmLabel="Restaurar respaldo"
          onConfirm={reset}
          onClose={() => setConfirmingReset(false)}
        />
      )}
    </SettingsCard>
  );
}
import { SettingsCard } from "./SettingsStyles";
