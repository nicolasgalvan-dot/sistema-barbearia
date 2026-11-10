#  Nicolas Galvan Barber Studio

> Sistema completo e responsivo de agendamento online e gestão para barbearia de alto padrão.
> **Autor & Idealizador:** NICOLAS GALVAN

---

##  Sobre o Projeto

O **Nicolas Galvan Barber Studio** foi desenvolvido com visual moderno em tema dark luxury (obsidian & ouro nobre), projetado para oferecer a melhor experiência ao cliente:
- **Agendamento em tempo real** com geração de código exclusivo (`NG-XXXX`).
-  **Confirmação instantânea por WhatsApp** com comprovante estruturado.
-  **Filtros interativos por categoria de serviço** (Cortes, Barba, Combos VIP, Tratamentos).
-  **Seleção dinâmica de barbeiro e cálculo de valores em tempo real**.
-  **Interface 100% responsiva** adaptada para smartphones, tablets e desktop.
-  **Backend em Node.js (Express)** com suporte a banco de dados PostgreSQL e fallback inteligente em memória.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado na máquina.
- PostgreSQL (opcional; o sistema possui fallback automático em memória caso o banco não esteja rodando).

### 1. Instalação das Dependências
```bash
npm install
```

### 2. Iniciar o Servidor
Modo de produção:
```bash
npm start
```
Modo de desenvolvimento (com recarregamento automático):
```bash
npm run dev
```

O servidor iniciará em:
👉 **http://localhost:3000**

---

## 🗄️ Estrutura do Banco de Dados (PostgreSQL)

O arquivo `db.sql` contém a estrutura completa das tabelas e os dados iniciais:
- **`barbeiros`**: Informações da equipe liderada por Nicolas Galvan.
- **`servicos`**: Catálogo detalhado com valores, durações e categorias.
- **`agendamentos`**: Histórico e status das reservas realizadas.
- **`clientes`**: Cadastro e preferências dos clientes.

Para importar no PostgreSQL:
```bash
psql -U postgres -d sistemabarbearia -f db.sql
```

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/status` | Informações de integridade do sistema |
| `GET` | `/api/barbeiros` | Listagem da equipe de profissionais |
| `GET` | `/api/servicos` | Listagem de serviços e valores |
| `GET` | `/api/agendamentos` | Consulta de agendamentos realizados |
| `POST` | `/api/agendamentos` | Criação de novo agendamento |

---

## 🎨 Identidade Visual & Tecnologias

- **Front-end:** HTML5 Semântico, CSS3 Moderno (Variáveis CSS, Flexbox, Grid), JavaScript ES6+.
- **Tipografia:** Google Fonts (*Outfit* para títulos e *Plus Jakarta Sans* para leitura).
- **Ícones:** Font Awesome 6.5.
- **Back-end:** Node.js, Express, Cors, pg (node-postgres).

---
© 2026 Nicolas Galvan Barber Studio. Todos os direitos reservados.

