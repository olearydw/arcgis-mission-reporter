
export interface MissionServiceResponse {
  total: number;
  folders: string[];
  num: number;
  start: number;
  nextStart: number;
  services: MissionServiceBase[];
}

interface MissionServiceBase {
  name: string;
  title: string;
  type: "MissionServer" | "VideoServer";
}

export interface MissionServiceInfo {
  snippet:        string;
  owner:          string;
  thumbnail:      string;
  missionId:      string;
  capabilities:   string;
  created:        number;
  groupId:        string;
  description:    string;
  licenseInfo:    string;
  type:           "MissionServer";
  title:          string;
  currentVersion: string;
  folderId:       string;
  tags:           string[];
  channels:       Channel[];
  authoringApp:   string;
  mapIds:         string[];
  modified:       number;
  config:         Config;
  status:         string;
}

interface Channel {
  name:  string;
  msgId: string;
  items: ChannelItem[];
}

interface ChannelItem {
  itemId:     string;
  layerId:    number;
  name:       string;
  serviceUrl: string;
}

interface Config {
  teams:         Team[];
  activeReports: string[];
  version:       number;
  dashboards:    string[];
}

interface Team {
  id:    string;
  title: string;
}