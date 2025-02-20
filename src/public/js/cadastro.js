// Seleciona os elementos
const cadastroModal = document.getElementById("cadastroModal");
const addBtn = document.getElementById("addBtn");
const closeBtn = cadastroModal.querySelector(".close");
const addProcessoBtn = document.getElementById("addProcessoBtn");
const processosContainer = document.getElementById("processosContainer");
const produtoForm = document.getElementById("produtoForm");

// Funções para abrir e fechar o modal com transição via opacity
function openModal() {
  // Adiciona a classe que define opacity: 1 e visibility: visible
  setTimeout(() => cadastroModal.classList.add("show"), 10);
}

function closeModal() {
  // Remove a classe que mostra o modal
  setTimeout(() => {
    cadastroModal.classList.remove("show");
  }, 400);
}

// Abre o modal quando o botão "Adicionar" for clicado
addBtn.addEventListener("click", openModal);

// Fecha o modal ao clicar no "×"
closeBtn.addEventListener("click", closeModal);

// Fecha o modal se o usuário clicar fora da área de conteúdo
window.addEventListener("click", (event) => {
  if (event.target === cadastroModal) {
    closeModal();
  }
});

// Lógica para adicionar inputs dinâmicos para processos
addProcessoBtn.addEventListener("click", () => {
  const inputWrapper = document.createElement("div");
  inputWrapper.classList.add("processo-input");

  const novoInput = document.createElement("input");
  novoInput.type = "text";
  novoInput.name = "processo";
  novoInput.placeholder = "Processo";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.innerHTML =
    '<img class="closeBtn" src="./css/img/icons/close.svg" />';
  removeBtn.classList.add("formBtn", "styleBtn");
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
    .filter((input) => input.value.trim() !== "")
    .map((input) => ({ nome: input.value.trim() }));

  const data = { nome, descricao, processos };

  fetch("http://localhost:3000/produtos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.statusText);
      }
      return response.json();
    })
    .then((result) => {
      console.log("Produto cadastrado com sucesso:", result);
      alert("Produto cadastrado com sucesso!");

      // Limpa o formulário
      produtoForm.reset();

      // Remove os inputs dinâmicos, se houver
      const dynamicInputs =
        processosContainer.querySelectorAll(".processo-input");
      dynamicInputs.forEach((inputWrapper) => {
        processosContainer.removeChild(inputWrapper);
      });

      // Fecha o modal com a transição de opacity
      closeModal();
      window.location.reload();
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Ocorreu um erro ao cadastrar o produto.");
    });
});
