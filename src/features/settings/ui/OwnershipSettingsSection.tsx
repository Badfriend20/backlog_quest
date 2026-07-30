import type { QuestData, OwnershipDisplayRules } from "../../../shared/kernel/quest";
import {
  normalize,
  normalizeOwnershipDisplayRules,
  OWNERSHIP_LABEL_MAX_LENGTH,
  ownershipDisplayKey,
} from "../../../shared/kernel/questSelectors";
import { FormGrid } from "../../../shared/ui";
import { EditableCatalogSection } from "./EditableCatalogSection";

const ACCESS_METHOD_NAME_MAX_LENGTH = 40;

interface AccessMethodDraft {
  id: string;
  sourceName: string;
  name: string;
  hidden: boolean;
  label: string;
}

export function OwnershipSettingsSection({
  data,
  onChange,
}: {
  data: QuestData;
  onChange(ownership: string[], rules: OwnershipDisplayRules): void;
}) {
  const normalizedRules = normalizeOwnershipDisplayRules(
    data.catalogs.ownership,
    data.preferences.ownershipDisplayRules
  );
  const initialItems = data.catalogs.ownership.map((ownership, index) => {
    const rule = normalizedRules[ownershipDisplayKey(ownership)];
    return {
      id: `access-${index}-${ownershipDisplayKey(ownership)}`,
      sourceName: ownership,
      name: ownership,
      hidden: rule.hidden,
      label: rule.label,
    };
  });

  function usage(item: AccessMethodDraft): number {
    if (!item.sourceName) return 0;
    const target = normalize(item.sourceName);
    const copies = data.games
      .flatMap(game => game.copies)
      .filter(copy => normalize(copy.ownership) === target).length;
    const presets = data.preferences.quickCopyPresets.filter(
      preset => normalize(preset.ownership) === target
    ).length;
    return copies + presets;
  }

  function save(items: AccessMethodDraft[]) {
    const ownership = items.map(item => item.name.trim());
    const draftRules = Object.fromEntries(
      items.map(item => [
        ownershipDisplayKey(item.name),
        { hidden: item.hidden, label: item.label },
      ])
    );
    onChange(ownership, normalizeOwnershipDisplayRules(ownership, draftRules));
  }

  return (
    <EditableCatalogSection
      initialItems={initialItems}
      createItem={() => ({
        id: `access-${Date.now()}`,
        sourceName: "",
        name: "Nueva forma de acceso",
        hidden: false,
        label: "Nueva forma de acceso",
      })}
      getKey={item => item.id}
      texts={{
        eyebrow: "FORMAS DE ACCESO",
        title: "Presentación en agregado rápido",
        description:
          "Administra las opciones disponibles para modalidades nuevas y decide cómo se muestran en los botones de agregado rápido. Los valores históricos no se reescriben.",
        addLabel: "+ Forma de acceso",
        saveLabel: "Guardar formas de acceso",
        emptyLabel:
          "No hay formas de acceso configuradas. Las modalidades nuevas usarán «Por definir».",
        removeTitle: "Eliminar forma de acceso",
        removeLabel: "Eliminar",
        removeMessage: (item, references) =>
          references
            ? `Se quitará ${item.name} de las opciones nuevas y del agregado rápido. Sus ${references} referencias históricas conservarán el texto actual.`
            : `Se eliminará ${item.name} de las opciones disponibles.`,
      }}
      referenceCount={usage}
      invalid={(item, items) => {
        const name = normalize(item.name.trim());
        return (
          !name ||
          items.some(candidate => candidate.id !== item.id && normalize(candidate.name) === name)
        );
      }}
      onSave={save}
      renderEditor={(item, { replace }) => (
        <FormGrid $compact>
          <label>
            <span>Nombre</span>
            <input
              maxLength={ACCESS_METHOD_NAME_MAX_LENGTH}
              value={item.name}
              onChange={event => {
                const name = event.target.value;
                replace({
                  ...item,
                  name,
                  label: item.label === item.name ? name : item.label,
                });
              }}
            />
            <small>
              {item.name.length}/{ACCESS_METHOD_NAME_MAX_LENGTH}
            </small>
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={item.hidden}
              onChange={event => replace({ ...item, hidden: event.target.checked })}
            />
            <span>Ocultar en agregado rápido</span>
          </label>
          <label>
            <span>Texto a mostrar</span>
            <input
              value={item.label}
              maxLength={OWNERSHIP_LABEL_MAX_LENGTH}
              disabled={item.hidden}
              onChange={event => replace({ ...item, label: event.target.value })}
            />
            <small>
              {item.label.length}/{OWNERSHIP_LABEL_MAX_LENGTH}
            </small>
          </label>
        </FormGrid>
      )}
    />
  );
}
