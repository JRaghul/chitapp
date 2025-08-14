// db.js
const { Client } = require('pg');

const con = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Raghul@22",
    database: "chit" // ✅ make sure 'chit' DB exists and has required tables
});

con.connect()
    .then(() => console.log("✅ Database connected"))
    .catch(err => console.error("❌ DB connection error:", err));

module.exports = con; // ✅ export the connection instance
