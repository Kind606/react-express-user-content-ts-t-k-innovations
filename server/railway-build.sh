#!/bin/bash
# Railway build script that handles npm authentication

echo "Creating .npmrc for private package access..."

# Check if NPM_TOKEN exists
if [ -z "$NPM_TOKEN" ]; then
    echo "WARNING: NPM_TOKEN not found in environment"
    echo "Attempting to install without authentication..."
else
    echo "NPM_TOKEN found, creating .npmrc..."
    cat > .npmrc << EOF
@plugga-tech:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${NPM_TOKEN}
EOF
fi

echo "Installing dependencies..."
npm ci --include=dev

echo "Building application..."
npm run build

echo "Build complete!"
