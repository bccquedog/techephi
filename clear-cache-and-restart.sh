#!/bin/bash

# Clear Vite cache and restart development server
echo "Clearing Vite cache and restarting development server..."

# Kill any existing Vite processes
pkill -f "vite" 2>/dev/null || true

# Clear Vite cache
rm -rf node_modules/.vite 2>/dev/null || true
rm -rf dist 2>/dev/null || true

# Clear browser cache (optional)
echo "Cache cleared. Starting development server..."

# Start development server
npm run dev


