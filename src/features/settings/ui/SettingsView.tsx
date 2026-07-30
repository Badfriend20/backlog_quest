import type { QuestData, Channel, OwnershipDisplayRules } from "../../../shared/kernel/quest";
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
import { SettingsGrid, SettingsScope } from "./SettingsStyles";
import { PlatformSettingsSection } from "./PlatformSettingsSection";
import { VocabularySettingsSection } from "./VocabularySettingsSection";
import { ExampleDataSettingsSection } from "./ExampleDataSettingsSection";

interface SettingsViewProps {
  data: QuestData;
  onChange: SettingsChangeHandler;
  onCopyPlatformsChange: (platforms: Channel[]) => void;
  onOwnershipCatalogChange: (ownership: string[], rules: OwnershipDisplayRules) => void;
  onReplaceData: (data: QuestData) => void;
  demoActive: boolean;
  onStartDemo: (data: QuestData) => void;
  onRestoreDemo: () => void;
  onKeepDemo: () => void;
  onReset: () => void;
  storage: BacklogStorage;
}

export function SettingsView(props: SettingsViewProps) {
  const {
    data,
    onChange,
    onCopyPlatformsChange,
    onOwnershipCatalogChange,
    onReplaceData,
    demoActive,
    onStartDemo,
    onRestoreDemo,
    onKeepDemo,
    onReset,
    storage,
  } = props;
  return (
    <SettingsScope>
      <SettingsGrid>
        <ThemeSettings preferences={data.preferences} onChange={onChange} />
        <VocabularySettingsSection data={data} onChange={onChange} />
        <SlotSettingsSection data={data} onChange={onChange} />
        <OwnershipSettingsSection data={data} onChange={onOwnershipCatalogChange} />
        <PlatformSettingsSection data={data} onChange={onCopyPlatformsChange} />
        <QueueSettingsSection data={data} onChange={onChange} />
        <CalendarSettingsSection data={data} onChange={onChange} />
        <InterfaceSettingsSection data={data} onChange={onChange} />
        <ExampleDataSettingsSection
          storage={storage}
          demoActive={demoActive}
          onStartDemo={onStartDemo}
          onRestoreDemo={onRestoreDemo}
          onKeepDemo={onKeepDemo}
        />
        <PortabilitySettingsSection data={data} storage={storage} onReplaceData={onReplaceData} />
        <StorageSettingsSection data={data} />
        <DangerSettingsSection onReset={onReset} />
      </SettingsGrid>
    </SettingsScope>
  );
}
