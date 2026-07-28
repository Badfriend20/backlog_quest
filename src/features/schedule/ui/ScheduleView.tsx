import { useMemo } from "react";
import type { BacklogData } from "../../../shared/kernel/backlog";
import { Callout, SectionHeading, Stack } from "../../../shared/ui";
import {
  formatDate,
  generateSchedule,
  getActiveSlotProfile,
  getWeekLabel,
  missionLinkState,
} from "../../../shared/kernel/backlogSelectors";
import { MissionLinkActions } from "../../missions";
import { ActiveMissionList } from "./ActiveMissionList";
import { ScheduleScope } from "./ScheduleStyles";

export function ScheduleView({
  data,
  onEditMission,
  onManageContentsForMission,
  onAddCopyForMission,
  onAddPlaythroughForMission,
}: {
  data: BacklogData;
  onEditMission: (missionId: string) => void;
  onManageContentsForMission: (missionId: string) => void;
  onAddCopyForMission: (missionId: string) => void;
  onAddPlaythroughForMission: (missionId: string) => void;
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
    <ScheduleScope>
      <Stack $space="xl">
        <Callout>
          <strong>
            Franjas activas: {profile.slots[0].label} / {profile.slots[1].label}
          </strong>
          <p>
            El plan se genera desde reglas de misión. Terminar, pausar o aplazar elimina
            automáticamente sus sesiones futuras.
          </p>
        </Callout>
        <ActiveMissionList
          data={data}
          onEditMission={onEditMission}
          onManageContentsForMission={onManageContentsForMission}
          onAddCopyForMission={onAddCopyForMission}
          onAddPlaythroughForMission={onAddPlaythroughForMission}
        />
        {grouped.map(([week, items]) => (
          <section key={week}>
            <SectionHeading>
              <h2>{week}</h2>
            </SectionHeading>
            <div className="schedule-grid">
              {items.map(item => (
                <article className="schedule-card" key={item.id}>
                  <div className="schedule-date">
                    <strong>{item.day}</strong>
                    <span>{formatDate(item.date)}</span>
                  </div>
                  {item.missions.length ? (
                    item.missions.map(({ mission, game, slotId, label, duration }) => {
                      const links = missionLinkState(data, mission);
                      return (
                        <article
                          className={
                            links.complete ? "schedule-mission" : "schedule-mission mission-alert"
                          }
                          key={`${mission.id}-${slotId}`}
                        >
                          <button
                            type="button"
                            className="schedule-mission-open"
                            onClick={() => onEditMission(mission.id)}
                          >
                            <span>{label}</span>
                            <strong>{game.title}</strong>
                            <small>
                              {mission.activeDevice} · {duration}
                            </small>
                          </button>
                          <MissionLinkActions
                            hasContent={links.hasContent}
                            hasCopy={links.hasCopy}
                            hasPlaythrough={links.hasPlaythrough}
                            canCreatePlaythrough={
                              game.copies.length > 0 && game.contents.length > 0
                            }
                            onManageContents={() => onManageContentsForMission(mission.id)}
                            onAddCopy={() => onAddCopyForMission(mission.id)}
                            onAddPlaythrough={() => onAddPlaythroughForMission(mission.id)}
                          />
                        </article>
                      );
                    })
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
      </Stack>
    </ScheduleScope>
  );
}
