const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Middleware para permitir CORS e interpretar JSON
app.use(cors());
app.use(express.json());

// Conectar (ou criar) o banco de dados SQLite
const db = new sqlite3.Database('./database/database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao SQLite');
    }
});

// Criar a tabela de produtos se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pendente',
        data_cadastro TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    )
`);

// Criar a tabela de processos se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS processos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produto_id INTEGER,
        nome TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pendente',
        FOREIGN KEY(produto_id) REFERENCES produtos(id)
    )
`);

// Criar a tabela de histórico de produtos finalizados
db.run(`
    CREATE TABLE IF NOT EXISTS historico_produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        data_cadastro TEXT NOT NULL,
        data_finalizacao TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    )
`);

// Endpoint para cadastrar um novo produto com seus processos
app.post('/produtos', (req, res) => {
    const { nome, processos } = req.body;

    db.run(`INSERT INTO produtos (nome, status) VALUES (?, 'pendente')`, [nome], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const produtoId = this.lastID;
        
        if (processos && processos.length) {
            const stmt = db.prepare(`INSERT INTO processos (produto_id, nome, status) VALUES (?, ?, 'pendente')`);
            processos.forEach(processo => {
                stmt.run(produtoId, processo.nome, (err) => {
                    if (err) {
                        console.error(`Erro ao inserir processo "${processo.nome}":`, err.message);
                    }
                });
            });
            stmt.finalize();
        }
        
        res.json({ id: produtoId, nome, status: 'pendente', processos });
    });
});

// Endpoint para listar produtos com seus processos agrupados
app.get('/produtos-com-processos', (req, res) => {
    const sql = `
        SELECT 
            p.id AS produto_id,
            p.nome AS produto_nome,
            p.status AS produto_status,
            p.data_cadastro AS produto_data_cadastro,
            pr.id AS processo_id,
            pr.nome AS processo_nome,
            pr.status AS processo_status
        FROM produtos p
        LEFT JOIN processos pr ON p.id = pr.produto_id
        ORDER BY p.id, pr.id
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const produtosMap = {};
        rows.forEach(row => {
            if (!produtosMap[row.produto_id]) {
                produtosMap[row.produto_id] = {
                    id: row.produto_id,
                    nome: row.produto_nome,
                    status: row.produto_status,
                    data_cadastro: row.produto_data_cadastro,
                    processos: []
                };
            }
            if (row.processo_id) {
                produtosMap[row.produto_id].processos.push({
                    id: row.processo_id,
                    nome: row.processo_nome,
                    status: row.processo_status
                });
            }
        });
        
        const produtos = Object.values(produtosMap);
        res.json(produtos);
    });
});

// Endpoint para atualizar o status de um produto e movê-lo para o histórico se finalizado
app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (status === 'finalizado') {
        db.get(`SELECT nome, data_cadastro FROM produtos WHERE id = ?`, [id], (err, row) => {
            if (err || !row) {
                res.status(500).json({ error: err ? err.message : 'Produto não encontrado' });
                return;
            }
            
            db.run(`INSERT INTO historico_produtos (nome, data_cadastro) VALUES (?, ?)`, [row.nome, row.data_cadastro], (err) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                
                db.run(`DELETE FROM processos WHERE produto_id = ?`, [id], (err) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    
                    db.run(`DELETE FROM produtos WHERE id = ?`, [id], (err) => {
                        if (err) {
                            res.status(500).json({ error: err.message });
                            return;
                        }
                        res.json({ message: 'Produto finalizado e movido para o histórico' });
                    });
                });
            });
        });
    } else {
        db.run(`UPDATE produtos SET status = ? WHERE id = ?`, [status, id], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Produto atualizado' });
        });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
