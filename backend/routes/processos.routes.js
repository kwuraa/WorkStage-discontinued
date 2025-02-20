const express = require("express");
const router = express.Router();
const processosController = require("../controllers/processos.controller");

router.post("/", processosController.createProcesso);
router.put("/:id", processosController.updateProcesso);
router.delete("/:id", processosController.deleteProcesso);
router.put("/:id/concluir", processosController.concluirProcesso);

module.exports = router;
