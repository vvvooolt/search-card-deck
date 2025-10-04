#!/bin/sh
python3 ~/Desktop/nasa/testing/search-card-deck/backend/api.py &
ollama serve &
npm run dev &
detach
wait
