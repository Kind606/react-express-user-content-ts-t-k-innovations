#!/bin/bash
set -e

echo "Creating .npmrc with authentication..."

# Debug: Check if NPM_TOKEN is set
if [ -z "$NPM_TOKEN" ]; then
    echo "ERROR: NPM_TOKEN environment variable is not set!"
    exit 1
fi

echo "NPM_TOKEN is set (length: ${#NPM_TOKEN} characters)"

# Create .npmrc with the NPM_TOKEN
cat > .npmrc << EOF
@plugga-tech:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
EOF

echo ".npmrc created successfully"
echo "Verifying .npmrc contents (token masked):"
sed 's/ghp_[^ ]*/ghp_****/' .npmrc

# Install dependencies
echo "Installing dependencies..."
npm ci --include=dev

# Build the project
echo "Building project..."
npm run build

echo "Build complete!"
