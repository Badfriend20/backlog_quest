import type { BacklogData } from "../../../shared/kernel/backlog";
import { deviceName, formatDate, statusClass } from "../../../shared/kernel/backlogSelectors";
import { Button, StatusChip } from "../../../shared/ui";
import { HistoryScope } from "./HistoryStyles";

export function HistoryView({
  data,
  onSelectGame,
}: {
  data: BacklogData;
  onSelectGame: (id: string) => void;
}) {
  const rows = data.games
    .flatMap(game => game.playthroughs.map(play => ({ game, play })))
    .sort(
      (a, b) =>
        (b.play.finishedAt ?? b.play.startedAt ?? "").localeCompare(
          a.play.finishedAt ?? a.play.startedAt ?? ""
        ) || a.game.title.localeCompare(b.game.title, "es")
    );
  return (
    <HistoryScope>
      <p className="mobile-scroll-hint">Desliza horizontalmente para ver todas las columnas.</p>
      <section className="table-wrap" aria-label="Historial desplazable">
        <table>
          <thead>
            <tr>
              <th>Juego</th>
              <th>Partida</th>
              <th>Contenido</th>
              <th>Copia</th>
              <th>Estado</th>
              <th>Dispositivo</th>
              <th>Final</th>
              <th>Notas</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ game, play }) => {
              const copy = game.copies.find(item => item.id === play.copyId);
              return (
                <tr key={play.id}>
                  <td>
                    <button
                      type="button"
                      className="table-link"
                      onClick={() => onSelectGame(game.id)}
                    >
                      {game.title}
                    </button>
                  </td>
                  <td>#{play.number}</td>
                  <td>
                    {game.contents.find(content => content.id === play.contentId)?.title ??
                      "Campaña"}
                  </td>
                  <td>
                    {copy
                      ? `${copy.library} · ${copy.ownership}`
                      : play.platform || "Por confirmar"}
                  </td>
                  <td>
                    <StatusChip tone={statusClass(play.status)}>{play.status}</StatusChip>
                  </td>
                  <td>
                    {play.deviceId
                      ? deviceName(data, play.deviceId)
                      : play.device || "Por confirmar"}
                  </td>
                  <td>{formatDate(play.finishedAt)}</td>
                  <td>{play.notes || "—"}</td>
                  <td>
                    <Button size="compact" onClick={() => onSelectGame(game.id)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </HistoryScope>
  );
}
