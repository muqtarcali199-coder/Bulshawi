let tasks = [];

// Load tasks from localStorage if any
if(localStorage.getItem("tasks")) tasks = JSON.parse(localStorage.getItem("tasks"));

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a new task
function addTask() {
  const name = document.getElementById("taskName").value;
  const due = document.getElementById("taskDue").value;
  const status = document.getElementById("taskStatus").value;
  const notes = document.getElementById("taskNotes").value;

  if(!name || !due) { 
    alert("Please enter task name and due date!"); 
    return; 
  }

  tasks.push({name, due, status, notes});
  saveTasks();
  clearInputs();
  renderTasks();
}

// Clear input fields
function clearInputs() {
  document.getElementById("taskName").value = "";
  document.getElementById("taskDue").value = "";
  document.getElementById("taskStatus").value = "Pending";
  document.getElementById("taskNotes").value = "";
}

// Render all tasks
function renderTasks() {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  tasks.forEach((task, index) => {
    const card = document.createElement("div");
    card.className = "card " + task.status.toLowerCase().replace(" ", "-");

    card.innerHTML = `
      <h3>${task.name}</h3>
      <p>Status: ${task.status}</p>
      <p>Deadline: ${task.due}</p>
      <p>${task.notes}</p>
      <button onclick="deleteTask(${index})">Delete</button>
    `;
    container.appendChild(card);
  });
}

// Delete task
function deleteTask(index) {
  if(confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index,1);
    saveTasks();
    renderTasks();
  }
}

// Initial render
renderTasks();
