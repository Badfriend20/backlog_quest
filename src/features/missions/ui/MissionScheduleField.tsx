import { useState } from "react";
import type { BacklogData, ScheduleSession } from "../../../shared/kernel/backlog";
import { getSlotLabel } from "../../../shared/kernel/backlogSelectors";
import {
  groupScheduleSessions,
  MISSION_SLOT_IDS,
  scheduleGroupsToSessions,
  type ScheduleGroup,
  toggleScheduleWeekday,
  WEEKDAY_OPTIONS,
} from "../../../shared/kernel/schedule";
import { Button } from "../../../shared/ui";

export function MissionScheduleField({
  data,
  sessions,
  onChange,
}: {
  data: BacklogData;
  sessions: ScheduleSession[];
  onChange(sessions: ScheduleSession[]): void;
}) {
  const [groups, setGroups] = useState<ScheduleGroup[]>(() => groupScheduleSessions(sessions));
  const availableSlot = MISSION_SLOT_IDS.find(
    slotId => !groups.some(group => group.slotId === slotId)
  );

  function updateGroups(next: ScheduleGroup[]) {
    setGroups(next);
    onChange(scheduleGroupsToSessions(next));
  }

  function addGroup() {
    if (availableSlot) setGroups(current => [...current, { slotId: availableSlot, weekdays: [] }]);
  }

  function changeGroupSlot(currentSlotId: string, nextSlotId: string) {
    updateGroups(
      groups.map(group =>
        group.slotId === currentSlotId ? { ...group, slotId: nextSlotId } : group
      )
    );
  }

  function toggleWeekday(slotId: string, weekday: number) {
    updateGroups(toggleScheduleWeekday(groups, slotId, weekday));
  }

  function removeGroup(slotId: string) {
    updateGroups(groups.filter(group => group.slotId !== slotId));
  }

  return (
    <fieldset className="wide-field mission-schedule-field">
      <legend>Franjas programadas</legend>
      <div className="mission-schedule-list">
        {groups.map((group, index) => (
          <div className="mission-schedule-row" key={group.slotId}>
            <div className="mission-schedule-heading">
              <label>
                <span>Franja {index + 1}</span>
                <select
                  value={group.slotId}
                  onChange={event => changeGroupSlot(group.slotId, event.target.value)}
                >
                  {MISSION_SLOT_IDS.map(slotId => (
                    <option
                      key={slotId}
                      value={slotId}
                      disabled={groups.some(
                        candidate =>
                          candidate.slotId === slotId && candidate.slotId !== group.slotId
                      )}
                    >
                      {getSlotLabel(data, slotId)}
                    </option>
                  ))}
                </select>
              </label>
              <Button
                variant="danger"
                size="compact"
                aria-label={`Eliminar franja ${getSlotLabel(data, group.slotId)}`}
                onClick={() => removeGroup(group.slotId)}
              >
                Eliminar franja
              </Button>
            </div>
            <div
              className="weekday-toggles"
              aria-label={`Días de ${getSlotLabel(data, group.slotId)}`}
            >
              {WEEKDAY_OPTIONS.map(day => {
                const active = group.weekdays.includes(day.id);
                return (
                  <button
                    type="button"
                    key={day.id}
                    className={active ? "weekday-toggle active" : "weekday-toggle"}
                    aria-pressed={active}
                    aria-label={day.longLabel}
                    onClick={() => toggleWeekday(group.slotId, day.id)}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
            {!group.weekdays.length && (
              <small>Selecciona al menos un día para agregar esta franja al plan.</small>
            )}
          </div>
        ))}
      </div>
      {!groups.length && (
        <small>Sin franjas: la misión permanece activa, pero no aparece en el calendario.</small>
      )}
      <Button size="compact" disabled={!availableSlot} onClick={addGroup}>
        {availableSlot ? "+ Agregar franja" : "Ya están activas las cuatro franjas"}
      </Button>
    </fieldset>
  );
}
