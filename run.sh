#!/bin/sh
python3 /home/volt/Desktop/nasa/testing/search-card-deck/backend/api.py &
ollama serve &
cloudflared tunnel run AI &
cloudflared tunnel run ollama &
npm run dev &
detach
wait
