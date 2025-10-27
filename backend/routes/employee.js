import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET = "mysecretkey";

// ======================== Middleware to verify token ========================
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, authData) => {
      if (err) res.sendStatus(403);
      else next();
    });
  } else {
    res.sendStatus(403);
  }
}

// ======================== Get all employees ========================
router.get("/", verifyToken, (req, res) => {
  db.query("SELECT * FROM employeedetails", (err, result) => {
    if (err) {
      console.error("SQL error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// ======================== Add new employee ========================
router.post("/", verifyToken, (req, res) => {
  const {
    Employeeid,
    First_name,
    Last_name,
    Gender,
    Phonenumber,
    Emailed,
    Department,
    Created_by,
  } = req.body;

  if (!Employeeid || !First_name || !Emailed) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  db.query(
    "INSERT INTO employeedetails (Employeeid, First_name, Last_name, Gender, Phonenumber, Emailed, Department, Created_by) VALUES (?,?,?,?,?,?,?,?)",
    [Employeeid, First_name, Last_name, Gender, Phonenumber, Emailed, Department, Created_by],
    (err, result) => {
      if (err) {
        console.error("SQL insert error:", err);
        return res.status(500).json({ error: err.sqlMessage });
      }
      res.json({ message: "Employee added successfully" });
    }
  );
});


// ======================== Delete employee ========================
router.delete("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM employeedetails WHERE EmployeedetailId = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Employee deleted successfully" });
  });
});

// ======================== Update employee ========================
router.put("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { First_name, Last_name, Gender, Phonenumber, Emailed, Department } = req.body;

  db.query(
    "UPDATE employeedetails SET First_name=?, Last_name=?, Gender=?, Phonenumber=?, Emailed=?, Department=? WHERE EmployeedetailId=?",
    [First_name, Last_name, Gender, Phonenumber, Emailed, Department, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Employee updated successfully" });
    }
  );
});

// Fetch all Employee IDs from employeelist
router.get("/ids", verifyToken, (req, res) => {
  db.query("SELECT Employeeid, Employeeemail FROM employeelist", (err, result) => {
    if (err) {
      console.error("Error fetching employee IDs:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

export default router;
