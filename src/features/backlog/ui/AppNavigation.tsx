import { useEffect, useId, useRef, useState } from "react";
import type { AppView } from "../../../shared/kernel/quest";
import { useVocabulary } from "../../../shared/vocabulary";
import { NavigationItems, navigationItems } from "./NavigationItems";

interface AppNavigationProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}

export function AppNavigation({ activeView, onNavigate }: Readonly<AppNavigationProps>) {
  const terms = useVocabulary();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigationId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function closeFromOutside(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setMobileMenuOpen(false);
    }

    function closeWithEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMobileMenuOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, [mobileMenuOpen]);

  function navigate(view: AppView) {
    onNavigate(view);
    setMobileMenuOpen(false);
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
            onClick={() => setMobileMenuOpen(open => !open)}
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
              onClick={() => setMobileMenuOpen(false)}
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
