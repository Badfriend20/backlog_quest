import styled, { css } from "styled-components";

function gameCardBorderColor(featured?: boolean, warning?: boolean) {
  if (warning) return "var(--warning)";
  return featured ? "var(--purple)" : "var(--border)";
}

function relationCardBorderColor(editing?: boolean, warning?: boolean) {
  if (warning) return "var(--warning)";
  return editing ? "var(--cyan)" : "var(--border)";
}

export const Stack = styled.div<{ $space?: "lg" | "xl" }>`
  > * + * {
    margin-top: ${({ $space = "lg" }) => ($space === "xl" ? "34px" : "22px")};
  }
`;

export const SectionHeading = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 15px;

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const CardActions = styled(Actions)``;

export const ModalActions = styled(Actions)<{
  $split?: boolean;
  $inline?: boolean;
}>`
  justify-content: ${({ $split }) => ($split ? "space-between" : "flex-end")};
  margin-top: 22px;

  ${({ $inline }) =>
    $inline &&
    css`
      align-items: center;
      justify-content: flex-start;
      margin-top: 14px;
    `}
`;

export const FormGrid = styled.div<{ $compact?: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ $compact }) => ($compact ? "10px" : "13px")};

  label {
    display: grid;
    min-width: 0;
    gap: 6px;
    color: var(--muted);
    font-size: 0.8rem;
  }

  .wide-field {
    grid-column: 1 / -1;
  }

  small {
    color: var(--muted);
    line-height: 1.35;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;

    .wide-field {
      grid-column: auto;
    }
  }
`;

export const CheckRow = styled.label`
  display: flex !important;
  align-items: center;
  gap: 8px !important;
  padding-bottom: 10px;
  white-space: nowrap;

  input {
    width: 18px;
    height: 18px;
  }
`;

export const Callout = styled.section<{ $compact?: boolean }>`
  border: 1px solid var(--purple-2);
  border-left: 5px solid var(--purple);
  padding: ${({ $compact }) => ($compact ? "10px 12px" : "16px 18px")};
  background: rgba(166, 115, 255, 0.08);
  ${({ $compact }) => $compact && "margin-top: 15px; font-size: 0.84rem;"}

  p {
    color: var(--muted);
    margin: 7px 0 0;
    line-height: 1.5;
  }
`;

export const EmptyState = styled.div`
  border: 1px dashed var(--border);
  padding: 22px;
  color: var(--muted);
  text-align: center;
`;

export const CardTopline = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

export const GameCard = styled.article<{ $featured?: boolean; $warning?: boolean }>`
  min-width: 0;
  padding: 17px;
  border: 1px solid ${({ $warning }) => ($warning ? "var(--warning)" : "var(--border)")};
  border-top-width: ${({ $featured }) => ($featured ? "3px" : "1px")};
  border-top-color: ${({ $featured, $warning }) => gameCardBorderColor($featured, $warning)};
  background: linear-gradient(145deg, var(--panel), #130f20);
  box-shadow: ${({ $warning }) =>
    $warning ? "inset 3px 0 0 var(--warning), var(--shadow)" : "var(--shadow)"};

  h3 {
    overflow-wrap: anywhere;
  }

  p {
    min-height: 2.7em;
    color: var(--muted);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .compact-mode & {
    padding: 12px;

    p {
      min-height: auto;
      margin-bottom: 8px;
    }
  }
`;

export const LibraryCard = styled(GameCard)`
  display: flex;
  flex-direction: column;
  width: 100%;
  color: inherit;
  text-align: left;

  &:hover {
    border-color: var(--cyan);
    transform: translateY(-2px);
  }
`;

export const CardOpenButton = styled.button`
  display: block;
  width: 100%;
  flex: 1;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
`;

export const ProgressRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: var(--muted);
  font-size: 0.75rem;
`;

export const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 14px 0;

  span,
  button {
    padding: 4px 7px;
    border-radius: 4px;
    background: var(--panel-3);
    color: var(--muted);
    font-size: 0.72rem;
  }

  .compact-mode & {
    margin: 8px 0;
  }
`;

export const DependencyWarning = styled.div`
  padding: 10px 12px;
  border: 1px solid var(--orange);
  background: rgba(255, 164, 94, 0.09);
  color: #ffe4cc;
  font-size: 0.8rem;
`;

export const WarningList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 8px 0;
`;

export const WarningTag = styled.span`
  display: inline-flex;
  margin: 0;
  padding: 7px 9px;
  border: 1px solid var(--warning);
  background: rgba(255, 213, 106, 0.1);
  color: var(--warning);
  font-size: 0.76rem;
  font-weight: 800;
`;

export const RelationCard = styled.article<{ $editing?: boolean; $warning?: boolean }>`
  padding: 14px;
  border: 1px solid ${({ $editing, $warning }) => relationCardBorderColor($editing, $warning)};
  background: var(--panel);
  box-shadow: ${({ $warning }) => ($warning ? "inset 3px 0 0 var(--warning)" : "none")};
`;

export const RelationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 13px;

  > div:first-child {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
  }

  strong {
    overflow-wrap: anywhere;
  }

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const RelationId = styled.span`
  color: var(--cyan);
  font:
    800 0.68rem ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
`;

export const RelationBadges = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  flex-wrap: wrap;

  span {
    padding: 4px 6px;
    border: 1px solid var(--purple);
    background: rgba(173, 111, 255, 0.08);
    color: #e4cdfd;
    font:
      800 0.62rem ui-monospace,
      SFMono-Regular,
      Menlo,
      monospace;
  }

  @media (max-width: 760px) {
    justify-content: flex-start;
  }
`;

export const RelationActions = styled.div<{ $split?: boolean }>`
  display: flex;
  justify-content: ${({ $split }) => ($split ? "space-between" : "flex-end")};
  margin-top: 10px;
`;

export const RelationSummaryGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
  gap: 10px;
  margin: 0;

  > div {
    min-width: 0;
    padding: 9px 10px;
    border: 1px solid var(--border);
    background: var(--panel-alt);
  }

  dt {
    margin-bottom: 4px;
    color: var(--muted);
    font:
      700 0.66rem/1.2 ui-monospace,
      SFMono-Regular,
      Menlo,
      monospace;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    overflow-wrap: anywhere;
    font-weight: 700;
  }
`;

export const RelationSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
  margin-bottom: 17px;

  > div {
    display: grid;
    gap: 4px;
    padding: 10px 12px;
    border: 1px solid var(--border);
    background: var(--panel);
  }

  span {
    color: var(--muted);
    font-size: 0.7rem;
  }

  strong {
    overflow-wrap: anywhere;
    font-size: 0.8rem;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const LibraryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 13px;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const Eyebrow = styled.p`
  margin-bottom: 5px;
  color: var(--cyan);
  font:
    700 0.72rem/1.2 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  letter-spacing: 0.13em;
`;

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
