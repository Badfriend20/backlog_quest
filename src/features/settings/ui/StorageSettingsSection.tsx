import type { BacklogData } from "../../../shared/kernel/backlog";
import { activeMissions } from "../../../shared/kernel/backlogSelectors";

export function StorageSettingsSection({ data }: { data: BacklogData }) {
  return (
    <section className="settings-card">
      <p className="eyebrow">ALMACENAMIENTO</p>
      <h2>Qué se guarda</h2>
      <dl className="data-list">
        <div>
          <dt>Esquema</dt>
          <dd>v{data.schemaVersion}</dd>
        </div>
        <div>
          <dt>Juegos</dt>
          <dd>{data.games.length}</dd>
        </div>
        <div>
          <dt>Cola</dt>
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
    </section>
  );
}
