const Pool = require("pg").Pool;
const dotenv = require("dotenv");

console.log("RANN");
dotenv.config();

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT,
});

module.exports = pool;