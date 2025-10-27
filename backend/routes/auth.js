import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";


const router = express.Router();
const SECRET = "mysecretkey";


// REGISTER (one-time admin create)
router.post("/register", async (req, res) => {
  const { Employeeemail, Password, Created_by } = req.body;
  const hashed = await bcrypt.hash(Password, 10);

  db.query(
    "INSERT INTO EmployeeList (Employeeemail, Password, Created_by) VALUES (?,?,?)",
    [Employeeemail, hashed, Created_by],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "User registered successfully" });
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { Employeeemail, Password } = req.body;

  db.query(
    "SELECT * FROM EmployeeList WHERE Employeeemail=?",
    [Employeeemail],
    async (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.length === 0)
        return res.status(401).json({ message: "User not found" });

      const user = result[0];
      const isMatch = await bcrypt.compare(Password, user.Password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid password" });

      const token = jwt.sign(
        { Employeeid: user.Employeeid, email: user.Employeeemail },
        SECRET
      );
      res.json({ token });
    }
  );
});

export default router;
