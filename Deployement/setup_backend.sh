#!/bin/bash

# Update package lists and install Node.js
sudo apt-get update
sudo apt-get install -y nodejs npm git

# Clone the backend repository
git clone https://github.com/cu-csci-4253-datacenter-fall-2024/finalproject-final-project-team-11.git
cd backend/src

# Install dependencies
npm install
npm install @aws-sdk/client-s3

# Start the backend server on port 3001
nohup node app.js -- --port 3001 &
