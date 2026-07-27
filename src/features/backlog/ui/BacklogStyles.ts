import { createGlobalStyle } from "styled-components";

export const BacklogStyles = createGlobalStyle`


.app-shell {
  display: grid;
  grid-template-columns: 236px minmax(0, 1fr);
  min-height: 100vh;
}
.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 22px 16px;
  border-right: 1px solid var(--border);
  background: rgba(13, 10, 23, 0.94);
  backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;
  z-index: 10;
}
.mobile-app-header {
  display: none;
}
.skip-link {
  position: fixed;
  top: 8px;
  left: 8px;
  z-index: 100;
  padding: 10px 14px;
  color: var(--text);
  background: var(--panel-3);
  border: 2px solid var(--cyan);
  transform: translateY(-160%);
}
.skip-link:focus {
  transform: translateY(0);
}
.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px 8px 24px;
}
.brand-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  background: var(--panel-3);
  border: 2px solid var(--purple);
  box-shadow: 4px 4px 0 #08060e;
  font-size: 1.35rem;
  image-rendering: pixelated;
}
.brand strong {
  display: block;
}
.brand small {
  display: block;
}
.brand strong {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
.brand small {
  margin-top: 2px;
}
.nav-button {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid transparent;
  background: transparent;
  padding: 11px 12px;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  color: var(--muted);
}
.nav-button:hover {
  background: var(--panel);
  color: var(--text);
}
.sidebar-note {
  margin-top: auto;
  display: flex;
  gap: 8px;
  align-items: center;
  color: var(--muted);
  font-size: 0.78rem;
  padding: 12px 8px;
}
.online-dot {
  width: 8px;
  height: 8px;
  background: var(--green);
  box-shadow: 0 0 12px var(--green);
}
.main-content {
  min-width: 0;
  padding: 0 28px 56px;
}
.topbar {
  min-height: 104px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid rgba(68, 55, 98, 0.65);
  margin-bottom: 28px;
}
.topbar-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.toast {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 70;
  max-width: min(420px, calc(100vw - 36px));
  background: #201735;
  border: 1px solid var(--cyan);
  box-shadow: 5px 5px 0 #050308;
  padding: 13px 16px;
}
@media (max-width: 760px) {
  .app-shell {
    display: block;
  }
  .sidebar {
    display: none;
  }
  .mobile-app-header {
    display: block;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 30;
    background: rgba(13, 10, 23, 0.97);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(18px);
  }
  .mobile-header-bar {
    min-height: 64px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .mobile-brand {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .mobile-brand .brand-icon {
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
  }
  .mobile-brand strong {
    display: block;
  }
  .mobile-brand small {
    display: block;
  }
  .mobile-brand strong {
    overflow: hidden;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .mobile-brand small {
    margin-top: 2px;
  }
  .mobile-menu-button {
    width: 44px;
    height: 44px;
    flex: 0 0 auto;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--panel-2);
    color: var(--text);
    cursor: pointer;
    font-size: 1.55rem;
    line-height: 1;
  }
  .mobile-menu-button[aria-expanded="true"] {
    border-color: var(--cyan);
  }
  .mobile-navigation {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 7px;
    max-height: calc(100dvh - 64px);
    padding: 10px 12px 12px;
    overflow-y: auto;
    border-top: 1px solid var(--border);
  }
  .mobile-navigation .nav-button {
    min-width: 0;
    width: 100%;
    padding: 10px;
  }
  .main-content {
    padding: 0 14px 40px;
  }
  .topbar {
    min-height: 88px;
    margin-bottom: 20px;
  }
}

.toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.toast button {
  border: 0;
  background: transparent;
  color: var(--cyan);
  font-weight: 800;
  cursor: pointer;
}
`;
