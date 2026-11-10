import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static("front"));

// Base em memória para garantir funcionamento imediato mesmo sem banco de dados local
const barbeirosData = [
    {
        id: 1,
        nome: "Nicolas Galvan",
        cargo: "Master Barber & Fundador",
        especialidade: "Fade Milimétrico, Visagismo & Tesoura",
        experiencia: "12 anos exp.",
        avaliacao: "5.0 (480)",
        foto: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80",
        badge: "Fundador"
    },
    {
        id: 2,
        nome: "Rafael Mendes",
        cargo: "Especialista em Barboterapia",
        especialidade: "Barba Terapia, Toalha Quente & Alinhamento",
        experiencia: "8 anos exp.",
        avaliacao: "4.9 (340)",
        foto: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=700&q=80",
        badge: "Especialista"
    },
    {
        id: 3,
        nome: "Lucas Albuquerque",
        cargo: "Hair Stylist & Trend Hunter",
        especialidade: "Cortes Modernos, Texturizados & Freestyle",
        experiencia: "6 anos exp.",
        avaliacao: "4.9 (295)",
        foto: "https://images.unsplash.com/photo-1517832606589-7629c3397143?auto=format&fit=crop&w=700&q=80",
        badge: "Freestyle"
    },
    {
        id: 4,
        nome: "André Santos",
        cargo: "Especialista em Cortes Clássicos",
        especialidade: "Pompadour, Tesoura Clássica & Linhas Retrô",
        experiencia: "10 anos exp.",
        avaliacao: "5.0 (410)",
        foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
        badge: "Clássico"
    }
];

const servicosData = [
    {
        id: 1,
        nome: "Combo VIP Nicolas Galvan",
        categoria: "combos",
        preco: "85.00",
        duracao: "65 min",
        destaque: true,
        descricao: "A experiência completa e definitiva: corte personalizado, barboterapia profunda com toalha aromatizada e sobrancelha alinhada na navalha."
    },
    {
        id: 2,
        nome: "Corte Signature Fade / Degradê",
        categoria: "cabelo",
        preco: "50.00",
        duracao: "40 min",
        destaque: false,
        descricao: "Fade preciso, degradê navalhado, militar ou tesoura com lavagem energizante e finalização de alta fixação."
    },
    {
        id: 3,
        nome: "Barboterapia Premium com Toalha Quente",
        categoria: "barba",
        preco: "45.00",
        duracao: "35 min",
        destaque: false,
        descricao: "Design milimétrico com navalha esterilizada, toalha quente com óleos essenciais e hidratação facial anti-irritação."
    },
    {
        id: 4,
        nome: "Pigmentação de Barba & Cabelo",
        categoria: "coloracao",
        preco: "40.00",
        duracao: "30 min",
        destaque: false,
        descricao: "Camuflagem de fios brancos e definição impecável dos contornos com tintura antialérgica de longa fixação."
    },
    {
        id: 5,
        nome: "Terapia Capilar & Hidratação Ozonizada",
        categoria: "tratamentos",
        preco: "55.00",
        duracao: "35 min",
        destaque: false,
        descricao: "Tratamento profundo com máscara reconstrutora, massagem no couro cabeludo e proteção térmica."
    },
    {
        id: 6,
        nome: "Corte Infantil Kids (Até 12 anos)",
        categoria: "cabelo",
        preco: "42.00",
        duracao: "30 min",
        destaque: false,
        descricao: "Atendimento acolhedor e com total paciência para as crianças, com videogame à vontade e guloseimas inclusas."
    }
];

// Agendamentos iniciais para demonstração
const agendamentos = [
    {
        id: 1,
        codigo: "NG-9142",
        cliente: "Matheus Oliveira",
        telefone: "(11) 98711-2233",
        email: "matheus@email.com",
        servico: "Combo VIP Nicolas Galvan",
        barbeiro: "Nicolas Galvan",
        data: "10/11/2026",
        hora: "10:30",
        valor: "R$ 85,00",
        observacoes: "Degradê navalhado alto",
        status: "Confirmado",
        criadoEm: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: 2,
        codigo: "NG-7451",
        cliente: "Felipe Andrade",
        telefone: "(11) 99122-3344",
        email: "felipe@email.com",
        servico: "Corte Signature Fade / Degradê",
        barbeiro: "Lucas Albuquerque",
        data: "10/11/2026",
        hora: "13:45",
        valor: "R$ 50,00",
        observacoes: "Corte texturizado com risco lateral",
        status: "Concluído",
        criadoEm: new Date(Date.now() - 7200000).toISOString()
    },
    {
        id: 3,
        codigo: "NG-5820",
        cliente: "Gabriel Martins",
        telefone: "(11) 97433-4455",
        email: "gabriel@email.com",
        servico: "Barboterapia Premium com Toalha Quente",
        barbeiro: "Rafael Mendes",
        data: "10/11/2026",
        hora: "16:00",
        valor: "R$ 45,00",
        observacoes: "Pele sensível no pescoço",
        status: "Confirmado",
        criadoEm: new Date(Date.now() - 1800000).toISOString()
    }
];

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

// Listar barbeiros
app.get("/api/barbeiros", async (req, res) => {
    try {
        const dbRes = await pool.query("SELECT * FROM barbeiros WHERE ativo = true ORDER BY id ASC");
        if (dbRes.rows && dbRes.rows.length > 0) {
            return res.json({ sucesso: true, barbeiros: dbRes.rows });
        }
    } catch (e) {
        // Fallback em memória
    }
    res.json({ sucesso: true, barbeiros: barbeirosData });
});

// Listar serviços
app.get("/api/servicos", async (req, res) => {
    try {
        const dbRes = await pool.query("SELECT * FROM servicos WHERE ativo = true ORDER BY id ASC");
        if (dbRes.rows && dbRes.rows.length > 0) {
            return res.json({ sucesso: true, servicos: dbRes.rows });
        }
    } catch (e) {
        // Fallback em memória
    }
    res.json({ sucesso: true, servicos: servicosData });
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

        // Gravação assíncrona no PostgreSQL se disponível
        try {
            await pool.query(
                `INSERT INTO agendamentos (codigo, cliente, telefone, email, servico, barbeiro, data, hora, valor, observacoes, status) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
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

// Listar agendamentos
app.get("/api/agendamentos", async (req, res) => {
    try {
        try {
            const dbRes = await pool.query("SELECT * FROM agendamentos ORDER BY id DESC");
            if (dbRes.rows && dbRes.rows.length > 0) {
                return res.json({ sucesso: true, agendamentos: dbRes.rows });
            }
        } catch (e) {
            // Fallback para agendamentos em memória
        }
        res.json({ sucesso: true, agendamentos });
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

        const item = agendamentos.find(a => a.codigo === codigo);
        if (item) {
            item.status = status;
        }

        try {
            await pool.query("UPDATE agendamentos SET status = $1 WHERE codigo = $2", [status, codigo]);
        } catch (dbError) {}

        return res.json({ sucesso: true, mensagem: `Status atualizado para "${status}"`, agendamento: item });
    } catch (error) {
        return res.status(500).json({ sucesso: false, erro: error.message });
    }
});

// Remover/cancelar agendamento
app.delete("/api/agendamentos/:codigo", async (req, res) => {
    try {
        const { codigo } = req.params;
        const index = agendamentos.findIndex(a => a.codigo === codigo);
        if (index !== -1) {
            agendamentos.splice(index, 1);
        }

        try {
            await pool.query("DELETE FROM agendamentos WHERE codigo = $1", [codigo]);
        } catch (dbError) {}

        return res.json({ sucesso: true, mensagem: `Agendamento ${codigo} removido com sucesso.` });
    } catch (error) {
        return res.status(500).json({ sucesso: false, erro: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`💈 Nicolas Galvan Barber Studio online em http://localhost:${PORT}`);
});
