import type { AppView } from "../../../shared/kernel/backlog";

export const NAV_ITEMS: ReadonlyArray<{ id: AppView; label: string; icon: string }> = [
  { id: "dashboard", label: "Inicio", icon: "👾" },
  { id: "queue", label: "Cola", icon: "🎯" },
  { id: "library", label: "Biblioteca", icon: "🎮" },
  { id: "schedule", label: "Plan", icon: "📅" },
  { id: "history", label: "Historial", icon: "🏆" },
  { id: "platforms", label: "Dispositivos", icon: "🕹️" },
  { id: "settings", label: "Configuración", icon: "⚙️" },
];

interface NavigationItemsProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}

export function NavigationItems({ activeView, onNavigate }: Readonly<NavigationItemsProps>) {
  return NAV_ITEMS.map(item => (
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
