const db = require("../db/db");

exports.createProduto = (req, res) => {
  const { nome, descricao, processos } = req.body;
  if (!nome)
    return res.status(400).json({ error: "Nome do produto é obrigatório" });

  db.run(
    `INSERT INTO produtos (nome, descricao) VALUES (?, ?)`,
    [nome, descricao || ""],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const produtoId = this.lastID;

      if (processos && processos.length) {
        const stmt = db.prepare(
          `INSERT INTO processos (produto_id, nome) VALUES (?, ?)`
        );
        processos.forEach((processo) => stmt.run(produtoId, processo.nome));
        stmt.finalize();
      }

      res.status(201).json({
        id: produtoId,
        nome,
        descricao: descricao || "",
        status: "pendente",
        processos: processos || [],
      });
    }
  );
};

exports.getProdutos = (req, res) => {
  db.all(`SELECT * FROM produtos ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getProdutoById = (req, res) => {
  db.get(`SELECT * FROM produtos WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(row);
  });
};

exports.updateProdutoStatus = (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "Status é obrigatório" });

  db.run(
    `UPDATE produtos SET status = ? WHERE id = ?`,
    [status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Produto não encontrado" });
      res.json({ message: "Produto atualizado" });
    }
  );
};

exports.deleteProduto = (req, res) => {
  db.run(`DELETE FROM produtos WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Produto não encontrado" });
    res.status(204).send();
  });
};
