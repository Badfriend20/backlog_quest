import type { AppView } from "../../../shared/kernel/quest";
import { Button, Eyebrow } from "../../../shared/ui";
import { capitalizeTerm, useVocabulary } from "../../../shared/vocabulary";
import { navigationItems } from "./NavigationItems";

export function AppTopbar({
  view,
  onExport,
  onCreateGame,
}: {
  view: AppView;
  onExport(): void;
  onCreateGame(): void;
}) {
  const terms = useVocabulary();
  return (
    <header className="topbar">
      <div>
        <Eyebrow>PROGRESO LOCAL</Eyebrow>
        <h1>{navigationItems(terms).find(item => item.id === view)?.label}</h1>
      </div>
      <div className="topbar-actions">
        <Button onClick={onExport}>Exportar JSON</Button>
        <Button variant="primary" onClick={onCreateGame}>
          + {capitalizeTerm(terms.activity)}
        </Button>
      </div>
    </header>
  );
}
