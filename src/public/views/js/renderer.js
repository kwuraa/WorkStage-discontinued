const { ipcRenderer } = require("electron");
const maxResBtn = document.getElementById("maxResBtn");

const ipc = ipcRenderer;


// buttons | minimize | maximize | restore | close
minimizeBtn.addEventListener("click", () => {
  ipc.send("minimizeApp");
});
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
closeBtn.addEventListener("click", () => {
  ipc.send("closeApp");
});

// backend for database
const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const contentItemList = document.getElementById("contentItemList");
  const productModal = document.getElementById("productModal");
  const modalProductContent = document.getElementById("modalProductContent");
  const spanClose = document.querySelector(".close");

  // Função para formatar data
  function formatDate(dataStr) {
    const date = new Date(dataStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Função para renderizar os detalhes do produto, incluindo seus processos
  async function renderProdutoDetalhes(produto) {
    // Preenche os dados básicos do produto
    modalProductContent.innerHTML = `
      <h2>Detalhes do Produto</h2>
      <p><strong>ID:</strong> ${produto.id}</p>
      <p><strong>Nome:</strong> ${produto.nome}</p>
      <p><strong>Data de Cadastro:</strong> ${formatDate(produto.data_cadastro)}</p>
      <p><strong>Status:</strong> ${produto.status}</p>
      <div id="processosContainer">
        <p>Carregando processos...</p>
      </div>
    `;

    // Busca os processos relacionados ao produto
    try {
      const response = await fetch(`${API_URL}/produtos/${produto.id}/processos`);
      if (!response.ok) {
        throw new Error("Erro ao buscar os processos");
      }
      const processos = await response.json();
      const processosContainer = document.getElementById("processosContainer");

      if (!processos.length) {
        processosContainer.innerHTML = `<p>Sem processos cadastrados.</p>`;
        return;
      }

      // Monta a lista de processos
      let htmlProcessos = '<h3>Processos:</h3><ul>';
      processos.forEach(processo => {
        htmlProcessos += `
          <li>
            <strong>Nome:</strong> ${processo.nome} - 
            <strong>Status:</strong> ${processo.status}
          </li>
        `;
      });
      htmlProcessos += '</ul>';
      processosContainer.innerHTML = htmlProcessos;
    } catch (error) {
      console.error("Erro ao buscar processos:", error);
      const processosContainer = document.getElementById("processosContainer");
      processosContainer.innerHTML = `<p>Erro ao carregar processos.</p>`;
    }
  }

  // Renderiza a lista de produtos
  async function fetchProdutos() {
    try {
      const response = await fetch(`${API_URL}/produtos`);
      const produtos = await response.json();
      renderProdutos(produtos);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  }

  function renderProdutos(produtos) {
    contentItemList.innerHTML = "";
    produtos.forEach(produto => {
      const li = document.createElement("li");
      li.classList.add("infos");

      li.innerHTML = `
        <span id="idProduto">${produto.id}</span>
        <span id="produto">${produto.nome}</span>
        <span id="dataCadastro">${formatDate(produto.data_cadastro)}</span>
        <span id="status">${produto.status}</span> 
      `;

      // Ao clicar em um produto, abre o modal e exibe seus detalhes, incluindo os processos
      li.addEventListener("click", function() {
        renderProdutoDetalhes(produto);
        productModal.style.display = "block";
      });

      contentItemList.appendChild(li);
    });
  }

  // Fecha o modal quando o usuário clicar no "x"
  spanClose.addEventListener("click", function() {
    productModal.style.display = "none";
  });

  // Fecha o modal se o usuário clicar fora do conteúdo dele
  window.addEventListener("click", function(event) {
    if (event.target === productModal) {
      productModal.style.display = "none";
    }
  });

  // Carrega os produtos assim que a página for carregada
  fetchProdutos();
});