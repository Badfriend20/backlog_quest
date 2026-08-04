import styled from "styled-components";

export const BacklogScope = styled.div`
  display: contents;

  .app-shell {
    display: grid;
    grid-template-columns: 236px minmax(0, 1fr);
    min-height: 100vh;
    background: var(--container);
  }
  .sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    padding: 22px 16px;
    border-right: 1px solid var(--border);
    background: color-mix(in srgb, var(--sidebar) 94%, transparent);
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
  .nav-button.active {
    border-color: var(--purple-2);
    background: linear-gradient(90deg, rgba(166, 115, 255, 0.18), rgba(166, 115, 255, 0.05));
    color: var(--text);
    box-shadow: inset 3px 0 0 var(--purple);
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
    .topbar-actions button[data-variant="ghost"] {
      display: none;
    }
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
      background: color-mix(in srgb, var(--sidebar) 97%, transparent);
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
      position: fixed;
      top: 64px;
      right: 0;
      left: 0;
      z-index: 2;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 7px;
      max-height: calc(100dvh - 64px);
      padding: 10px 12px 12px;
      overflow-y: auto;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      background: color-mix(in srgb, var(--sidebar) 98%, transparent);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.42);
    }
    .mobile-navigation-overlay {
      position: fixed;
      inset: 64px 0 0;
      z-index: 1;
      width: 100%;
      height: auto;
      padding: 0;
      border: 0;
      background: rgba(4, 2, 8, 0.68);
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
  @media (max-width: 430px) {
    .topbar-actions button[data-variant="primary"] {
      padding: 8px 10px;
    }
  }

  .toast {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    touch-action: pan-y;
    transition:
      transform 160ms ease,
      opacity 160ms ease;
  }
  .toast-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .toast button {
    border: 0;
    background: transparent;
    color: var(--cyan);
    font-weight: 800;
    cursor: pointer;
  }
`;
