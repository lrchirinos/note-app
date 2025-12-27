#!/bin/bash

# This script starts the full-stack application.
# It should be run from the project's root directory.

echo "--- Starting the Full-Stack Notes Challenge ---"

# Step 1: Install Backend dependencies
echo "[1/4] Installing Backend dependencies (npm install)..."
(cd backend && npm install)

# Step 2: Install Frontend dependencies
echo "[2/4] Installing Frontend dependencies (npm install)..."
(cd frontend && npm install)

# Step 3: Start the Backend server in the background
echo "[3/4] Starting Backend (NestJS) on http://localhost:3000 ..."
# The '&' runs this command in the background
(cd backend && npm run start:dev) &

# We save the Process ID (PID) of the backend
BACKEND_PID=$!

# Step 4: Start the Frontend server in the foreground
echo "[4/4] Starting Frontend (Angular) on http://localhost:4200 ..."
# This runs in the foreground, keeping the terminal open
(cd frontend && npm start)

# When the user stops the frontend (Ctrl+C), this part will run
echo "--- Shutting down servers ---"
kill $BACKEND_PID