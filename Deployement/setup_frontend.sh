#!/bin/bash

# Update package lists and install Node.js
sudo apt-get update
sudo apt-get install -y nodejs npm git

# Clone the frontend repository
git clone https://github.com/cu-csci-4253-datacenter-fall-2024/finalproject-final-project-team-11.git
cd frontend

# Install dependencies
npm install

# Start the frontend server on port 3000
nohup npm start -- --port 3000 &
