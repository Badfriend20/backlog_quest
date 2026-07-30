import { useState } from "react";
import { Button, CardActions, Callout, ConfirmationModal, Eyebrow } from "../../../shared/ui";
import type { BacklogStorage } from "../../backlog";
import { EXAMPLE_DATASETS, type ExampleDatasetDefinition } from "../domain/exampleDatasets";
import {
  ExampleActionGuide,
  ExampleDatasetCard,
  ExampleDatasetGrid,
  SettingsCard,
} from "./SettingsStyles";

function exampleDatasetUrl(definition: ExampleDatasetDefinition): string {
  return new URL(`examples/${definition.fileName}`, document.baseURI).toString();
}

export function ExampleDataSettingsSection({
  storage,
  demoActive,
  onStartDemo,
  onRestoreDemo,
  onKeepDemo,
}: {
  storage: BacklogStorage;
  demoActive: boolean;
  onStartDemo: (data: ReturnType<BacklogStorage["parse"]>) => void;
  onRestoreDemo: () => void;
  onKeepDemo: () => void;
}) {
  const [loadingId, setLoadingId] = useState("");
  const [error, setError] = useState("");
  const [confirmingKeep, setConfirmingKeep] = useState(false);

  async function startExample(definition: ExampleDatasetDefinition) {
    setLoadingId(definition.id);
    setError("");
    try {
      const response = await fetch(exampleDatasetUrl(definition));
      if (!response.ok) throw new Error(`No se pudo cargar el ejemplo (${response.status}).`);
      onStartDemo(storage.parse(await response.text()));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo cargar el ejemplo.");
    } finally {
      setLoadingId("");
    }
  }

  function keepExample() {
    setConfirmingKeep(false);
    onKeepDemo();
  }

  return (
    <SettingsCard $wide>
      <Eyebrow>LABORATORIO</Eyebrow>
      <h2>Datos de ejemplo</h2>
      <p>
        Explora cada tipo de actividad con 15 casos ficticios que combinan estados, prioridades,
        modalidades, accesos, recursos, contenidos, recorridos, lista, misiones y calendario.
      </p>

      <ExampleActionGuide aria-label="Cómo usar los datos de ejemplo">
        <div id="temporary-example-help">
          <strong>Probar temporalmente</strong>
          <span>
            Guarda tus datos actuales en un respaldo separado, abre el ejemplo y te permite
            restaurarlos después.
          </span>
        </div>
        <div id="download-example-help">
          <strong>Descargar JSON</strong>
          <span>
            Sólo descarga el archivo de ejemplo para importarlo o revisarlo después; no cambia tus
            datos actuales.
          </span>
        </div>
      </ExampleActionGuide>

      {demoActive && (
        <Callout $compact>
          <strong>Demostración temporal activa</strong>
          <p>
            Tu primer estado real sigue respaldado aunque cambies de ejemplo o recargues la
            aplicación.
          </p>
          <CardActions>
            <Button variant="primary" onClick={onRestoreDemo}>
              Restaurar mis datos
            </Button>
            <Button variant="danger" onClick={() => setConfirmingKeep(true)}>
              Conservar demo como mis datos
            </Button>
          </CardActions>
        </Callout>
      )}

      <ExampleDatasetGrid>
        {EXAMPLE_DATASETS.map(definition => {
          const url = exampleDatasetUrl(definition);
          const loading = loadingId === definition.id;
          let actionLabel = demoActive ? "Cambiar a este ejemplo" : "Probar temporalmente";
          if (loading) actionLabel = "Cargando…";
          return (
            <ExampleDatasetCard key={definition.id}>
              <div>
                <strong>{definition.label}</strong>
                <span>15 actividades</span>
              </div>
              <p>{definition.description}</p>
              <CardActions>
                <Button
                  size="compact"
                  disabled={Boolean(loadingId)}
                  aria-describedby="temporary-example-help"
                  onClick={() => startExample(definition)}
                >
                  {actionLabel}
                </Button>
                <a
                  href={url}
                  download={definition.fileName}
                  aria-describedby="download-example-help"
                >
                  Descargar JSON
                </a>
              </CardActions>
            </ExampleDatasetCard>
          );
        })}
      </ExampleDatasetGrid>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {confirmingKeep && (
        <ConfirmationModal
          title="Conservar datos de demostración"
          message="El respaldo temporal de tus datos anteriores se eliminará y el ejemplo actual quedará como estado principal. Si necesitas conservar ambos, descarga primero el JSON del ejemplo, restaura tus datos y expórtalos."
          confirmLabel="Conservar demostración"
          onConfirm={keepExample}
          onClose={() => setConfirmingKeep(false)}
        />
      )}
    </SettingsCard>
  );
}
