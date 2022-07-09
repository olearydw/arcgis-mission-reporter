import Navigo from "navigo";
import App from "../components/views/App/AppView";

const router = new Navigo("/", {
  hash: true,
  noMatchWarning: true,
});

// Default route of the app
const _defaultRoute = "/missions";
let _app: App;

router.on("/missions", () => {
  _app.setActiveView("missions");
});

router.on("/reports", () => {
  _app.setActiveView("reports");
});

router.on("/tasks", () => {
  _app.setActiveView("tasks");
});

router.on("/map", () => {
  _app.setActiveView("map");
});

router.on(() => {
  setRoute("missions");
  _app.setActiveView("missions");
});

router.notFound(() => {
  setRoute("missions");
  _app.setActiveView("missions");
});

export const initRouter = (app: App): Promise<void> => {
  _app = app;
  router.resolve();
  return Promise.resolve();
};

export const setRoute = (route?: string) => {
  if (!route) {
    route = _defaultRoute;
  }
  router.navigate(route);
};
