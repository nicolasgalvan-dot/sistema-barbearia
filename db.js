import { Pool } from "pg";

const pool = new Pool({
    database: process.env.DB_NAME || "sistemabarbearia", 
    user: process.env.DB_USER || "postgres", 
    host: process.env.DB_HOST || "localhost", 
    port: parseInt(process.env.DB_PORT || "5432"),
    password: process.env.DB_PASSWORD || "senai"
});

pool.on("error", (err) => {
    console.warn("Aviso PostgreSQL:", err.message);
});

export default pool;
