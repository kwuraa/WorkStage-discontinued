const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('./database/database.db', (err) => {
    if (err) console.error('Erro ao conectar ao banco de dados:', err.message);
    else console.log('Conectado ao SQLite');
});

// Criar tabelas se não existirem
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pendente',
        data_cadastro TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS processos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produto_id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pendente',
        FOREIGN KEY(produto_id) REFERENCES produtos(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS historico_produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        data_cadastro TEXT NOT NULL,
        data_finalizacao TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    )`);
});

//  Criar um novo produto
app.post('/produtos', (req, res) => {
    const { nome, processos } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome do produto é obrigatório' });

    db.run(`INSERT INTO produtos (nome) VALUES (?)`, [nome], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        const produtoId = this.lastID;

        if (processos && processos.length) {
            const stmt = db.prepare(`INSERT INTO processos (produto_id, nome) VALUES (?, ?)`);
            processos.forEach(processo => stmt.run(produtoId, processo.nome));
            stmt.finalize();
        }

        res.status(201).json({ id: produtoId, nome, status: 'pendente', processos: processos || [] });
    });
});

//  Listar todos os produtos
app.get('/produtos', (req, res) => {
    db.all(`SELECT * FROM produtos ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

//  Obter um único produto pelo ID
app.get('/produtos/:id', (req, res) => {
    db.get(`SELECT * FROM produtos WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Produto não encontrado' });
        res.json(row);
    });
});

//  Listar processos de um produto específico
app.get('/produtos/:id/processos', (req, res) => {
    db.all(`SELECT * FROM processos WHERE produto_id = ?`, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

//  Atualizar status de um produto
app.put('/produtos/:id', (req, res) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status é obrigatório' });

    db.run(`UPDATE produtos SET status = ? WHERE id = ?`, [status, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
        res.json({ message: 'Produto atualizado' });
    });
});

//  Concluir um processo e avançar para o próximo
app.put('/processos/:id/concluir', (req, res) => {
    const { id } = req.params;

    // Marcar o processo atual como concluído
    db.run(`UPDATE processos SET status = 'concluído' WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Processo não encontrado' });

        // Obter o ID do produto relacionado a esse processo
        db.get(`SELECT produto_id FROM processos WHERE id = ?`, [id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ error: 'Produto não encontrado' });

            const produtoId = row.produto_id;

            // Encontrar o próximo processo pendente do mesmo produto
            db.get(
                `SELECT id FROM processos WHERE produto_id = ? AND status = 'pendente' ORDER BY id ASC LIMIT 1`,
                [produtoId],
                (err, nextProcess) => {
                    if (err) return res.status(500).json({ error: err.message });

                    if (nextProcess) {
                        // Se houver um próximo processo, marcá-lo como "em andamento"
                        db.run(
                            `UPDATE processos SET status = 'em andamento' WHERE id = ?`,
                            [nextProcess.id],
                            (err) => {
                                if (err) return res.status(500).json({ error: err.message });
                                res.json({ message: 'Processo concluído. Próxima etapa iniciada.', nextProcessId: nextProcess.id });
                            }
                        );
                    } else {
                        // Se não houver mais processos, verificar se o produto pode ser finalizado
                        db.get(
                            `SELECT COUNT(*) AS pendentes FROM processos WHERE produto_id = ? AND status IN ('pendente', 'em andamento')`,
                            [produtoId],
                            (err, result) => {
                                if (err) return res.status(500).json({ error: err.message });

                                if (result.pendentes === 0) {
                                    // Atualizar o status do produto para "finalizado"
                                    db.run(
                                        `UPDATE produtos SET status = 'finalizado' WHERE id = ?`,
                                        [produtoId],
                                        (err) => {
                                            if (err) return res.status(500).json({ error: err.message });
                                            res.json({ message: 'Processo concluído. Produto finalizado.' });
                                        }
                                    );
                                } else {
                                    res.json({ message: 'Processo concluído. Não há mais etapas pendentes.' });
                                }
                            }
                        );
                    }
                }
            );
        });
    });
});



//  Remover um produto
app.delete('/produtos/:id', (req, res) => {
    db.run(`DELETE FROM produtos WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
        res.status(204).send(); // 204: No Content
    });
});

//  Criar um novo processo
app.post('/processos', (req, res) => {
    const { produto_id, nome } = req.body;
    if (!produto_id || !nome) return res.status(400).json({ error: 'Produto ID e Nome são obrigatórios' });

    db.run(`INSERT INTO processos (produto_id, nome) VALUES (?, ?)`, [produto_id, nome], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, produto_id, nome, status: 'pendente' });
    });
});

//  Atualizar um processo
app.put('/processos/:id', (req, res) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status é obrigatório' });

    db.run(`UPDATE processos SET status = ? WHERE id = ?`, [status, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Processo não encontrado' });
        res.json({ message: 'Processo atualizado' });
    });
});

//  Remover um processo
app.delete('/processos/:id', (req, res) => {
    db.run(`DELETE FROM processos WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Processo não encontrado' });
        res.status(204).send();
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
