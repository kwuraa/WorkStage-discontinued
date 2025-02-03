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
        const response = await fetch(`${API_URL}/produtos-com-processos`);
        const produtos = await response.json();
        renderProdutos(produtos);
    }

    async function cadastrarProduto(nome) {
        const response = await fetch(`${API_URL}/produtos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome })
        });
        if (response.ok) {
            fetchProdutos();
        }
    }

    async function atualizarStatus(id, status) {
        await fetch(`${API_URL}/produtos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });
        fetchProdutos();
    }

    async function deletarProduto(id) {
        await fetch(`${API_URL}/produtos/${id}`, { method: "DELETE" });
        fetchProdutos();
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
            
        });
    }

    // document.getElementById('formProduto').addEventListener('submit', async (e) => {
    //     e.preventDefault();
    //     const nome = document.getElementById('nomeProduto').value;
    //     await cadastrarProduto(nome);
    //     document.getElementById('formProduto').reset();
    // });

    fetchProdutos();
});
