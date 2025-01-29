const { ipcRenderer } = require("electron");
const maxResBtn = document.getElementById("maxResBtn");

const ipc = ipcRenderer;

// MINIMIZE APP
minimizeBtn.addEventListener("click", () => {
  ipc.send("minimizeApp");
});

// MAXIMIZE RESTORE APP
function changeMaxResBtn(isMaximizedApp) {
  if (isMaximizedApp) {
    maxResBtn.title = "Restore";
    maxResBtn.classList.remove("maximizeBtn");
    maxResBtn.classList.add("restoreBtn");
  } else {
    maxResBtn.title = "Maximize";
    maxResBtn.classList.remove("restoreBtn");
    maxResBtn.classList.add("maximizeBtn");
  }
}
maxResBtn.addEventListener("click", () => {
  ipc.send("maximizeRestoreApp");
});
ipc.on("isMaximized", () => {
  changeMaxResBtn(true);
});
ipc.on("isRestored", () => {
  changeMaxResBtn(false);
});

// CLOSE APP
closeBtn.addEventListener("click", () => {
  ipc.send("closeApp");
});

// TOGGLE MENU LEFT BAR
const mySideBar = document.getElementById("mySideBar");
const displayLogo = document.getElementById("displayLogo");
const logo = document.getElementById("oldLogo");

const buttons = document.querySelectorAll(" .buttons .unitButtons");

var isLeftMenuIsOpened = false;

showHideMenus.addEventListener("click", () => {
  isLeftMenuIsOpened = !isLeftMenuIsOpened;

  mySideBar.classList.toggle("opened", isLeftMenuIsOpened);
  mySideBar.classList.toggle("closed", !isLeftMenuIsOpened);

  showHideMenus.classList.toggle("icon-menu-open", isLeftMenuIsOpened);
  showHideMenus.classList.toggle("icon-menu", !isLeftMenuIsOpened);

  buttons.forEach((button) => {
    const label = button.querySelector("label");
    if (label) {
      label.classList.toggle("labelOpen", isLeftMenuIsOpened);
      label.classList.toggle("labelClose", !isLeftMenuIsOpened);
    }
  });

  displayLogo.classList.toggle("opened", isLeftMenuIsOpened);
  displayLogo.classList.toggle("closed", !isLeftMenuIsOpened);

  logo.classList.toggle("logoOpen", isLeftMenuIsOpened);
  logo.classList.toggle("logoClose", !isLeftMenuIsOpened);
});
