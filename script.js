let tasks = [];

// Load saved tasks
if(localStorage.getItem("tasks")) tasks = JSON.parse(localStorage.getItem("tasks"));

const addBtn = document.getElementById("addBtn");
const saveBtn = document.getElementById("saveBtn");

// Add task (temporary until saved)
addBtn.addEventListener("click", () => {
  const name = document.getElementById("taskName").value;
  const due = document.getElementById("taskDue").value;
  const priority = document.getElementById("taskPriority").value;
  const notes = document.getElementById("taskNotes").value;

  if(!name || !due) return alert("Please enter task name and due date!");

  tasks.push({name,due,priority,notes,completed:false});
  clearInputs();
  renderTasks();
});

// Save all tasks to localStorage
saveBtn.addEventListener("click", () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  alert("Tasks saved!");
});

// Clear input fields
function clearInputs() {
  document.getElementById("taskName").value = "";
  document.getElementById("taskDue").value = "";
  document.getElementById("taskPriority").value = "Medium";
  document.getElementById("taskNotes").value = "";
}

// Render tasks
function renderTasks() {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  tasks.forEach((task,index) => {
    const card = document.createElement("div");
    card.className = `card ${task.priority.toLowerCase()} ${task.completed ? "completed" : ""}`;
    
    card.innerHTML = `
      <h3>${task.name}</h3>
      <p>Due: ${task.due}</p>
      <p>Priority: ${task.priority}</p>
      <p>${task.notes}</p>
      <button onclick="toggleDone(${index})">${task.completed ? "Undo" : "Mark Done"}</button>
      <button onclick="deleteTask(${index})">Delete</button>
    `;

    container.appendChild(card);
  });
}

// Toggle completed status
function toggleDone(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

// Delete task
function deleteTask(index) {
  if(confirm("Are you sure you want to delete this task?")){
    tasks.splice(index,1);
    renderTasks();
  }
}

// Initial render
renderTasks();
