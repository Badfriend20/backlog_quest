import { useRef, useState } from "react";
import type { BacklogData } from "../../../shared/kernel/backlog";
import type { BacklogStorage } from "../../backlog";

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
    <section className="settings-card">
      <p className="eyebrow">PORTABILIDAD</p>
      <h2>Importar y exportar</h2>
      <p>
        El navegador guarda una copia local. El JSON v2 contiene catálogo, cola completa, misiones,
        calendario, configuración y actividad.
      </p>
      <div className="button-stack">
        <button type="button" className="primary-button" onClick={() => storage.export(data)}>
          Exportar JSON v2
        </button>
        <button type="button" className="ghost-button" onClick={() => inputRef.current?.click()}>
          Importar JSON v1 o v2
        </button>
        <input
          ref={inputRef}
          className="visually-hidden"
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
    </section>
  );
}
