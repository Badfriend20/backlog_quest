import type {
  AppPreferences,
  AppView,
  BacklogData,
  CopyPlatform,
  Platform,
} from "../../../shared/kernel/backlog";
import { DashboardView } from "../../dashboard";
import { PlatformsView } from "../../devices";
import { HistoryView } from "../../history";
import { LibraryView } from "../../games";
import { QueueView } from "../../queue";
import { ScheduleView } from "../../schedule";
import { SettingsView } from "../../settings";
import type { BacklogStorage } from "../application/ports";

interface BacklogViewProps {
  view: AppView;
  data: BacklogData;
  storage: BacklogStorage;
  onOpenView(view: AppView): void;
  onSelectGame(id: string): void;
  onCreateGame(): void;
  onEditMission(id: string): void;
  onActivate(gameId: string): void;
  onMove(id: string, direction: -1 | 1): void;
  onPreferencesChange(patch: Partial<AppPreferences>, message: string): void;
  onPlatformsChange(platforms: Platform[]): void;
  onCopyPlatformsChange(platforms: CopyPlatform[]): void;
  onReplaceData(data: BacklogData): void;
  onReset(): void;
  missionActions: {
    onEditGame(id: string): void;
    onFinish(id: string): void;
    onDefer(id: string): void;
    onPause(id: string): void;
    onSendEnd(id: string): void;
    onAbandon(id: string): void;
    onEditMission(id: string): void;
  };
}

export function BacklogView(props: BacklogViewProps) {
  const { view, data } = props;
  switch (view) {
    case "queue":
      return <QueueView data={data} onActivate={props.onActivate} onMove={props.onMove} />;
    case "library":
      return (
        <LibraryView
          data={data}
          onSelectGame={props.onSelectGame}
          onCreateGame={props.onCreateGame}
          onActivate={props.onActivate}
        />
      );
    case "schedule":
      return <ScheduleView data={data} onEditMission={props.onEditMission} />;
    case "history":
      return <HistoryView data={data} onSelectGame={props.onSelectGame} />;
    case "platforms":
      return (
        <PlatformsView
          data={data}
          onSelectGame={props.onSelectGame}
          onEditMission={props.onEditMission}
          onPlatformsChange={props.onPlatformsChange}
        />
      );
    case "settings":
      return (
        <SettingsView
          data={data}
          storage={props.storage}
          onChange={props.onPreferencesChange}
          onCopyPlatformsChange={props.onCopyPlatformsChange}
          onReplaceData={props.onReplaceData}
          onReset={props.onReset}
        />
      );
    default:
      return (
        <DashboardView
          data={data}
          onOpenView={props.onOpenView}
          onActivate={props.onActivate}
          {...props.missionActions}
        />
      );
  }
}
