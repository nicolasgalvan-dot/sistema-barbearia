import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static("front"));

// Lista de agendamentos em memória (inicia vazia, sem dados mockados)
const agendamentos = [];

// Status e informações do sistema
app.get("/api/status", (req, res) => {
    res.json({
        sistema: "Nicolas Galvan Barber Studio API",
        versao: "1.0.0",
        autor: "NICOLAS GALVAN",
        status: "Online",
        timestamp: new Date().toISOString()
    });
});

// Listar barbeiros diretamente do banco de dados
app.get("/api/barbeiros", async (req, res) => {
    try {
        const dbRes = await pool.query("SELECT * FROM barbeiros WHERE ativo = true ORDER BY id ASC");
        return res.json({ sucesso: true, barbeiros: dbRes.rows });
    } catch (e) {
        console.error("Erro ao listar barbeiros do banco:", e.message);
        return res.status(500).json({ sucesso: false, erro: "Erro ao consultar barbeiros no banco de dados" });
    }
});

// Listar serviços diretamente do banco de dados
app.get("/api/servicos", async (req, res) => {
    try {
        const dbRes = await pool.query("SELECT * FROM servicos WHERE ativo = true ORDER BY id ASC");
        return res.json({ sucesso: true, servicos: dbRes.rows });
    } catch (e) {
        console.error("Erro ao listar serviços do banco:", e.message);
        return res.status(500).json({ sucesso: false, erro: "Erro ao consultar serviços no banco de dados" });
    }
});

// Criar novo agendamento
app.post("/api/agendamentos", async (req, res) => {
    try {
        const { codigo, cliente, telefone, email, servico, barbeiro, data, hora, valor, observacoes } = req.body;

        if (!cliente || !telefone || !servico || !barbeiro || !data || !hora) {
            return res.status(400).json({
                sucesso: false,
                erro: "Campos obrigatórios não preenchidos."
            });
        }

        const bookingCode = codigo || `NG-${Math.floor(1000 + Math.random() * 9000)}`;

        const novoAgendamento = {
            id: agendamentos.length + 1,
            codigo: bookingCode,
            cliente: cliente.trim(),
            telefone: telefone.trim(),
            email: email ? email.trim() : "",
            servico,
            barbeiro,
            data,
            hora,
            valor: valor || "R$ 85,00",
            observacoes: observacoes ? observacoes.trim() : "",
            status: "Confirmado",
            criadoEm: new Date().toISOString()
        };

        // Gravação no PostgreSQL se disponível
        try {
            const dbRes = await pool.query(
                `INSERT INTO agendamentos (codigo, cliente, telefone, email, servico, barbeiro, data, hora, valor, observacoes, status) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                 RETURNING *`,
                [
                    novoAgendamento.codigo,
                    novoAgendamento.cliente,
                    novoAgendamento.telefone,
                    novoAgendamento.email,
                    novoAgendamento.servico,
                    novoAgendamento.barbeiro,
                    novoAgendamento.data,
                    novoAgendamento.hora,
                    novoAgendamento.valor,
                    novoAgendamento.observacoes,
                    novoAgendamento.status
                ]
            );
            if (dbRes.rows && dbRes.rows.length > 0) {
                novoAgendamento.id = dbRes.rows[0].id;
                novoAgendamento.criadoEm = dbRes.rows[0].criado_em;
            }
        } catch (dbError) {
            // Continua em memória se o PostgreSQL local estiver inativo
        }

        agendamentos.unshift(novoAgendamento);
        console.log(`[Novo Agendamento Galvan] ${novoAgendamento.codigo} - ${novoAgendamento.cliente} | ${novoAgendamento.servico} com ${novoAgendamento.barbeiro} em ${novoAgendamento.data} às ${novoAgendamento.hora}`);

        return res.status(201).json({
            sucesso: true,
            mensagem: "Agendamento confirmado com sucesso no Nicolas Galvan Barber Studio!",
            agendamento: novoAgendamento
        });
    } catch (error) {
        console.error("Erro ao registrar agendamento:", error);
        return res.status(500).json({ sucesso: false, erro: "Erro interno no servidor ao agendar" });
    }
});

// Listar agendamentos reais
app.get("/api/agendamentos", async (req, res) => {
    try {
        try {
            const dbRes = await pool.query("SELECT * FROM agendamentos ORDER BY id DESC");
            return res.json({ sucesso: true, agendamentos: dbRes.rows });
        } catch (e) {
            // Fallback para agendamentos em memória se o banco estiver indisponível
            return res.json({ sucesso: true, agendamentos });
        }
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

// Consultar agendamento por código ou telefone
app.get("/api/agendamentos/:codigo", async (req, res) => {
    try {
        const { codigo } = req.params;
        const termo = codigo.trim().toLowerCase();

        // Tentar PostgreSQL se disponível
        try {
            const dbRes = await pool.query(
                "SELECT * FROM agendamentos WHERE LOWER(codigo) = $1 OR telefone LIKE $2 LIMIT 1",
                [termo, `%${termo}%`]
            );
            if (dbRes.rows && dbRes.rows.length > 0) {
                return res.json({ sucesso: true, agendamento: dbRes.rows[0] });
            }
        } catch (e) {}

        const item = agendamentos.find(a => 
            (a.codigo && a.codigo.toLowerCase() === termo) ||
            (a.telefone && a.telefone.replace(/\D/g, "").includes(termo.replace(/\D/g, "")))
        );

        if (item) {
            return res.json({ sucesso: true, agendamento: item });
        }

        return res.status(404).json({ sucesso: false, erro: "Agendamento não encontrado com o código/telefone informado." });
    } catch (error) {
        return res.status(500).json({ sucesso: false, erro: error.message });
    }
});

// Atualizar status do agendamento (ex: Confirmado, Concluído, Cancelado)
app.put("/api/agendamentos/:codigo", async (req, res) => {
    try {
        const { codigo } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ sucesso: false, erro: "Status não fornecido." });
        }

        let itemAtualizado = null;

        try {
            const dbRes = await pool.query(
                "UPDATE agendamentos SET status = $1 WHERE codigo = $2 RETURNING *",
                [status, codigo]
            );
            if (dbRes.rows && dbRes.rows.length > 0) {
                itemAtualizado = dbRes.rows[0];
            }
        } catch (dbError) {}

        const item = agendamentos.find(a => a.codigo === codigo);
        if (item) {
            item.status = status;
            if (!itemAtualizado) itemAtualizado = item;
        }

        if (!itemAtualizado) {
            return res.status(404).json({ sucesso: false, erro: "Agendamento não encontrado para atualização." });
        }

        return res.json({ sucesso: true, mensagem: `Status atualizado para "${status}"`, agendamento: itemAtualizado });
    } catch (error) {
        return res.status(500).json({ sucesso: false, erro: error.message });
    }
});

// Remover/cancelar agendamento
app.delete("/api/agendamentos/:codigo", async (req, res) => {
    try {
        const { codigo } = req.params;
        let deletado = false;

        try {
            const dbRes = await pool.query("DELETE FROM agendamentos WHERE codigo = $1 RETURNING *", [codigo]);
            if (dbRes.rowCount > 0) {
                deletado = true;
            }
        } catch (dbError) {}

        const index = agendamentos.findIndex(a => a.codigo === codigo);
        if (index !== -1) {
            agendamentos.splice(index, 1);
            deletado = true;
        }

        if (!deletado) {
            return res.status(404).json({ sucesso: false, erro: "Agendamento não encontrado para exclusão." });
        }

        return res.json({ sucesso: true, mensagem: `Agendamento ${codigo} removido com sucesso.` });
    } catch (error) {
        return res.status(500).json({ sucesso: false, erro: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`💈 Nicolas Galvan Barber Studio online em http://localhost:${PORT}`);
});
