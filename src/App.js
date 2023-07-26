import { App, View } from "framework7-react";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SinglePage from "./pages/SinglePage";
import DataPage from "./pages/DataPage";
import MessagePage from "./pages/MessagePage";

import store from "./store";

const f7params = {
  name: "My App",
  view: {
    browserHistory: true,
  },
  // specify routes for app
  routes: [
    {
      path: "/",
      component: HomePage,
    },
    {
      path: "/about/",
      component: AboutPage,
    },
    {
      path: "/single/:id/",
      component: SinglePage,
    },
    {
      path: "/data/",
      component: DataPage,
    },
    {
      path: "/message/",
      component: MessagePage,
    },
  ],
};

export default () => (
  // Main Framework7 App component where we pass Framework7 params
  <App store={store} theme="auto" {...f7params}>
    {/* Your main view, should have "main" prop */}
    <View main url="/" />
  </App>
);
