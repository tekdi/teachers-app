const { dependencies } = require("./package.json");

module.exports = {
  name: "admin",
  exposes: {
    "./SampleComponent": "./src/components/SampleComponent",
    "./CreateCohort": "./src/pages/CreateCohort.js",
    "./CreateUser": "./src/pages/CreateUser.js",
    "./AdminHome": "./src/pages/AdminHome.js"
  },
  remotes: {
    core: `core@[window.appModules.core.url]/moduleEntry.js`,
  },
  filename: "moduleEntry.js",
  shared: {
    ...dependencies,
    react: {
      singleton: true,
      requiredVersion: dependencies["react"],
    },
    "react-dom": {
      singleton: true,
      requiredVersion: dependencies["react-dom"],
    },
  },
};
