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
        <span id="dataCadastro">${produto.data_cadastro}</span>
        <span id="status">${produto.status}</span> 
      `;
  
      // Adiciona o evento de clique para redirecionar para a página desejada
      li.addEventListener("click", function() {
        window.location.href = `product.html?id=${produto.id}`;
      });
  
      contentItemList.appendChild(li);
    });
  }

  // Carrega os produtos assim que a página é carregada
  fetchProdutos();
});