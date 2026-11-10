-- =======================================================
-- BANCO DE DADOS: NICOLAS GALVAN BARBER STUDIO
-- Autor: NICOLAS GALVAN
-- =======================================================

CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(30) NOT NULL,
    senha VARCHAR(150),
    cpf VARCHAR(14) UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS barbeiros (
    id SERIAL PRIMARY KEY NOT NULL,
    nome VARCHAR(100) NOT NULL,
    especialidade VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(30),
    experiencia_anos INT DEFAULT 5,
    foto_url TEXT,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS servicos (
    id SERIAL PRIMARY KEY NOT NULL,
    categoria VARCHAR(50) DEFAULT 'Cortes',
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10, 2) NOT NULL,
    duracao_minutos INT NOT NULL,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY NOT NULL,
    codigo VARCHAR(20) UNIQUE,
    cliente VARCHAR(100) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    email VARCHAR(100),
    servico VARCHAR(100) NOT NULL,
    barbeiro VARCHAR(100) NOT NULL,
    data VARCHAR(20) NOT NULL,
    hora VARCHAR(10) NOT NULL,
    valor VARCHAR(20),
    observacoes TEXT,
    status VARCHAR(30) DEFAULT 'Confirmado',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserção da equipe de barbeiros
INSERT INTO barbeiros (nome, especialidade, telefone, experiencia_anos) VALUES 
('Nicolas Galvan', 'Master Barber & Fundador (Visagismo e Fade)', '(11) 99111-2222', 12),
('Rafael Mendes', 'Especialista em Barboterapia & Spa Facial', '(11) 99222-3333', 8),
('Lucas Albuquerque', 'Hair Stylist, Freestyle & Cortes Urbanos', '(11) 99333-4444', 6),
('André Santos', 'Mestre em Cortes Clássicos na Tesoura Britânica', '(11) 99444-5555', 10)
ON CONFLICT DO NOTHING;

-- Inserção do catálogo de serviços
INSERT INTO servicos (categoria, nome, preco, duracao_minutos, descricao) VALUES 
('Combos', 'Combo VIP Nicolas Galvan (Corte + Barba + Sobrancelha)', 85.00, 65, 'A experiência definitiva com direito a corte completo, ritual de toalha quente e alinhamento facial.'),
('Cortes', 'Corte Signature Fade / Degradê', 50.00, 40, 'Corte moderno personalizado com lavagem refrescante e finalização com pomada modeladora.'),
('Barba', 'Barboterapia Premium com Toalha Quente', 45.00, 35, 'Alinhamento na lâmina de precisão, óleo essencial aromático e hidratação profunda com balm.'),
('Coloração', 'Pigmentação de Barba & Cabelo', 40.00, 30, 'Definição das linhas do corte e camuflagem de fios claros ou falhas para um visual marcante.'),
('Tratamentos', 'Terapia Capilar & Hidratação Ozonizada', 55.00, 35, 'Recuperação intensa da fibra capilar, controle de oleosidade e fortalecimento dos fios.'),
('Kids', 'Corte Infantil Kids (Até 12 anos)', 42.00, 30, 'Atendimento paciente e descontraído para as crianças com videogame e brinde exclusivo.')
ON CONFLICT DO NOTHING;
