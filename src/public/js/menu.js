// TOGGLE MENU LEFT BAR
const mySideBar = document.getElementById("mySideBar");
const displayLogo = document.getElementById("displayLogo");
const logo = document.getElementById("oldLogo");
const overlay = document.getElementById("overlay");

const menuBtn = document.getElementById("showHideMenus");
const buttons = document.querySelectorAll(".buttons .unitButtons");

let isLeftMenuIsOpened = false;

function toggleMenu(state) {
  // Define o estado do menu: se 'state' foi informado, usa-o; caso contrário, inverte o estado atual
  isLeftMenuIsOpened = state !== undefined ? state : !isLeftMenuIsOpened;

  // Atualiza classes da sidebar
  mySideBar.classList.toggle("opened", isLeftMenuIsOpened);
  mySideBar.classList.toggle("closed", !isLeftMenuIsOpened);

  // Atualiza classes do botão de menu
  menuBtn.classList.toggle("icon-menu-open", isLeftMenuIsOpened);
  menuBtn.classList.toggle("icon-menu", !isLeftMenuIsOpened);

  // Atualiza cada botão (e seus labels, se houver)
  buttons.forEach((button) => {
    const label = button.querySelector("label");
    if (label) {
      label.classList.toggle("labelOpen", isLeftMenuIsOpened);
      label.classList.toggle("labelClose", !isLeftMenuIsOpened);
    }
    button.classList.toggle("hover", isLeftMenuIsOpened);
  });

  // Atualiza classes dos logos
  displayLogo.classList.toggle("opened", isLeftMenuIsOpened);
  displayLogo.classList.toggle("closed", !isLeftMenuIsOpened);

  logo.classList.toggle("logoOpen", isLeftMenuIsOpened);
  logo.classList.toggle("logoClose", !isLeftMenuIsOpened);

  // Exibe ou esconde o overlay
  overlay.style.display = isLeftMenuIsOpened ? "block" : "none";

  // Atualiza o estado dos botões dentro da sidebar
  atualizarEstadoBotoes();
}

function atualizarEstadoBotoes() {
  // Seleciona a left e, dentro dela, os botões que não possuem a classe 'menuBtn'
  const sidebar = document.getElementById("mySideBar");
  const botoes = sidebar.querySelectorAll("button:not(.menuBtn)");

  // Se a sidebar estiver fechada, desativa os botões; se estiver aberta, ativa-os
  if (sidebar.classList.contains("closed")) {
    botoes.forEach((botao) => {
      botao.disabled = true;
      botao.classList.remove("hover");
    });
  } else {
    botoes.forEach((botao) => {
      botao.disabled = false;
      botao.classList.add("hover");
    });
  }
}

// Event listeners para o menu
menuBtn.addEventListener("click", () => toggleMenu());
overlay.addEventListener("click", () => toggleMenu(false));
