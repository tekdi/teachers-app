# Exit on error
set -e

# Path to the config file
CONFIG_FILE="./module.config.js"
TEMP_FOLDER="./temp_eliminated_features"
FILE_LOCATIONS="$TEMP_FOLDER/file_locations.txt" # File to store original locations

# Function to extract skipped features from the app.config.ts file using Node.js
get_skipped_features() {
    node -e "
    const config = require('$CONFIG_FILE');
    const skippedFeatures = config.skippedFeatures;
    if (Array.isArray(skippedFeatures)) {
      console.log(JSON.stringify(skippedFeatures));
    } else {
      console.error('Error: skippedFeatures is not an array');
      process.exit(1);
    }
    "
}

# Function to move skipped pages and components to a temporary folder and create placeholders for components
move_skipped_features() {
    skipped_features=$(get_skipped_features)

    # Convert JSON string to array
    read -r -a skipped_array <<< "$(echo $skipped_features | sed 's/[][]//g' | tr ',' '\n' | xargs)"

    echo "Skipped features: ${skipped_array[*]}"

    # Create a temporary folder if it doesn't exist
    mkdir -p "$TEMP_FOLDER"
    # Clear any existing file locations record
    > "$FILE_LOCATIONS"

    # Loop through each skipped feature
    for feature in "${skipped_array[@]}"; do
        # Get pages and components for the current feature
        pages=$(node -e "
        const config = require('$CONFIG_FILE');
        const feature = config.features['$feature'];
        console.log((feature && feature.pages) ? feature.pages.join(' ') : '');
        ")

        components=$(node -e "
        const config = require('$CONFIG_FILE');
        const feature = config.features['$feature'];
        console.log((feature && feature.components) ? feature.components.map(c => c.path).join(' ') : '');
        ")

        echo "Processing feature: $feature"
        echo "Pages to move: $pages"
        echo "Components to move: $components"

        # Move the pages if they exist
        for page in $pages; do
            # Strip any surrounding whitespace
            page=$(echo "$page" | xargs)

            # Check if the file exists (not a directory)
            if [ -f "$page" ]; then
                # Get the parent directory
                parent_dir=$(dirname "$page")

                # Create the parent directory in the temp folder if it doesn't exist
                mkdir -p "$TEMP_FOLDER/$parent_dir"

                # Move the file and record its original location
                mv "$page" "$TEMP_FOLDER/$parent_dir/"
                echo "$page" >> "$FILE_LOCATIONS"
                echo "Moved $page to $TEMP_FOLDER/$parent_dir/"
            else
                echo "File $page does not exist."
            fi
        done

        # Move the components if they exist and create placeholder files
        for component in $components; do
            # Strip any surrounding whitespace
            component=$(echo "$component" | xargs)

            # Check if the file exists (not a directory)
            if [ -f "$component" ]; then
                # Get the parent directory
                parent_dir=$(dirname "$component")

                # Create the parent directory in the temp folder if it doesn't exist
                mkdir -p "$TEMP_FOLDER/$parent_dir"

                # Move the file and record its original location
                mv "$component" "$TEMP_FOLDER/$parent_dir/"
                echo "$component" >> "$FILE_LOCATIONS"
                echo "Moved $component to $TEMP_FOLDER/$parent_dir/"

                # Create a placeholder component in the original location
                echo "export default () => null;" > "$component"

                echo "Created placeholder for $component"
            else
                echo "File $component does not exist."
            fi
        done
    done
}

# Function to restore the moved pages and components after the build
restore_skipped_features() {
    echo "Restoring skipped features..."

    # Read the file containing original locations and restore them
    while IFS= read -r original_file; do
        # Get the filename from the original path
        filename=$(basename "$original_file")

        # Get the original directory to move the file back to
        original_dir=$(dirname "$original_file")

        # Move the file back to its original location
        if [ -f "$TEMP_FOLDER/$original_file" ]; then
            mkdir -p "$original_dir"
            mv "$TEMP_FOLDER/$original_file" "$original_dir/"
            echo "Restored $filename to $original_dir/"
        else
            echo "File $filename not found in temporary folder."
        fi
    done < "$FILE_LOCATIONS"

    # Clean up the temporary folder
    rm -rf "$TEMP_FOLDER"
}

# Start the process
echo "Moving skipped features to temporary folder..."
move_skipped_features

echo "Building the project..."
# Build the project using Next.js
npm run build

echo "Restoring skipped features after build..."
restore_skipped_features

echo "Build process completed successfully."

echo "Starting local server to serve the build..."
# Serve the build on your local machine
npm run start
