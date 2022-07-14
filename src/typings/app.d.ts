export type AppConfig = {
  appId: string;
  appTitle: string;
  portalUrl: string;
  incidentLyrId: string;
  incidentReportName: string;
};

export type RenderState = "loading" | "supported" | "unsupported" | "incident" | "success";
