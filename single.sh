#!/bin/sh

PORTS="8080 3414"

for PORT in $PORTS; do
  pid=$(lsof -t -i :"$PORT")
  if [ -n "$pid" ]; then
    echo "Killing process on port $PORT (PID: $pid)"
    kill -9 "$pid"
  fi
done
sudo pkill ollama

