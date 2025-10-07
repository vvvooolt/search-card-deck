#!/bin/bash

echo "=== Keeko Installation Script ==="
echo ""

if [ "$EUID" -eq 0 ]; then
    echo "error, script must not be run as root, run it as a user who has access to sudo"
    exit 1
fi

set -e

if command -v pacman >/dev/null 2>&1; then
    echo "using pacman for dependencies"
    sudo pacman -Syu
    sudo pacman -S nodejs npm python-fastapi python-uvicorn python-python-multipart curl
elif command -v apt >/dev/null 2>&1; then
    echo "using apt for dependencies"
    sudo apt update && sudo apt upgrade -y
    sudo apt install python3 python3-pip pipx npm curl
    pip install --break-system-packages --disable-pip-version-check --quiet python-multipart uvicorn fastapi
elif command -v dnf >/dev/null 2>&1; then
    echo "using dnf for dependencies"
    sudo dnf upgrade -y
    sudo dnf install python3 python3-pip pipx npm curl
    pip install --break-system-packages --disable-pip-version-check --quiet python-multipart uvicorn fastapi
else
    echo "package manager not found :("
    exit 1
fi

if command -v ollama &> /dev/null; then
    echo "Ollama is already installed"
else
    echo "Installing Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
    if [ $? -eq 0 ]; then
        echo "Ollama installed successfully"
    else
        echo "Failed to install Ollama"
        exit 1
    fi
fi

echo ""
echo "Starting Ollama service..."
ollama serve &> /dev/null &
sleep 2

echo "Checking for qwen3:0.6b model..."
if ollama list | grep -q "qwen3:0.6b"; then
    echo "local modal already installed"
else
    echo "pulling qwen3:0.6b model, please wait"
    ollama pull qwen3:0.6b
    if [ $? -eq 0 ]; then
        echo "qwen3:0.6b model installed successfully"
    else
        echo "Failed to install local model"
        exit 1
    fi
fi

echo ""
echo "Installing Desktop client..."
sudo chmod +x ./electron-client/install.sh
./electron-client/install.sh



echo ""
echo "Installing npm dependencies..."
npm i
cd electron-client
npm i
cd ..
if [ $? -eq 0 ]; then
    echo "npm dependencies installed successfully"
else
    echo "Failed to install npm dependencies"
    exit 1
fi

echo ""
echo "=== Installation Complete ==="
echo "You can now run the application with the keeko command for Desktop, or the ./run.sh for the browser site"
