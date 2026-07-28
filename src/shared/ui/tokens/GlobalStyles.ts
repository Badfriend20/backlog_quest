import { createGlobalStyle } from "styled-components";

/**
 * Único estilo global permitido: tokens, reset y comportamiento base de elementos HTML.
 * Los componentes y las features son responsables de su presentación mediante styled-components.
 */
export const GlobalStyles = createGlobalStyle`
  :root {
    color-scheme: dark;
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
    background: #0d0a17;
    color: #f4f0ff;
    --bg: #0d0a17;
    --panel: #171126;
    --panel-2: #211a35;
    --panel-3: #2a2042;
    --border: #443762;
    --muted: #aaa0bd;
    --text: #f4f0ff;
    --input: #0e0a18;
    --input-text: #f4f0ff;
    --purple: #a673ff;
    --purple-2: #6c3fd6;
    --pink: #ff72c6;
    --cyan: #61e7ff;
    --green: #7effa2;
    --yellow: #ffd56a;
    --orange: #ffa45e;
    --red: #ff6f7d;
    --shadow: 0 16px 44px rgba(0, 0, 0, 0.28);
  }

  * {
    box-sizing: border-box;
  }

  html {
    background: var(--bg);
  }

  body {
    min-width: 320px;
    min-height: 100vh;
    margin: 0;
    background:
      radial-gradient(circle at 15% 0%, rgba(166, 115, 255, 0.12), transparent 28rem),
      radial-gradient(circle at 90% 8%, rgba(97, 231, 255, 0.08), transparent 24rem),
      var(--bg);
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  button {
    color: inherit;
  }

  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 3px solid rgba(97, 231, 255, 0.45);
    outline-offset: 2px;
  }

  h1,
  h2,
  h3,
  p {
    margin-top: 0;
  }

  h1 {
    margin-bottom: 0;
    font-size: clamp(1.55rem, 4vw, 2.35rem);
  }

  h2 {
    margin-bottom: 0;
    font-size: 1.28rem;
  }

  h3 {
    margin-bottom: 0.55rem;
  }

  small {
    color: var(--muted);
  }

  nav {
    display: grid;
    gap: 6px;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 10px 11px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--input);
    color: var(--input-text);
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--muted);
    opacity: 1;
  }

  textarea {
    resize: vertical;
  }
`;
