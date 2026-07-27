import { useMemo, useState } from "react";
import type { BacklogData } from "../../../shared/kernel/backlog";
import {
  copyDeviceIds,
  deviceName,
  gameSearchText,
  normalize,
  statusClass,
} from "../../../shared/kernel/backlogSelectors";
import { GamesStyles } from "./GamesStyles";
const priorityOrder = new Map([
  ["S", 0],
  ["Alta", 1],
  ["Media", 2],
  ["Baja", 3],
]);

export function LibraryView({
  data,
  onSelectGame,
  onCreateGame,
  onActivate,
}: {
  data: BacklogData;
  onSelectGame: (id: string) => void;
  onCreateGame: () => void;
  onActivate: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [priority, setPriority] = useState("Todas");
  const [device, setDevice] = useState("Todos");
  const [showPrivate, setShowPrivate] = useState(!data.preferences.hidePrivateByDefault);
  const statuses = useMemo(
    () => [...new Set(data.games.map(game => game.status))].sort(),
    [data.games]
  );
  const devices = useMemo(
    () =>
      data.platforms
        .filter(platform => platform.active)
        .map(platform => platform.name)
        .sort((a, b) => a.localeCompare(b, "es")),
    [data.platforms]
  );
  const normalizedQuery = normalize(query);
  const filtered = useMemo(
    () =>
      data.games
        .filter(game => showPrivate || !game.private)
        .filter(game => !normalizedQuery || gameSearchText(game).includes(normalizedQuery))
        .filter(game => status === "Todos" || game.status === status)
        .filter(game => priority === "Todas" || game.priority === priority)
        .filter(
          game =>
            device === "Todos" ||
            game.copies.some(copy =>
              copyDeviceIds(data, copy).some(id => deviceName(data, id) === device)
            )
        )
        .sort(
          (a, b) =>
            (priorityOrder.get(a.priority) ?? 99) - (priorityOrder.get(b.priority) ?? 99) ||
            a.title.localeCompare(b.title, "es")
        ),
    [data, device, normalizedQuery, priority, showPrivate, status]
  );
  return (
    <div className="stack-lg">
      <GamesStyles />
      <section className="filter-panel">
        <label className="search-field">
          <span>Buscar</span>
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Juego, contenido, dispositivo…"
          />
        </label>
        <label>
          <span>Estado</span>
          <select value={status} onChange={event => setStatus(event.target.value)}>
            <option>Todos</option>
            {statuses.map(item => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Prioridad</span>
          <select value={priority} onChange={event => setPriority(event.target.value)}>
            <option>Todas</option>
            {data.catalogs.priorities.map(item => (
              <option key={item.id} value={item.label}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Dispositivo</span>
          <select value={device} onChange={event => setDevice(event.target.value)}>
            <option>Todos</option>
            {devices.map(item => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={showPrivate}
            onChange={event => setShowPrivate(event.target.checked)}
          />
          <span>Mostrar privados</span>
        </label>
      </section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">CATÁLOGO</p>
          <h2>{filtered.length} resultados</h2>
        </div>
        <button type="button" className="primary-button" onClick={onCreateGame}>
          + Agregar juego
        </button>
      </div>
      <section className="library-grid">
        {filtered.map(game => {
          const active = data.missions.some(
            mission => mission.gameId === game.id && mission.status === "active"
          );
          return (
            <article className="game-card library-card" key={game.id}>
              <button type="button" className="card-open" onClick={() => onSelectGame(game.id)}>
                <div className="card-topline">
                  <span className={`status-pill ${statusClass(game.status)}`}>{game.status}</span>
                  <span className="priority-chip">{game.priority}</span>
                </div>
                <h3>
                  {game.private ? "🔒 " : ""}
                  {game.title}
                </h3>
                <p>{game.progress.chapter || game.notes || "Sin notas."}</p>
                <div className="progress-row">
                  <span>{game.progress.completions} terminaciones</span>
                  <span>{game.progress.replays} rejugadas</span>
                </div>
                <div className="copy-chips">
                  {game.copies.slice(0, 3).map(copy => (
                    <span key={copy.id}>{copy.library}</span>
                  ))}
                  {game.copies.length > 3 && <span>+{game.copies.length - 3}</span>}
                </div>
              </button>
              {!active && (
                <button
                  type="button"
                  className="ghost-button compact full-width"
                  onClick={() => onActivate(game.id)}
                >
                  Activar misión
                </button>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}
