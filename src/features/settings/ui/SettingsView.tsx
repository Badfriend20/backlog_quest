import type { BacklogData, CopyPlatform } from "../../../shared/kernel/backlog";
import type { BacklogStorage } from "../../backlog";
import { ThemeSettings } from "./ThemeSettings";
import { SlotSettingsSection } from "./SlotSettingsSection";
import { QueueSettingsSection } from "./QueueSettingsSection";
import { CalendarSettingsSection } from "./CalendarSettingsSection";
import { InterfaceSettingsSection } from "./InterfaceSettingsSection";
import { PortabilitySettingsSection } from "./PortabilitySettingsSection";
import { StorageSettingsSection } from "./StorageSettingsSection";
import { DangerSettingsSection } from "./DangerSettingsSection";
import type { SettingsChangeHandler } from "./settingsTypes";
import { OwnershipSettingsSection } from "./OwnershipSettingsSection";
import { SettingsStyles } from "./SettingsStyles";
import { PlatformSettingsSection } from "./PlatformSettingsSection";

interface SettingsViewProps {
  data: BacklogData;
  onChange: SettingsChangeHandler;
  onCopyPlatformsChange: (platforms: CopyPlatform[]) => void;
  onReplaceData: (data: BacklogData) => void;
  onReset: () => void;
  storage: BacklogStorage;
}

export function SettingsView(props: SettingsViewProps) {
  const { data, onChange, onCopyPlatformsChange, onReplaceData, onReset, storage } = props;
  return (
    <div className="settings-grid">
      <SettingsStyles />
      <ThemeSettings preferences={data.preferences} onChange={onChange} />
      <SlotSettingsSection data={data} onChange={onChange} />
      <OwnershipSettingsSection data={data} onChange={onChange} />
      <PlatformSettingsSection data={data} onChange={onCopyPlatformsChange} />
      <QueueSettingsSection data={data} onChange={onChange} />
      <CalendarSettingsSection data={data} onChange={onChange} />
      <InterfaceSettingsSection data={data} onChange={onChange} />
      <PortabilitySettingsSection data={data} storage={storage} onReplaceData={onReplaceData} />
      <StorageSettingsSection data={data} />
      <DangerSettingsSection onReset={onReset} />
    </div>
  );
}
