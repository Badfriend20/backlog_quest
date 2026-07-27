import type { BacklogData } from "../../../shared/kernel/backlog";
import { activeMissions, deviceName, getSlotLabel } from "../../../shared/kernel/backlogSelectors";

const DAYS = [
  { id: 1, label: "L" },
  { id: 2, label: "M" },
  { id: 3, label: "X" },
  { id: 4, label: "J" },
  { id: 5, label: "V" },
  { id: 6, label: "S" },
  { id: 0, label: "D" },
];

export function ActiveMissionList({
  data,
  onEditMission,
}: {
  data: BacklogData;
  onEditMission(missionId: string): void;
}) {
  const missions = activeMissions(data);

  return (
    <section className="plan-mission-manager">
      <div className="section-heading">
        <div>
          <p className="eyebrow">ACCESO PERMANENTE</p>
          <h2>Misiones activas ({missions.length})</h2>
          <p>Edita una misión aunque todavía no tenga días programados en el calendario.</p>
        </div>
      </div>
      <div className="plan-mission-list">
        {missions.map(mission => {
          const game = data.games.find(item => item.id === mission.gameId);
          const rule = data.scheduleRules.find(
            item => item.missionId === mission.id && item.enabled
          );
          const scheduledDays = DAYS.filter(day => rule?.weekdays.includes(day.id))
            .map(day => day.label)
            .join(" · ");
          const scheduleLabel = scheduledDays
            ? `${scheduledDays} · ${rule?.durationMin}–${rule?.durationMax} min`
            : "Sin días programados";

          return (
            <article className="plan-mission-row" key={mission.id}>
              <div>
                <strong>{game?.title ?? "Juego no disponible"}</strong>
                <span>{mission.contentTitle}</span>
              </div>
              <div className="plan-mission-meta">
                <span>{getSlotLabel(data, mission.slotId)}</span>
                <span>
                  {mission.activeDeviceId
                    ? deviceName(data, mission.activeDeviceId)
                    : mission.activeDevice}
                </span>
                <span className={scheduledDays ? "" : "unscheduled-label"}>{scheduleLabel}</span>
              </div>
              <button
                type="button"
                className="ghost-button compact"
                onClick={() => onEditMission(mission.id)}
              >
                Editar misión
              </button>
            </article>
          );
        })}
        {!missions.length && (
          <div className="empty-relation">No hay misiones activas para administrar.</div>
        )}
      </div>
    </section>
  );
}
