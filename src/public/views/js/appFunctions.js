// TOGGLE MENU LEFT BAR
const mySideBar = document.getElementById("mySideBar");
const displayLogo = document.getElementById("displayLogo");
const logo = document.getElementById("oldLogo");
const overlay = document.getElementById("overlay")


const buttons = document.querySelectorAll(" .buttons .unitButtons");

var isLeftMenuIsOpened = false;

function toggleMenu(state) {
  isLeftMenuIsOpened = state !== undefined ? state : !isLeftMenuIsOpened;

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

    button.classList.toggle("hover", isLeftMenuIsOpened);
    button.classList.toggle("hover", !isLeftMenuIsOpened);
  });

  displayLogo.classList.toggle("opened", isLeftMenuIsOpened);
  displayLogo.classList.toggle("closed", !isLeftMenuIsOpened);

  logo.classList.toggle("logoOpen", isLeftMenuIsOpened);
  logo.classList.toggle("logoClose", !isLeftMenuIsOpened);



  overlay.style.display = isLeftMenuIsOpened ? "block" : "none";

}

function atualizarEstadoBotoes() {
  // Seleciona a barra lateral
  const sidebar = document.getElementById("mySideBar");
  // Seleciona somente os botões dentro da sidebar, exceto o menuBtn
  const botoes = sidebar.querySelectorAll("button:not(.menuBtn)");

  // Se a sidebar estiver fechada, desativa os botões; se não, ativa
  if (sidebar.classList.contains("closed")) {
    botoes.forEach(botao => {
      botao.disabled = true; // desativa o botão
      botao.classList.remove("hover")
      // botao.classList.add("botao-inativo");
    });
  } else {
    botoes.forEach(botao => {
      botao.disabled = false; // ativa o botão
      botao.classList.add("hover")
      // botao.classList.remove("botao-inativo");
    });
  }
}
const menuBtn = document.getElementById("showHideMenus");
menuBtn.addEventListener("click", () => {
  const sidebar = document.getElementById("mySideBar");
  // Alterna a classe 'closed'
  sidebar.classList.toggle("closed");
  // Atualiza o estado dos outros botões
  atualizarEstadoBotoes();
});

// SEARCH BAR

const searchBar = document.querySelector('.searchBar');
const searchInput = document.querySelector('.searchBar input');
const overlayInfos = document.querySelector('.overlayInfos');

searchBar.addEventListener('click', () => {
    searchBar.classList.add('open');
    overlayInfos.style.display = 'block'; 
    overlayInfos.style.opacity = '1'; 
    searchInput.focus();
});


document.addEventListener('click', (event) => {
    if (!searchBar.contains(event.target) && searchBar.classList.contains('open')) {
        searchBar.classList.add('closing');
        overlayInfos.style.opacity = '0'; 
        
        setTimeout(() => {
            searchBar.classList.remove('open', 'closing');
            overlayInfos.style.display = 'none'; 
        }, 300);
    }
});


showHideMenus.addEventListener("click", () => toggleMenu());
overlay.addEventListener("click", () => toggleMenu(false));
