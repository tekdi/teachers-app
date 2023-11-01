import React from "react";

import "./App.css";
import { AppShell } from "@shiksha/common-lib";
import Sample from "pages/Sample";
import Observation from "pages/Observation";

function App() {
  const routes = [
    
    {
      moduleName: "observation",
      path: "/",
      component: Observation,
    },
  ];
  const LoginComponent = React.lazy(() => import("core/Login"));
  const skipLogin = !(
    process.env.REACT_APP_OAUTH_PROXY_ENABLED == undefined ||
    JSON.parse(process.env.REACT_APP_OAUTH_PROXY_ENABLED) == false
  );

  return <AppShell basename={process.env.PUBLIC_URL}
  routes={routes}
  AuthComponent={LoginComponent}
  skipLogin={skipLogin}
  _authComponent={{ swPath: "/modules/observation" }} />;
}

export default App;
