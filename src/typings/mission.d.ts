export type MissionServiceResponse = {
  total: number;
  folders: string[];
  num: number;
  start: number;
  nextStart: number;
  services: MissionServiceBase[];
};

type MissionServiceBase = {
  name: string;
  title: string;
  type: "MissionServer" | "VideoServer";
};

export type MissionServiceInfo = {
  snippet: string;
  owner: string;
  thumbnail: string;
  missionId: string;
  capabilities: string;
  created: number;
  groupId: string;
  description: string;
  licenseInfo: string;
  type: "MissionServer";
  title: string;
  currentVersion: string;
  folderId: string;
  tags: string[];
  channels: Channel[];
  authoringApp: string;
  mapIds: string[];
  modified: number;
  config: Config;
  status: string;
};

type Channel = {
  name: string;
  msgId: string;
  items: ChannelItem[];
};

type ChannelItem = {
  itemId: string;
  layerId: number;
  name: string;
  serviceUrl: string;
};

type Config = {
  teams: Team[];
  activeReports: string[];
  version: number;
  dashboards: string[];
};

type Team = {
  id: string;
  title: string;
};

export type MissionReportData = {
  authoringApp: "arcgisMissionManager";
  header: {
    isVisible: boolean;
    content: string;
  };
  itemId: string;
  questions: MissionReportQuestion[];
  reportServiceId: string;
  reportType: string;
  reportUrl: string;
  subHeader: {
    isVisible: boolean;
    content: string;
  };
};

type MissionReportQuestion = {
  isRequired: boolean;
  fieldName: string;
  name: string;
  description: string;
  id: string;
  position: number;
  label: string;
  type: string;
  validation?: object;
};
