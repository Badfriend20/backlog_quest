import type { Activity } from "../../../shared/kernel/quest";
import { normalize } from "../../../shared/kernel/questSelectors";

export type LibrarySort = "unfinished-title" | "title" | "priority" | "recent";

const priorityOrder = new Map([
  ["S", 0],
  ["Alta", 1],
  ["Media", 2],
  ["Baja", 3],
]);

function isClosed(game: Activity): boolean {
  return ["terminado", "completado", "abandonado"].includes(normalize(game.status));
}

export function sortLibraryGames(games: Activity[], order: LibrarySort): Activity[] {
  return [...games].sort((left, right) => {
    if (order === "unfinished-title") {
      const closedOrder = Number(isClosed(left)) - Number(isClosed(right));
      if (closedOrder !== 0) return closedOrder;
    }
    if (order === "priority") {
      const priority =
        (priorityOrder.get(left.priority) ?? 99) - (priorityOrder.get(right.priority) ?? 99);
      if (priority !== 0) return priority;
    }
    if (order === "recent") {
      const activity = (right.progress.lastPlayedAt ?? "").localeCompare(
        left.progress.lastPlayedAt ?? ""
      );
      if (activity !== 0) return activity;
    }
    return left.title.localeCompare(right.title, "es");
  });
}
