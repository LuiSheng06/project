const API = "http://localhost:5001/api";
let editingId = null; // Track editing employee
let employees = []; // Store all employees
let currentPage = 1;
const rowsPerPage = 5;

// ===== LOGIN =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Employeeemail: email, Password: password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location = "dashboard.html";
    } else {
      document.getElementById("msg").innerText = data.message || "Login failed";
    }
  });
}

// ===== DASHBOARD =====
const token = localStorage.getItem("token");

// Load Employee IDs into dropdown
async function loadEmployeeIds() {
  try {
    const res = await fetch(`${API}/employees/ids`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const ids = await res.json();
    const select = document.getElementById("Employeeid");
    if (!select) return;

    select.innerHTML = `<option value="">Select Employee ID</option>`;
    ids.forEach((emp) => {
      select.innerHTML += `<option value="${emp.Employeeid}">${emp.Employeeid} - ${emp.Employeeemail}</option>`;
    });
  } catch (err) {
    console.error("Error loading employee IDs:", err);
  }
}

// Load all employees and show page
async function loadEmployees() {
  try {
    const res = await fetch(`${API}/employees`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    employees = await res.json();
    console.log("Loaded employees:", employees);

    showPage(currentPage);
  } catch (err) {
    console.error("Error loading employees:", err);
  }
}

// Show employees for the current page
function showPage(page) {
  const table = document.getElementById("empTable");
  table.innerHTML = "";

  if (!Array.isArray(employees) || employees.length === 0) {
    table.innerHTML = `<tr><td colspan="8">No data found</td></tr>`;
    return;
  }

  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = employees.slice(start, end);

  pageData.forEach((emp) => {
    table.innerHTML += `
      <tr>
        <td>${emp.EmployeedetailId}</td>
        <td>${emp.First_name}</td>
        <td>${emp.Last_name}</td>
        <td>${emp.Gender}</td>
        <td>${emp.Phonenumber}</td>
        <td>${emp.Emailed}</td>
        <td>${emp.Department}</td>
        <td>
          <button class="edit-btn" onclick="editEmp(${emp.EmployeedetailId})">Edit</button>
          <button class="delete-btn" onclick="deleteEmp(${emp.EmployeedetailId})">Delete</button>
        </td>
      </tr>`;
  });

  // Pagination info
  const pageInfo = document.getElementById("pageInfo");
  if (pageInfo) {
    pageInfo.innerText = `Page ${currentPage} of ${Math.ceil(employees.length / rowsPerPage)}`;
  }

  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = end >= employees.length;
}

// Add or Update Employee
const addForm = document.getElementById("addForm");
if (addForm) {
  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      Employeeid: document.getElementById("Employeeid").value,
      First_name: document.getElementById("First_name").value.trim(),
      Last_name: document.getElementById("Last_name").value.trim(),
      Gender: document.getElementById("Gender").value.trim(),
      Phonenumber: document.getElementById("Phonenumber").value.trim(),
      Emailed: document.getElementById("Emailed").value.trim(),
      Department: document.getElementById("Department").value.trim(),
      Created_by: document.getElementById("Created_by").value.trim(),
    };

    if (!data.Employeeid) {
      alert("Please select an Employee ID.");
      return;
    }

    try {
      let res;
      if (editingId) {
        res = await fetch(`${API}/employees/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(data),
        });
      } else {
        res = await fetch(`${API}/employees`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(data),
        });
      }

      const result = await res.json();
      if (res.ok) {
        alert(result.message || "Operation successful");
        addForm.reset();
        editingId = null;
        document.querySelector("#addForm button").innerText = "Add Employee";
        await loadEmployees();
        showPage(currentPage);
      } else {
        alert(result.error || "Error occurred");
      }
    } catch (err) {
      console.error("Error adding/updating employee:", err);
    }
  });
}

// Edit Employee - fill form
async function editEmp(id) {
  const emp = employees.find((e) => e.EmployeedetailId === id);
  if (!emp) return alert("Employee not found");

  document.getElementById("Employeeid").value = emp.Employeeid;
  document.getElementById("First_name").value = emp.First_name;
  document.getElementById("Last_name").value = emp.Last_name;
  document.getElementById("Gender").value = emp.Gender;
  document.getElementById("Phonenumber").value = emp.Phonenumber;
  document.getElementById("Emailed").value = emp.Emailed;
  document.getElementById("Department").value = emp.Department;
  document.getElementById("Created_by").value = emp.Created_by;

  editingId = emp.EmployeedetailId;
  document.querySelector("#addForm button").innerText = "Update Employee";
}

// Delete Employee
async function deleteEmp(id) {
  if (!confirm("Are you sure you want to delete this record?")) return;

  try {
    const res = await fetch(`${API}/employees/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    alert(result.message);

    // Adjust page if last item on page deleted
    const index = employees.findIndex((e) => e.EmployeedetailId === id);
    if (index !== -1) employees.splice(index, 1);
    const maxPage = Math.ceil(employees.length / rowsPerPage);
    if (currentPage > maxPage) currentPage = maxPage;

    showPage(currentPage);
  } catch (err) {
    console.error("Delete error:", err);
  }
}

// Logout
function logout() {
  localStorage.removeItem("token");
  window.location = "index.html";
}

// Pagination buttons
document.getElementById("prevBtn")?.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    showPage(currentPage);
  }
});

document.getElementById("nextBtn")?.addEventListener("click", () => {
  if ((currentPage * rowsPerPage) < employees.length) {
    currentPage++;
    showPage(currentPage);
  }
});

// Initialize dashboard
if (window.location.pathname.endsWith("dashboard.html")) {
  loadEmployeeIds();
  loadEmployees();
}
