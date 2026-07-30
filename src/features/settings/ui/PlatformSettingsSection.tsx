import type { QuestData, Channel } from "../../../shared/kernel/quest";
import {
  normalize,
  normalizeCopyPlatforms,
  resolveCopyPlatform,
} from "../../../shared/kernel/questSelectors";
import { Callout, FormGrid } from "../../../shared/ui";
import { EditableCatalogSection } from "./EditableCatalogSection";

const PLATFORM_NAME_MAX_LENGTH = 40;

export function PlatformSettingsSection({
  data,
  onChange,
}: {
  data: QuestData;
  onChange: (platforms: Channel[]) => void;
}) {
  function usage(platform: Channel): number {
    const copies = data.games
      .flatMap(game => game.copies)
      .filter(
        copy =>
          resolveCopyPlatform(data.catalogs.platforms, copy.platformId, copy.library)?.id ===
          platform.id
      ).length;
    const presets = data.preferences.quickCopyPresets.filter(
      preset =>
        resolveCopyPlatform(data.catalogs.platforms, preset.platformId, preset.library)?.id ===
        platform.id
    ).length;
    return copies + presets;
  }

  return (
    <EditableCatalogSection
      initialItems={data.catalogs.platforms}
      createItem={() => ({
        id: `platform-${Date.now()}`,
        name: "Nueva plataforma",
        active: true,
      })}
      getKey={platform => platform.id}
      texts={{
        eyebrow: "PLATAFORMAS",
        title: "Canales y ecosistemas de las modalidades",
        description:
          "Una plataforma se combina con una forma de acceso. Si dos entradas representan la misma, asígnales el mismo nombre y al guardar se fusionarán sin perder sus modalidades.",
        addLabel: "+ Plataforma",
        saveLabel: "Guardar plataformas",
        emptyLabel: "No hay canales configurados. Las modalidades nuevas quedarán por confirmar.",
        removeTitle: "Eliminar plataforma",
        removeLabel: "Eliminar",
        removeMessage: platform => `Se eliminará ${platform.name} de las opciones disponibles.`,
      }}
      referenceCount={usage}
      blockedRemovalMessage={(_, references) =>
        references > 0
          ? "Este canal está vinculado a modalidades o agregados rápidos. Renómbralo con el nombre de otro canal y guarda para fusionarlos."
          : undefined
      }
      invalid={platform => !platform.name.trim()}
      normalizeItems={normalizeCopyPlatforms}
      onSave={onChange}
      renderEditor={(platform, { replace }) => (
        <FormGrid $compact>
          <label>
            <span>Nombre</span>
            <input
              maxLength={PLATFORM_NAME_MAX_LENGTH}
              value={platform.name}
              onChange={event => replace({ ...platform, name: event.target.value })}
            />
            <small>
              {platform.name.length}/{PLATFORM_NAME_MAX_LENGTH}
            </small>
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={platform.active}
              onChange={event => replace({ ...platform, active: event.target.checked })}
            />
            <span>Disponible en nuevas modalidades</span>
          </label>
        </FormGrid>
      )}
      renderNotice={(platform, items) => {
        const nameKey = normalize(platform.name.trim());
        const duplicate = Boolean(
          nameKey &&
          items.some(
            candidate =>
              candidate.id !== platform.id && normalize(candidate.name.trim()) === nameKey
          )
        );
        return duplicate ? (
          <Callout as="p" $compact>
            Se fusionará con la otra plataforma del mismo nombre.
          </Callout>
        ) : null;
      }}
    />
  );
}
