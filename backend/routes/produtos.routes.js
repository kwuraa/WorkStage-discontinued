const express = require("express");
const router = express.Router();
const produtosController = require("../controllers/produtos.controller");
const processosController = require("../controllers/processos.controller");

router.post("/", produtosController.createProduto);
router.get("/", produtosController.getProdutos);
router.get("/:id", produtosController.getProdutoById);
router.get("/:id/processos", processosController.getProcessosByProduto);
router.put("/:id", produtosController.updateProdutoStatus);
router.delete("/:id", produtosController.deleteProduto);

module.exports = router;
