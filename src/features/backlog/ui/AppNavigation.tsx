import { useId } from "react";
import type { AppView } from "../../../shared/kernel/quest";
import { useDismissiblePopover } from "../../../shared/ui";
import { useVocabulary } from "../../../shared/vocabulary";
import { NavigationItems, navigationItems } from "./NavigationItems";

interface AppNavigationProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}

export function AppNavigation({ activeView, onNavigate }: Readonly<AppNavigationProps>) {
  const terms = useVocabulary();
  const {
    open: mobileMenuOpen,
    rootRef: headerRef,
    triggerRef,
    toggle,
    close,
  } = useDismissiblePopover<HTMLElement>();
  const navigationId = useId();

  function navigate(view: AppView) {
    onNavigate(view);
    close();
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>

      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">
            👾
          </span>
          <div>
            <strong>Backlog Quest</strong>
            <small>Guardado local · v2.6.0</small>
          </div>
        </div>
        <nav aria-label="Navegación principal">
          <NavigationItems activeView={activeView} onNavigate={navigate} />
        </nav>
        <div className="sidebar-note">
          <span className="online-dot" />
          <span>Los cambios se guardan localmente.</span>
        </div>
      </aside>

      <header className="mobile-app-header" ref={headerRef}>
        <div className="mobile-header-bar">
          <div className="mobile-brand">
            <span className="brand-icon" aria-hidden="true">
              👾
            </span>
            <div>
              <strong>Backlog Quest</strong>
              <small>{navigationItems(terms).find(item => item.id === activeView)?.label}</small>
            </div>
          </div>
          <button
            ref={triggerRef}
            type="button"
            className="mobile-menu-button"
            aria-expanded={mobileMenuOpen}
            aria-controls={navigationId}
            aria-label={mobileMenuOpen ? "Cerrar navegación" : "Abrir navegación"}
            onClick={toggle}
          >
            <span aria-hidden="true">{mobileMenuOpen ? "×" : "☰"}</span>
          </button>
        </div>
        {mobileMenuOpen && (
          <>
            <button
              type="button"
              className="mobile-navigation-overlay"
              data-navigation-overlay
              aria-label="Cerrar navegación"
              onClick={() => close()}
            />
            <nav id={navigationId} className="mobile-navigation" aria-label="Navegación principal">
              <NavigationItems activeView={activeView} onNavigate={navigate} />
            </nav>
          </>
        )}
      </header>
    </>
  );
}
