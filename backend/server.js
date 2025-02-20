const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/config");

const app = express();

app.use(cors());
app.use(express.json());

// Importa as rotas
const produtosRoutes = require("./routes/produtos.routes");
const processosRoutes = require("./routes/processos.routes");

app.use("/produtos", produtosRoutes);
app.use("/processos", processosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
