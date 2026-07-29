import { useRef, useState } from "react";
import type { BacklogData } from "../../../shared/kernel/backlog";
import { Button, Eyebrow } from "../../../shared/ui";
import type { BacklogStorage } from "../../backlog";
import { SettingsCard } from "./SettingsStyles";

export function PortabilitySettingsSection({
  data,
  storage,
  onReplaceData,
}: {
  data: BacklogData;
  storage: BacklogStorage;
  onReplaceData: (data: BacklogData) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  async function importFile(file: File | undefined) {
    if (!file) return;
    try {
      onReplaceData(storage.parse(await file.text()));
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo importar el archivo.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }
  return (
    <SettingsCard>
      <Eyebrow>PORTABILIDAD</Eyebrow>
      <h2>Importar y exportar</h2>
      <p>
        El navegador guarda una copia local. El JSON v2 contiene catálogo, lista completa, misiones,
        calendario, configuración y actividad.
      </p>
      <div className="button-stack">
        <Button variant="primary" onClick={() => storage.export(data)}>
          Exportar JSON v2
        </Button>
        <Button onClick={() => inputRef.current?.click()}>Importar JSON v1 o v2</Button>
        <input
          ref={inputRef}
          hidden
          type="file"
          accept="application/json,.json"
          onChange={event => importFile(event.target.files?.[0])}
        />
      </div>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
    </SettingsCard>
  );
}
