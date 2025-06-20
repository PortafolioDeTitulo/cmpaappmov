require('dotenv').config(); // To load .env variables
const sql = require('mssql');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // Use if connecting to Azure SQL
        trustServerCertificate: true // Change to false for production if you have a certificate
    }
};

let pool;

async function connectDB() {
    try {
        pool = await new sql.ConnectionPool(dbConfig).connect();
        console.log('Connected to SQL Server');
        await ensureTableExists(pool);
    } catch (err) {
        console.error('Database Connection Failed:', err);
        // Optional: Retry connection or implement a more robust error handling/exit strategy
        process.exit(1); // Exit if DB connection fails, as it's crucial for the app
    }
}

async function ensureTableExists(poolInstance) {
    try {
        const request = poolInstance.request();
        // Check if the table exists
        const tableCheckQuery = `
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Usuarios' AND xtype='U')
            CREATE TABLE Usuarios (
                id INT PRIMARY KEY IDENTITY(1,1),
                username NVARCHAR(255) UNIQUE NOT NULL,
                password_hash NVARCHAR(255) NOT NULL,
                rol NVARCHAR(50) NOT NULL,
                nombre NVARCHAR(255),
                rut NVARCHAR(50) UNIQUE,
                correo NVARCHAR(255) UNIQUE,
                centro NVARCHAR(255),
                areaDesempeno NVARCHAR(255),
                departamento NVARCHAR(255)
            );
        `;
        await request.query(tableCheckQuery);
        console.log('Usuarios table checked/created successfully.');
    } catch (err) {
        console.error('Error ensuring Usuarios table exists:', err);
        // Depending on the error, you might want to exit or handle it differently
    }
}

connectDB(); // Initialize connection and table check on module load

module.exports = {
    sql,
    getPool: () => {
        if (!pool) {
            // This case should ideally not happen if connectDB is called on startup
            // and exits on failure. However, as a safeguard:
            console.error("Connection pool not initialized. Ensure connectDB() was called and succeeded.");
            throw new Error("Connection pool not available.");
        }
        return pool;
    }
};
