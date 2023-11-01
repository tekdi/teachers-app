import React from "react";

import "./App.css";
import { AppShell } from "@shiksha/common-lib";
import Sample from "pages/Sample";
import Observation from "pages/Observation";

function App() {
  const routes = [
    
    {
      moduleName: "cohort",
      path: "/",
      component: Observation,
    },
  ];
  const LoginComponent = React.lazy(() => import("core/Login"));

  return <AppShell routes={routes} AuthComponent={LoginComponent}  />;
}

export default App;
