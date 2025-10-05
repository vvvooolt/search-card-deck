#!/bin/sh
python3 ./backend/api.py &
ollama serve &
npm run dev &
