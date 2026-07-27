import { useMemo } from "react";
import type { BacklogData } from "../../../shared/kernel/backlog";
import {
  formatDate,
  generateSchedule,
  getActiveSlotProfile,
  getWeekLabel,
} from "../../../shared/kernel/backlogSelectors";
import { ActiveMissionList } from "./ActiveMissionList";
import { ScheduleStyles } from "./ScheduleStyles";

export function ScheduleView({
  data,
  onEditMission,
}: {
  data: BacklogData;
  onEditMission: (missionId: string) => void;
}) {
  const generated = useMemo(() => generateSchedule(data), [data]);
  const grouped = useMemo(() => {
    const result = new Map<string, typeof generated>();
    generated.forEach(item => {
      const week = getWeekLabel(new Date(`${item.date}T12:00:00`), data.preferences.weekStartsOn);
      result.set(week, [...(result.get(week) ?? []), item]);
    });
    return [...result.entries()];
  }, [data.preferences.weekStartsOn, generated]);
  const profile = getActiveSlotProfile(data);
  return (
    <div className="stack-xl">
      <ScheduleStyles />
      <section className="callout">
        <strong>
          Franjas activas: {profile.slots[0].label} / {profile.slots[1].label}
        </strong>
        <p>
          El plan se genera desde reglas de misión. Terminar, pausar o aplazar elimina
          automáticamente sus sesiones futuras.
        </p>
      </section>
      <ActiveMissionList data={data} onEditMission={onEditMission} />
      {grouped.map(([week, items]) => (
        <section key={week}>
          <div className="section-heading">
            <h2>{week}</h2>
          </div>
          <div className="schedule-grid">
            {items.map(item => (
              <article className="schedule-card" key={item.id}>
                <div className="schedule-date">
                  <strong>{item.day}</strong>
                  <span>{formatDate(item.date)}</span>
                </div>
                {item.missions.length ? (
                  item.missions.map(({ mission, game, label, duration }) => (
                    <button
                      type="button"
                      className="schedule-mission"
                      key={mission.id}
                      onClick={() => onEditMission(mission.id)}
                    >
                      <span>{label}</span>
                      <strong>{game.title}</strong>
                      <small>
                        {mission.activeDevice} · {duration}
                      </small>
                    </button>
                  ))
                ) : (
                  <div className="schedule-rest">
                    <span>Descanso</span>
                    <small>Sin sesiones programadas.</small>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
