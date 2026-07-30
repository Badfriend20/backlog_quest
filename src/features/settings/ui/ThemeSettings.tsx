import type { AppPreferences, ThemeColors } from "../../../shared/kernel/quest";
import { Eyebrow, SelectableCardButton } from "../../../shared/ui";
import { THEMES } from "../domain/themes";
import { SettingsCard, SettingsSectionHeading } from "./SettingsStyles";

const COLOR_FIELDS: Array<{ key: keyof ThemeColors; label: string }> = [
  { key: "background", label: "Fondo exterior" },
  { key: "container", label: "Contenedor principal" },
  { key: "sidebar", label: "Barra lateral" },
  { key: "panel", label: "Panel" },
  { key: "panelAlt", label: "Panel secundario" },
  { key: "border", label: "Bordes" },
  { key: "text", label: "Texto" },
  { key: "muted", label: "Texto secundario" },
  { key: "primary", label: "Color principal" },
  { key: "accent", label: "Acento" },
  { key: "success", label: "Éxito" },
  { key: "warning", label: "Aviso" },
  { key: "danger", label: "Peligro" },
];

interface ThemeSettingsProps {
  preferences: AppPreferences;
  onChange: (patch: Partial<AppPreferences>, message: string) => void;
}

export function ThemeSettings({ preferences, onChange }: ThemeSettingsProps) {
  function updateColor(key: keyof ThemeColors, value: string) {
    onChange(
      { theme: "custom", customTheme: { ...preferences.customTheme, [key]: value } },
      "Tema personalizado actualizado."
    );
  }

  return (
    <SettingsCard $wide>
      <SettingsSectionHeading>
        <div>
          <Eyebrow>TEMAS</Eyebrow>
          <h2>Apariencia</h2>
          <p>Elige una combinación predefinida o ajusta cada color manualmente.</p>
        </div>
      </SettingsSectionHeading>
      <div className="theme-grid">
        {THEMES.map(theme => (
          <SelectableCardButton
            $selected={preferences.theme === theme.id}
            key={theme.id}
            onClick={() => onChange({ theme: theme.id }, `Tema ${theme.label} aplicado.`)}
          >
            <span className="theme-swatches" aria-hidden="true">
              <i style={{ background: theme.colors.background }} />
              <i style={{ background: theme.colors.primary }} />
              <i style={{ background: theme.colors.accent }} />
            </span>
            <strong>{theme.label}</strong>
            <small>{theme.description}</small>
          </SelectableCardButton>
        ))}
        <SelectableCardButton
          $selected={preferences.theme === "custom"}
          onClick={() => onChange({ theme: "custom" }, "Tema personalizado aplicado.")}
        >
          <span className="theme-swatches" aria-hidden="true">
            <i style={{ background: preferences.customTheme.background }} />
            <i style={{ background: preferences.customTheme.primary }} />
            <i style={{ background: preferences.customTheme.accent }} />
          </span>
          <strong>Personalizado</strong>
          <small>Colores elegidos manualmente.</small>
        </SelectableCardButton>
      </div>
      {preferences.theme === "custom" && (
        <div className="color-grid">
          {COLOR_FIELDS.map(field => (
            <label key={field.key}>
              <span>{field.label}</span>
              <input
                type="color"
                value={preferences.customTheme[field.key]}
                onChange={event => updateColor(field.key, event.target.value)}
              />
              <code>{preferences.customTheme[field.key]}</code>
            </label>
          ))}
        </div>
      )}
    </SettingsCard>
  );
}
