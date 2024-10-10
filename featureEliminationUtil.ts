import configFeatures from "./module.config";

/**
 * @interface ConfigFeature
 */
interface ConfigFeature {
  skippedFeatures: string[];
  features: {
    [featureName: string]: {
      pages?: string[];
      components?: {
        name: string;
        path: string;
      }[];
    };
  };
  skippedComponents?: string[];
  includes: (componentName: string) => void;
}

// Cast the imported configFeatures to the defined interface
const typedConfigFeatures = configFeatures as ConfigFeature;

/**
 * Generic function to check if a feature or component is skipped.
 * @param {string} name 
 * @param {("feature" | "component")} type 
 * @returns {boolean} 
 */
export const isEliminatedFromBuild = (name: string, type: "feature" | "component"): boolean => {
  if (!name || name.trim() === "") return false;

  // For feature check
  if (type === "feature") {
    const skippedFeatures = typedConfigFeatures.skippedFeatures || [];
    const validSkippedFeatures = skippedFeatures.filter(f => f.trim() !== "");
    return validSkippedFeatures.includes(name);
  }

  // For component check
  if (type === "component") {
    const skippedComponents: string[] = [];
    const skippedFeatures = typedConfigFeatures.skippedFeatures || [];

    skippedFeatures.forEach((featureName) => {
      // Find the corresponding feature in the config
      const feature = typedConfigFeatures.features[featureName];
      if (feature && feature.components) {
        // If the feature has components, push them to the skippedComponents array
        feature.components.forEach((component) => {
          if (component.name) {
            skippedComponents.push(component.name);
          }
        });
      }
    });

    console.log('Filtered skippedComponents', skippedComponents);
    return skippedComponents.includes(name);
  }

  return false;
};