console.log("Rodando ...");
const { app, BrowserWindow } = require("electron");
const { createWindow } = require("./windowManager");

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
