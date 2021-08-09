import React from "react";
import ReactDOM from "react-dom";
import "core-js/features/map";
import "core-js/features/set";
import queryString from "query-string";

import App from "./App";
import bridge from "@vkontakte/vk-bridge";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import "@vkontakte/vkui/dist/vkui.css";
import "./css/style.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { ConfigProvider, AdaptivityProvider, AppRoot } from "@vkontakte/vkui";

import fetch2 from "./components/Fetch";

bridge.send("VKWebAppInit");

localStorage.clear();

const getParams = queryString.parse(window.location.search);
localStorage.setItem("favorites", getParams.vk_is_favorite);

fetch2("init").then((data) => {
  if (data.response) {
    setTimeout(() => {
      const newColorScheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "space_gray"
        : "client_light";
      const schemeAttribute = document.createAttribute("scheme");
      schemeAttribute.value = newColorScheme;
      document.body.attributes.setNamedItem(schemeAttribute);

      localStorage.setItem("theme", newColorScheme);

      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          const newColorScheme = e.matches ? "space_gray" : "client_light";
          const schemeAttribute = document.createAttribute("scheme");
          schemeAttribute.value = newColorScheme;
          document.body.attributes.setNamedItem(schemeAttribute);
        });
    }, 100);
    if (process.env.NODE_ENV === "development") {
      import("./eruda").then(({ default: eruda }) => {});
    }
    ReactDOM.render(
      <React.StrictMode>
        <ConfigProvider isWebView={true}>
          <AdaptivityProvider>
            <AppRoot>
              <Router>
                <Switch>
                  <Route>
                    <App />
                  </Route>
                </Switch>
              </Router>
            </AppRoot>
          </AdaptivityProvider>
        </ConfigProvider>
      </React.StrictMode>,
      document.getElementById("root")
    );
  } else {
    ReactDOM.render(
      "Неверная подпись параметров запуска",
      document.getElementById("root")
    );
  }
});

serviceWorkerRegistration.register();
