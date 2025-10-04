#!/bin/sh
original=$(pwd)
if $(curl http://localhost:8080/) | grep -q '^curl'; then
  cd ~/Downloads/Keeko/ && ~/Downloads/Keeko/run.sh &
fi
sleep 1 && cd  ~/Downloads/Keeko/electron-client && npm start
cd $original
