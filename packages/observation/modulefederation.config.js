const { dependencies } = require("./package.json");

module.exports = {
  name: "observation",
  exposes: {
    "./App": "./src/App",
    "./SampleComponent": "./src/components/SampleComponent",
    "./Observation": "./src/pages/Observation",
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
