import type { AppView } from "../../../shared/kernel/backlog";
import { Button, Eyebrow } from "../../../shared/ui";
import { NAV_ITEMS } from "./NavigationItems";

export function AppTopbar({
  view,
  onExport,
  onCreateGame,
}: {
  view: AppView;
  onExport(): void;
  onCreateGame(): void;
}) {
  return (
    <header className="topbar">
      <div>
        <Eyebrow>PARTIDA LOCAL</Eyebrow>
        <h1>{NAV_ITEMS.find(item => item.id === view)?.label}</h1>
      </div>
      <div className="topbar-actions">
        <Button onClick={onExport}>Exportar JSON</Button>
        <Button variant="primary" onClick={onCreateGame}>
          + Juego
        </Button>
      </div>
    </header>
  );
}
