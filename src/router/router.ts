import Navigo from "navigo";
import App from "../components/views/App/AppView";

const router = new Navigo("/", {
  hash: true,
  noMatchWarning: true,
});

// Default route of the app
const _defaultRoute = "/home";
let _app: App;

router.on("/home", () => {
  _app.setActiveView("home");
});

router.on("/list", () => {
  _app.setActiveView("list");
});

router.on("/map", () => {
  _app.setActiveView("map");
});

router.on(() => {
  setRoute("home");
  _app.setActiveView("home");
});

router.notFound(() => {
  setRoute("home");
  _app.setActiveView("home");
});

export const initRouter = (app: App): Promise<void> => {
  _app = app;
  router.resolve();
  return Promise.resolve();
};

export const setRoute = (route: string) => {
  if (!route) {
    route = _defaultRoute;
  }
  router.navigate(route);
};
