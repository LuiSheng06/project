import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "binayak@123",
  database: "project"
});

db.connect(err => {
  if (err) console.error("Database connection failed", err);
  else console.log("Connected to MySQL Database");
});

export default db;
