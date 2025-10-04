#!/bin/sh
original=$(pwd)
if $(curl http://localhost:8080/) | grep -q '^curl'; then
  cd /home/volt/Desktop/nasa/testing/keeko/ && /home/volt/Desktop/nasa/testing/keeko/run.sh &
fi
sleep 1 && cd /home/volt/Desktop/nasa/testing/keeko/electron-client && npm start
cd $original
