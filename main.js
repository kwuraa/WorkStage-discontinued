console.log("Rodando ...");

const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("node:path");
const ipc = ipcMain;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 940,
    minHeight: 560,
    frame: false,
    // titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("./src/public/views/index.html");

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
};

app.whenReady().then(() => {
  createWindow();

  app.on;
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
