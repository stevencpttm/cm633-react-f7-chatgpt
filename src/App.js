import { App, View } from "framework7-react";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SinglePage from "./pages/SinglePage";
import DataPage from "./pages/DataPage";
import MessagePage from "./pages/MessagePage";
import SettingPage from "./pages/SettingPage";
import ConversationPage from "./pages/ConversationPage";

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
      path: "/message/:id/",
      component: MessagePage,
    },
    {
      path: "/setting/:id/",
      component: SettingPage,
    },
    {
      path: "/conversation/",
      component: ConversationPage,
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
