import type { AppView } from "../../../shared/kernel/quest";
import type { VocabularyTerms } from "../../../shared/kernel/quest";
import { capitalizeTerm, useVocabulary } from "../../../shared/vocabulary";

export function navigationItems(
  terms: VocabularyTerms
): ReadonlyArray<{ id: AppView; label: string; icon: string }> {
  return [
    { id: "dashboard", label: "Inicio", icon: "👾" },
    { id: "queue", label: "Lista", icon: "🎯" },
    { id: "library", label: capitalizeTerm(terms.collection), icon: "🗂️" },
    { id: "schedule", label: "Plan", icon: "📅" },
    { id: "history", label: "Historial", icon: "🏆" },
    { id: "platforms", label: capitalizeTerm(terms.resources), icon: "🧰" },
    { id: "settings", label: "Configuración", icon: "⚙️" },
  ];
}

interface NavigationItemsProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}

export function NavigationItems({ activeView, onNavigate }: Readonly<NavigationItemsProps>) {
  const terms = useVocabulary();
  return navigationItems(terms).map(item => (
    <button
      type="button"
      key={item.id}
      className={activeView === item.id ? "nav-button active" : "nav-button"}
      aria-current={activeView === item.id ? "page" : undefined}
      onClick={() => onNavigate(item.id)}
    >
      <span aria-hidden="true">{item.icon}</span>
      <span>{item.label}</span>
    </button>
  ));
}
