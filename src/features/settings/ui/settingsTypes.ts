import type { AppPreferences } from "../../../shared/kernel/backlog";

export type SettingsChangeHandler = (patch: Partial<AppPreferences>, message: string) => void;
