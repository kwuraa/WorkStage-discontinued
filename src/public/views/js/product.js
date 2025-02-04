const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const produtoDetalhes = document.getElementById("produtoDetalhes");
  const btnAtualizar = document.getElementById("btnAtualizar");
  const btnDeletar = document.getElementById("btnDeletar");

  // Obtém o ID do produto a partir do parâmetro de URL (ex: product.html?id=1)
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    produtoDetalhes.innerHTML = "<p>ID do produto não fornecido.</p>";
    btnAtualizar.style.display = "none";
    btnDeletar.style.display = "none";
    return;
  }

  // Função para buscar os detalhes do produto
  async function fetchProduto() {
    try {
      const response = await fetch(`${API_URL}/produtos/${productId}`);
      if (!response.ok) {
        produtoDetalhes.innerHTML = "<p>Produto não encontrado.</p>";
        return;
      }
      const produto = await response.json();
      renderProduto(produto);
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      produtoDetalhes.innerHTML = "<p>Erro ao buscar produto.</p>";
    }
  }

  // Renderiza os detalhes do produto na tela
  function renderProduto(produto) {
    produtoDetalhes.innerHTML = `
      <p><strong>ID:</strong> ${produto.id}</p>
      <p><strong>Nome:</strong> ${produto.nome}</p>
      <p><strong>Data de Cadastro:</strong> ${produto.data_cadastro}</p>
      <p><strong>Status:</strong> ${produto.status}</p>
    `;
  }

  // Atualiza o status do produto
  btnAtualizar.addEventListener("click", async () => {
    const novoStatus = prompt("Digite o novo status para o produto:");
    if (novoStatus) {
      try {
        const response = await fetch(`${API_URL}/produtos/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: novoStatus })
        });
        if (response.ok) {
          fetchProduto();
        } else {
          alert("Erro ao atualizar o status.");
        }
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
      }
    }
  });

  // Deleta o produto
  btnDeletar.addEventListener("click", async () => {
    const confirmar = confirm("Tem certeza que deseja deletar este produto?");
    if (confirmar) {
      try {
        const response = await fetch(`${API_URL}/produtos/${productId}`, {
          method: "DELETE"
        });
        if (response.ok) {
          alert("Produto deletado com sucesso!");
          // Redireciona para a página de listagem após a exclusão
          window.location.href = "index.html";
        } else {
          alert("Erro ao deletar o produto.");
        }
      } catch (error) {
        console.error("Erro ao deletar produto:", error);
      }
    }
  });

  // Inicializa a exibição dos detalhes do produto
  fetchProduto();
});