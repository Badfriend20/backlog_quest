import { Button, WarningList } from "../../../shared/ui";

export function MissionLinkActions({
  hasContent,
  hasCopy,
  hasPlaythrough,
  canCreatePlaythrough,
  onManageContents,
  onAddCopy,
  onAddPlaythrough,
}: {
  hasContent: boolean;
  hasCopy: boolean;
  hasPlaythrough: boolean;
  canCreatePlaythrough: boolean;
  onManageContents(): void;
  onAddCopy(): void;
  onAddPlaythrough(): void;
}) {
  if (hasContent && hasCopy && hasPlaythrough) return null;

  return (
    <WarningList aria-label="Relaciones pendientes">
      {!hasContent && (
        <Button
          variant="warning"
          size="compact"
          className="mission-link-warning"
          onClick={onManageContents}
        >
          Sin contenido · administrar contenidos
        </Button>
      )}
      {!hasCopy && (
        <Button
          variant="warning"
          size="compact"
          className="mission-link-warning"
          onClick={onAddCopy}
        >
          Sin copia · agregar copia
        </Button>
      )}
      {!hasPlaythrough && (
        <Button
          variant="warning"
          size="compact"
          className="mission-link-warning"
          disabled={!canCreatePlaythrough}
          title={
            canCreatePlaythrough
              ? "Agregar y vincular una partida"
              : "Agrega una copia y un contenido antes de crear una partida."
          }
          onClick={onAddPlaythrough}
        >
          Sin partida · agregar partida
        </Button>
      )}
    </WarningList>
  );
}
