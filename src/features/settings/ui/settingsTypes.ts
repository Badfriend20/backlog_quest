import type { AppPreferences } from "../../../shared/kernel/quest";

export type SettingsChangeHandler = (patch: Partial<AppPreferences>, message: string) => void;
