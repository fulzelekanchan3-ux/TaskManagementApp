const API = "http://localhost:5000/api/tasks";
const token = localStorage.getItem("token");

// Redirect if not logged in
if (!token) {
  window.location.href = "login.html";
}

// 🔥 NEW: Render function
function renderTasks(data) {
  const list = document.getElementById("taskList");
  const empty = document.getElementById("emptyState");

  list.innerHTML = "";

  if (data.length === 0) {
    empty.style.display = "block";
    return;
  } else {
    empty.style.display = "none";
  }

  data.forEach(task => {
    const div = document.createElement("div");
    div.className = "task";

    div.innerHTML = `
      <span>${task.title}</span>
      <button onclick="deleteTask('${task._id}')">Delete</button>
    `;

    list.appendChild(div);
  });
}

// 🔄 GET TASKS
async function getTasks() {
  try {
    const res = await fetch(API, {
      headers: { Authorization: token }
    });

    const data = await res.json();
    renderTasks(data);

  } catch (err) {
    console.log("Error fetching tasks:", err);
  }
}

// ➕ ADD TASK
async function addTask() {
  const input = document.getElementById("taskInput");
  const title = input.value.trim();

  if (!title) return alert("Enter task!");

  try {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ title })
    });

    input.value = ""; // ✅ clear input
    getTasks();

  } catch (err) {
    console.log("Error adding task:", err);
  }
}

// ❌ DELETE TASK
async function deleteTask(id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });

    getTasks();

  } catch (err) {
    console.log("Error deleting task:", err);
  }
}

// 🚪 LOGOUT
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// Load tasks on page load
getTasks();