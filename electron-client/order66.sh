#!/bin/sh

dir=$(pwd)

if curl --silent --fail http://localhost:8080/ > /dev/null; then
  pid=$(lsof -t -i:8080)
  if [ -n "$pid" ]; then
    kill -9 "$pid"
  fi
fi

cd ~/Downloads/Keeko/ && npm run dev &
sleep 1 && cd ~/Downloads/Keeko/electron-client && npm start

cd "$dir"

