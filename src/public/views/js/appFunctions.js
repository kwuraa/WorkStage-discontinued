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
  // Seleciona a sidebar e, dentro dela, os botões que não possuem a classe 'menuBtn'
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

// SEARCH BAR

const searchBar = document.querySelector(".searchBar");
const searchInput = document.querySelector(".searchBar input");
const overlayInfos = document.querySelector(".overlayInfos");

searchBar.addEventListener("click", () => {
  searchBar.classList.add("open");
  overlayInfos.style.display = "block";
  overlayInfos.style.opacity = "1";
  searchInput.focus();
});

document.addEventListener("click", (event) => {
  if (
    !searchBar.contains(event.target) &&
    searchBar.classList.contains("open")
  ) {
    searchBar.classList.add("closing");
    overlayInfos.style.opacity = "0";

    setTimeout(() => {
      searchBar.classList.remove("open", "closing");
      overlayInfos.style.display = "none";
    }, 300);
  }
});

/* cadastroModal.js */
  // Seleciona o modal de cadastro e o botão para abri-lo
  const cadastroModal = document.getElementById("cadastroModal");
  const addBtn = document.getElementById("addBtn");
  const closeBtn = cadastroModal.querySelector(".close");

  // Abre o modal quando o botão "Adicionar" for clicado
  addBtn.addEventListener("click", () => {
    cadastroModal.style.display = "block";
  });

  // Fecha o modal ao clicar no "×"
  closeBtn.addEventListener("click", () => {
    cadastroModal.style.display = "none";
  });

  // Fecha o modal se o usuário clicar fora da área de conteúdo
  window.addEventListener("click", (event) => {
    if (event.target === cadastroModal) {
      cadastroModal.style.display = "none";
    }
  });

  // Lógica para adicionar inputs dinâmicos para processos
  const addProcessoBtn = document.getElementById("addProcessoBtn");
  const processosContainer = document.getElementById("processosContainer");
  const produtoForm = document.getElementById("produtoForm");

  addProcessoBtn.addEventListener("click", () => {
    const inputWrapper = document.createElement("div");
    inputWrapper.classList.add("processo-input");

    const novoInput = document.createElement("input");
    novoInput.type = "text";
    novoInput.name = "processo";
    novoInput.placeholder = "Processo";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "X"
    removeBtn.classList.add("formBtn", "styleBtn")
    removeBtn.addEventListener("click", () => {
      processosContainer.removeChild(inputWrapper);
    });

    inputWrapper.appendChild(novoInput);
    inputWrapper.appendChild(removeBtn);
    processosContainer.appendChild(inputWrapper);
  });

  // Submissão do formulário de cadastro
  produtoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;

    const processoInputs = document.getElementsByName("processo");
    const processos = Array.from(processoInputs)
      .filter(input => input.value.trim() !== "")
      .map(input => ({ nome: input.value.trim() }));

    const data = { nome, descricao, processos };

    fetch("http://localhost:3000/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro na requisição: " + response.statusText);
        }
        return response.json();
      })
      .then(result => {
        console.log("Produto cadastrado com sucesso:", result);
        alert("Produto cadastrado com sucesso!");
        // Limpa o formulário e os inputs dinâmicos
        produtoForm.reset();
        processosContainer.innerHTML = "<h3>Processos</h3>";
        // Fecha o modal
        cadastroModal.style.display = "none";
      })
      .catch(error => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao cadastrar o produto.");
      });
  });
