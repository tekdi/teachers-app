const { dependencies } = require("./package.json");

module.exports = {
  name: "cohort",
  exposes: {
    "./SampleComponent": "./src/components/SampleComponent.js",
    "./CohortList": "./src/pages/CohortList.js",
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
