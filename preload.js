const { contexBridge } = require("electron");

// PROCESSOS
contexBridge.exposeInMainWorld("api", {
  verElectron: () => process.versions.electron,
});
