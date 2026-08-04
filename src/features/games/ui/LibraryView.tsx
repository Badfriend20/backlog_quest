import { useMemo, useState } from "react";
import type { QuestData } from "../../../shared/kernel/quest";
import {
  Button,
  CardOpenButton,
  CardTopline,
  CheckRow,
  ChipList,
  Eyebrow,
  LibraryCard,
  LibraryGrid,
  PriorityChip,
  ProgressRow,
  SectionHeading,
  Stack,
  StatusChip,
} from "../../../shared/ui";
import {
  copyDeviceIds,
  deviceName,
  gameSearchText,
  normalize,
  statusClass,
} from "../../../shared/kernel/questSelectors";
import { sortLibraryGames, type LibrarySort } from "../domain/librarySort";
import { GamesScope } from "./GamesStyles";
import { activityStatusLabel, capitalizeTerm, useVocabulary } from "../../../shared/vocabulary";

export function LibraryView({
  data,
  onSelectGame,
  onCreateGame,
  onActivate,
}: {
  data: QuestData;
  onSelectGame: (id: string) => void;
  onCreateGame: () => void;
  onActivate: (id: string) => void;
}) {
  const terms = useVocabulary();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [priority, setPriority] = useState("Todas");
  const [device, setDevice] = useState("Todos");
  const [order, setOrder] = useState<LibrarySort>("unfinished-title");
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
      sortLibraryGames(
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
          ),
        order
      ),
    [data, device, normalizedQuery, order, priority, showPrivate, status]
  );
  return (
    <GamesScope>
      <Stack>
        <section className="filter-panel">
          <label className="search-field">
            <span>Buscar</span>
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder={`${capitalizeTerm(terms.activity)}, ${terms.content}, ${terms.resource}…`}
            />
          </label>
          <label>
            <span>Estado</span>
            <select value={status} onChange={event => setStatus(event.target.value)}>
              <option>Todos</option>
              {statuses.map(item => (
                <option key={item} value={item}>
                  {activityStatusLabel(item, terms)}
                </option>
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
            <span>{capitalizeTerm(terms.resource)}</span>
            <select value={device} onChange={event => setDevice(event.target.value)}>
              <option>Todos</option>
              {devices.map(item => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Orden de {capitalizeTerm(terms.collection)}</span>
            <select value={order} onChange={event => setOrder(event.target.value as LibrarySort)}>
              <option value="unfinished-title">Pendientes primero · A–Z</option>
              <option value="title">Alfabético · A–Z</option>
              <option value="priority">Prioridad</option>
              <option value="recent">Actividad reciente</option>
            </select>
          </label>
          <CheckRow>
            <input
              type="checkbox"
              checked={showPrivate}
              onChange={event => setShowPrivate(event.target.checked)}
            />
            <span>Mostrar privados</span>
          </CheckRow>
        </section>
        <SectionHeading>
          <div>
            <Eyebrow>CATÁLOGO</Eyebrow>
            <h2>{filtered.length} resultados</h2>
          </div>
          <Button variant="primary" onClick={onCreateGame}>
            + Agregar {terms.activity}
          </Button>
        </SectionHeading>
        <LibraryGrid>
          {filtered.map(game => {
            const active = data.missions.some(
              mission => mission.gameId === game.id && mission.status === "active"
            );
            return (
              <LibraryCard key={game.id}>
                <CardOpenButton type="button" onClick={() => onSelectGame(game.id)}>
                  <CardTopline>
                    <StatusChip tone={statusClass(game.status)}>
                      {activityStatusLabel(game.status, terms)}
                    </StatusChip>
                    <PriorityChip>{game.priority}</PriorityChip>
                  </CardTopline>
                  <h3>
                    {game.private ? "🔒 " : ""}
                    {game.title}
                  </h3>
                  <p>
                    {game.progress.chapter
                      ? `Punto actual: ${game.progress.chapter}`
                      : game.notes || "Sin notas."}
                  </p>
                  <ProgressRow>
                    <span>{game.progress.completions} terminaciones</span>
                    <span>
                      {game.progress.replays} {terms.repetitions}
                    </span>
                  </ProgressRow>
                  <ChipList>
                    {game.copies.slice(0, 3).map(copy => (
                      <span key={copy.id}>{copy.library}</span>
                    ))}
                    {game.copies.length > 3 && <span>+{game.copies.length - 3}</span>}
                  </ChipList>
                </CardOpenButton>
                {!active && (
                  <Button size="compact" fullWidth onClick={() => onActivate(game.id)}>
                    Activar misión
                  </Button>
                )}
              </LibraryCard>
            );
          })}
        </LibraryGrid>
      </Stack>
    </GamesScope>
  );
}
