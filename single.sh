#!/bin/sh

PORTS="8080 3414"

for PORT in $PORTS; do
  # Get the list of PIDs on the specified port
  pids=$(lsof -t -i :"$PORT")
  
  if [ -n "$pids" ]; then
    for pid in $pids; do
      echo "Killing process on port $PORT (PID: $pid)"
      kill -9 "$pid"
    done
  fi
done

