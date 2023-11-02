import React from "react";

import "./App.css";
import { AppShell, initializeI18n } from "@shiksha/common-lib";
import Sample from "pages/Sample";

function App() {
  initializeI18n(
    ["cohort"],
    `${process.env.PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`
  );
  const routes = [
    {
      moduleName: "cohort",
      path: "/",
      component: Sample,
    },
    {
      moduleName: "cohort",
      path: "/",
      component: Sample,
    },
  ];
  const LoginComponent = React.lazy(() => import("core/Login"));
  const skipLogin = !(
    process.env.REACT_APP_OAUTH_PROXY_ENABLED == undefined ||
    JSON.parse(process.env.REACT_APP_OAUTH_PROXY_ENABLED) == false
  );

  return (
    <AppShell
      basename={process.env.PUBLIC_URL}
      routes={routes}
      AuthComponent={LoginComponent}
      skipLogin={skipLogin}
      _authComponent={{ swPath: "/modules/cohort" }}
    />
  );
}

export default App;
