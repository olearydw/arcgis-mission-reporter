export type FederatedServer = {
  id: string;
  name: string;
  url: string;
  isHosted: boolean;
  adminUrl: string;
  serverType: string;
  serverRole: string;
  serverFunction: string;
};

export type ServerFunction="MissionServer"|"VideoServer";
