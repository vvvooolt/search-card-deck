#!/bin/bash

echo "=== Keeko Installation Script for Arch Linux ==="
echo ""

# Check if ollama is already installed
if command -v ollama &> /dev/null; then
    echo "✓ Ollama is already installed"
else
    echo "Installing Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
    if [ $? -eq 0 ]; then
        echo "✓ Ollama installed successfully"
    else
        echo "✗ Failed to install Ollama"
        exit 1
    fi
fi

echo ""
echo "Starting Ollama service..."
ollama serve &> /dev/null &
sleep 2

# Check if qwen3:0.6b model is available
echo "Checking for qwen3:0.6b model..."
if ollama list | grep -q "qwen3:0.6b"; then
    echo "✓ qwen3:0.6b model is already available"
else
    echo "Downloading qwen3:0.6b model (this may take a while)..."
    ollama pull qwen3:0.6b
    if [ $? -eq 0 ]; then
        echo "✓ qwen3:0.6b model installed successfully"
    else
        echo "✗ Failed to install qwen3:0.6b model"
        exit 1
    fi
fi

echo ""
echo "Installing npm dependencies..."
npm i
if [ $? -eq 0 ]; then
    echo "✓ npm dependencies installed successfully"
else
    echo "✗ Failed to install npm dependencies"
    exit 1
fi

echo ""
echo "=== Installation Complete ==="
echo "You can now run the application with ./run.sh"
