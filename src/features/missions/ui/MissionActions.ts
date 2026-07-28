export interface MissionActions {
  onEditGame: (id: string) => void;
  onFinish: (id: string) => void;
  onDefer: (id: string) => void;
  onPause: (id: string) => void;
  onSendEnd: (id: string) => void;
  onAbandon: (id: string) => void;
  onEditMission: (id: string) => void;
  onAddCopyForMission: (id: string) => void;
  onAddPlaythroughForMission: (id: string) => void;
  onManageContentsForMission: (id: string) => void;
}
