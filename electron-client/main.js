const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const http = require('http');

let win;


async function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  await win.loadURL('http://localhost:8080');

  // Inject CSS to hide scrollbars
  win.webContents.insertCSS('body::-webkit-scrollbar { display: none; } body { overflow: hidden !important; }');
}

// Remove default menu (just in case)
Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

