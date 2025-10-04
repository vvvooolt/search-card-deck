#!/bin/sh
python3 ~/Desktop/nasa/testing/keeko/backend/api.py &
ollama serve &
npm run dev &
