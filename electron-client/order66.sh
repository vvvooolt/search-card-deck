#!/bin/sh
original=$(pwd)

# Fetch the response from curl
response=$(curl -s http://localhost:8080/)

# Check if the response contains the string 'curl'
if [[ "$response" == *"curl"* ]]; then
  echo "Found 'curl' in the response!"
  cd ~/Downloads/Keeko/ && ~/Downloads/Keeko/run.sh &
fi

sleep 1 && cd ~/Downloads/Keeko/electron-client && npm start
cd $original

