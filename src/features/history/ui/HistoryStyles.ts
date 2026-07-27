import { createGlobalStyle } from "styled-components";

export const HistoryStyles = createGlobalStyle`


.table-wrap {
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--border);
}
.mobile-scroll-hint {
  display: none;
}
.table-link {
  background: none;
  border: 0;
  color: var(--text);
  cursor: pointer;
  padding: 0;
  text-align: left;
  font-weight: 700;
}
.table-link:hover {
  color: var(--cyan);
}
@media (max-width: 760px) {
  .mobile-scroll-hint {
    display: block;
    margin: -5px 0 8px;
    color: var(--muted);
    font-size: 0.78rem;
  }
}
`;
