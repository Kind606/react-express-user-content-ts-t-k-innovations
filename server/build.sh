#!/bin/bash
set -e

echo "Creating .npmrc with authentication..."

# Create .npmrc with the NPM_TOKEN
cat > .npmrc << EOF
@plugga-tech:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
EOF

echo ".npmrc created successfully"

# Install dependencies
echo "Installing dependencies..."
npm ci --include=dev

# Build the project
echo "Building project..."
npm run build

echo "Build complete!"
