const db = require("../db/db");

exports.createProcesso = (req, res) => {
  const { produto_id, nome } = req.body;
  if (!produto_id || !nome)
    return res
      .status(400)
      .json({ error: "Produto ID e Nome são obrigatórios" });

  db.run(
    `INSERT INTO processos (produto_id, nome) VALUES (?, ?)`,
    [produto_id, nome],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res
        .status(201)
        .json({ id: this.lastID, produto_id, nome, status: "pendente" });
    }
  );
};

exports.getProcessosByProduto = (req, res) => {
  db.all(
    `SELECT * FROM processos WHERE produto_id = ?`,
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

exports.updateProcesso = (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "Status é obrigatório" });

  db.run(
    `UPDATE processos SET status = ? WHERE id = ?`,
    [status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Processo não encontrado" });
      res.json({ message: "Processo atualizado" });
    }
  );
};

exports.deleteProcesso = (req, res) => {
  db.run(`DELETE FROM processos WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Processo não encontrado" });
    res.status(204).send();
  });
};

exports.concluirProcesso = (req, res) => {
  const { id } = req.params;

  db.run(
    `UPDATE processos SET status = 'concluído' WHERE id = ?`,
    [id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Processo não encontrado" });

      // Recupera o produto relacionado ao processo
      db.get(
        `SELECT produto_id FROM processos WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) return res.status(500).json({ error: err.message });
          if (!row)
            return res.status(404).json({ error: "Produto não encontrado" });

          const produtoId = row.produto_id;

          // Procura o próximo processo pendente
          db.get(
            `SELECT id FROM processos WHERE produto_id = ? AND status = 'pendente' ORDER BY id ASC LIMIT 1`,
            [produtoId],
            (err, nextProcess) => {
              if (err) return res.status(500).json({ error: err.message });

              if (nextProcess) {
                db.run(
                  `UPDATE processos SET status = 'em andamento' WHERE id = ?`,
                  [nextProcess.id],
                  (err) => {
                    if (err)
                      return res.status(500).json({ error: err.message });
                    res.json({
                      message: "Processo concluído. Próxima etapa iniciada.",
                      nextProcessId: nextProcess.id,
                    });
                  }
                );
              } else {
                db.get(
                  `SELECT COUNT(*) AS pendentes FROM processos WHERE produto_id = ? AND status IN ('pendente', 'em andamento')`,
                  [produtoId],
                  (err, result) => {
                    if (err)
                      return res.status(500).json({ error: err.message });
                    if (result.pendentes === 0) {
                      db.run(
                        `UPDATE produtos SET status = 'finalizado' WHERE id = ?`,
                        [produtoId],
                        (err) => {
                          if (err)
                            return res.status(500).json({ error: err.message });
                          res.json({
                            message: "Processo concluído. Produto finalizado.",
                          });
                        }
                      );
                    } else {
                      res.json({
                        message:
                          "Processo concluído. Não há mais etapas pendentes.",
                      });
                    }
                  }
                );
              }
            }
          );
        }
      );
    }
  );
};
