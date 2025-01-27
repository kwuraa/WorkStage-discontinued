console.log("Rodando ...");

const { app, BrowserWindow, Menu } = require("electron");
const path = require("node:path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    // titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("./src/public/views/index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on;
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
