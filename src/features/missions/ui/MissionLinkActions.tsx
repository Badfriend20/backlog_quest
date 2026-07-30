import { Button, WarningList } from "../../../shared/ui";
import { useVocabulary } from "../../../shared/vocabulary";

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
  const terms = useVocabulary();
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
          Sin {terms.content} · administrar {terms.contents}
        </Button>
      )}
      {!hasCopy && (
        <Button
          variant="warning"
          size="compact"
          className="mission-link-warning"
          onClick={onAddCopy}
        >
          Sin {terms.variant} · agregar {terms.variant}
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
              ? `Agregar y vincular un ${terms.journey}`
              : `Agrega una ${terms.variant} y un ${terms.content} antes de crear un ${terms.journey}.`
          }
          onClick={onAddPlaythrough}
        >
          Sin {terms.journey} · agregar {terms.journey}
        </Button>
      )}
    </WarningList>
  );
}
