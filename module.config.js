/**
 * @typedef {Object} ConfigFeature
 * @property {string[]} skippedFeatures
 * @property {Object} features
 * @property {Object} features.assessments
 * @property {string[]} features.assessments.pages
 * @property {Object} features.dashboard
 * @property {string[]} features.dashboard.pages
 * @property {Object[]} features.dashboard.components
 * @property {string} features.dashboard.components[].name
 * @property {string} features.dashboard.components[].path
 * @property {string[]} [skippedComponents] // Optional property
 * @property {function(string): void} includes
 */

/**
 * @type {ConfigFeature}
 */
const configFeatures = {
  skippedFeatures: [""],
  features: {
    Assessments: {
      pages: ["./src/pages/assessments/index.tsx", "./src/pages/assessments/user/[userId]/index.tsx", "./src/pages/assessments/user/[userId]/subject/[subjectId]/index.tsx"],
      components: [{
        name: "AssessmentReportCard",
        path: "./src/components/AssessmentReportCard.tsx"
      },
      {
        name: "AssessmentReport",
        path: "./src/components/AssessmentReport.tsx"
      }
      ],
    },
    Events: {
      pages: ["./src/pages/centers/[cohortId]/events/[date]/index.tsx"],
      components:
        [
          {
            name: "SessionCard",
            path: "./src/components/SessionCard.tsx"
          },
          {
            name: "SessionCardFooter",
            path: "./src/components/SessionCardFooter.tsx"
          },
          {
            name: "DeleteSession",
            path: "./src/components/DeleteSession.tsx"
          },
          {
            name: "PlannedSession",
            path: "./src/components/PlannedSession.tsx"
          },
          {
            name: "Schedule",
            path: "./src/components/Schedule.tsx"
          },

        ]
    },
    // Sample Format to skip pages and components
    // featureName: {
    //   pages: ["./src/pages/pageName.tsx"],
    //   components: [{
    //     name: "componentName",
    //     path: "./src/components/componentName.tsx"
    //   }],
    // }
  },
  includes: function (componentName) {
    console.log(componentName);
  }
};

/**
 * @param {ConfigFeature} config
 * @returns {string[]}
 */
const extractSkippedComponents = (config) => {
  const skippedComponents = [];

  Object.keys(config.features).forEach((featureKey) => {
    const feature = config.features[featureKey];

    if (feature.components) {
      feature.components.forEach((component) => {
        if (component.name) {
          skippedComponents.push(component.name);
        }
      });
    }
  });

  return skippedComponents;
};

// Extract and add skipped components to the config
configFeatures.skippedComponents = extractSkippedComponents(configFeatures);

module.exports = configFeatures;
