import type { QuestData } from "../../../shared/kernel/quest";
import { FormGrid } from "../../../shared/ui";
import { getSlotLabel } from "../../../shared/kernel/questSelectors";
import type { GameEditorController } from "./useGameEditor";
import { GameContentsSection } from "./GameContentsSection";
import { activityStatusLabel, capitalizeTerm, useVocabulary } from "../../../shared/vocabulary";

export function GameGeneralPanel({
  data,
  editor,
}: {
  data: QuestData;
  editor: GameEditorController;
}) {
  const terms = useVocabulary();
  const { draft, setDraft, patch } = editor;
  const dependencyOptions = data.games
    .filter(game => game.id !== draft.id)
    .sort((left, right) => left.title.localeCompare(right.title, "es"));

  function addDependency(gameId: string) {
    if (!gameId || draft.dependencies.includes(gameId)) return;
    patch("dependencies", [...draft.dependencies, gameId]);
  }

  function removeDependency(gameId: string) {
    patch(
      "dependencies",
      draft.dependencies.filter(id => id !== gameId)
    );
  }

  return (
    <FormGrid className="editor-panel">
      <label className="wide-field">
        <span>Nombre</span>
        <input
          required
          value={draft.title}
          onChange={event => patch("title", event.target.value)}
        />
      </label>
      <label>
        <span>Estado</span>
        <select value={draft.status} onChange={event => patch("status", event.target.value)}>
          {data.catalogs.statuses.map(item => (
            <option key={item.id} value={item.label}>
              {activityStatusLabel(item.label, terms)}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Prioridad</span>
        <select value={draft.priority} onChange={event => patch("priority", event.target.value)}>
          {data.catalogs.priorities.map(item => (
            <option key={item.id} value={item.label}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Sesión sugerida</span>
        <select
          value={draft.suggestedSession}
          onChange={event => patch("suggestedSession", event.target.value)}
        >
          <option>{getSlotLabel(data, "first")}</option>
          <option>{getSlotLabel(data, "second")}</option>
          <option>{getSlotLabel(data, "secondary")}</option>
          <option>{getSlotLabel(data, "flexible")}</option>
        </select>
      </label>
      <label className="wide-field">
        <span>Punto actual</span>
        <input
          value={draft.progress.chapter}
          onChange={event =>
            setDraft(current => ({
              ...current,
              progress: { ...current.progress, chapter: event.target.value },
            }))
          }
          placeholder="Etapa, capítulo, módulo…"
        />
        <small>
          Se muestra en Colección y en las tarjetas de misión. Es informativo: no modifica el
          porcentaje, el orden ni el calendario.
        </small>
      </label>
      <label>
        <span>Terminaciones</span>
        <input
          type="number"
          min="0"
          value={draft.progress.completions}
          onChange={event =>
            setDraft(current => ({
              ...current,
              progress: {
                ...current.progress,
                completions: Number(event.target.value),
                replays: Math.max(0, Number(event.target.value) - 1),
              },
            }))
          }
        />
      </label>
      <label>
        <span>{capitalizeTerm(terms.repetitions)}</span>
        <input
          type="number"
          min="0"
          value={draft.progress.replays}
          onChange={event =>
            setDraft(current => ({
              ...current,
              progress: { ...current.progress, replays: Number(event.target.value) },
            }))
          }
        />
      </label>
      <label className="check-row wide-field">
        <input
          type="checkbox"
          checked={draft.private}
          onChange={event => patch("private", event.target.checked)}
        />
        <span>{capitalizeTerm(terms.activity)} privada</span>
      </label>
      <label className="wide-field">
        <span>Notas</span>
        <textarea
          rows={4}
          value={draft.notes}
          onChange={event => patch("notes", event.target.value)}
        />
      </label>
      <GameContentsSection editor={editor} />
      <fieldset className="wide-field planning-fields">
        <legend>Planificación</legend>
        <FormGrid $compact>
          <label>
            <span>Disponible desde</span>
            <input
              type="date"
              value={draft.availableFrom ?? ""}
              onChange={event => patch("availableFrom", event.target.value || null)}
            />
            <small>La lista mostrará esta fecha como referencia.</small>
          </label>
          <label>
            <span>Requiere completar antes</span>
            <select value="" onChange={event => addDependency(event.target.value)}>
              <option value="">Agregar {terms.activity} previa…</option>
              {dependencyOptions.map(game => (
                <option
                  key={game.id}
                  value={game.id}
                  disabled={draft.dependencies.includes(game.id)}
                >
                  {game.title}
                </option>
              ))}
            </select>
            <small>Las dependencias pendientes bloquean la {terms.activity} en la lista.</small>
          </label>
        </FormGrid>
        {draft.dependencies.length > 0 && (
          <div className="dependency-selection">
            {draft.dependencies.map(id => (
              <span key={id}>
                {data.games.find(game => game.id === id)?.title ?? id}
                <button
                  type="button"
                  aria-label={`Quitar dependencia ${id}`}
                  onClick={() => removeDependency(id)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </fieldset>
    </FormGrid>
  );
}
