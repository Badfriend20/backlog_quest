import type { QuestData } from "../../../shared/kernel/quest";
import { Eyebrow } from "../../../shared/ui";
import { SettingsCard } from "./SettingsStyles";
import { activeMissions } from "../../../shared/kernel/questSelectors";

export function StorageSettingsSection({ data }: { data: QuestData }) {
  return (
    <SettingsCard>
      <Eyebrow>ALMACENAMIENTO</Eyebrow>
      <h2>Qué se guarda</h2>
      <dl className="data-list">
        <div>
          <dt>Esquema</dt>
          <dd>v{data.schemaVersion}</dd>
        </div>
        <div>
          <dt>Actividades</dt>
          <dd>{data.games.length}</dd>
        </div>
        <div>
          <dt>Lista</dt>
          <dd>{data.queue.length}</dd>
        </div>
        <div>
          <dt>Misiones</dt>
          <dd>{activeMissions(data).length}</dd>
        </div>
        <div>
          <dt>Reglas</dt>
          <dd>{data.scheduleRules.length}</dd>
        </div>
        <div>
          <dt>Actualizado</dt>
          <dd>{new Date(data.meta.updatedAt).toLocaleString("es-MX")}</dd>
        </div>
      </dl>
    </SettingsCard>
  );
}
