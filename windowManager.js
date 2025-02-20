const { BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("node:path");
const ipc = ipcMain;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1720,
    height: 920,
    minWidth: 1280,
    minHeight: 720,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("./src/public/index.html");

  // MINIMIZE APP
  ipc.on("minimizeApp", () => {
    win.minimize();
  });

  // MAXIMIZE RESTORE APP
  ipc.on("maximizeRestoreApp", () => {
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
  });

  // Check Maximized
  win.on("maximize", () => {
    win.webContents.send("isMaximized");
  });

  // Check Restored
  win.on("unmaximize", () => {
    win.webContents.send("isRestored");
  });

  // CLOSE APP
  ipc.on("closeApp", () => {
    win.close();
  });

  return win;
};

module.exports = { createWindow };
