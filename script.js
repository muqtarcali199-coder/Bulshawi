let tasks = [];

// Load tasks from localStorage
if(localStorage.getItem("tasks")) tasks = JSON.parse(localStorage.getItem("tasks"));

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add Task
function addTask() {
  const name = document.getElementById("taskName").value;
  const due = document.getElementById("taskDue").value;
  const priority = document.getElementById("taskPriority").value;
  const notes = document.getElementById("taskNotes").value;

  if(!name || !due) { alert("Enter task name and due date!"); return; }

  tasks.push({name,due,priority,notes,done:false});
  saveTasks();
  clearInputs();
  renderTasks();
}

// Clear input fields
function clearInputs() {
  document.getElementById("taskName").value = "";
  document.getElementById("taskDue").value = "";
  document.getElementById("taskPriority").value = "Medium";
  document.getElementById("taskNotes").value = "";
}

// Render Tasks
function renderTasks() {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  // Sort: Pending > Done, High > Medium > Low, Earliest Due first
  tasks.sort((a,b) => {
    if(a.done !== b.done) return a.done ? 1 : -1;
    const prio = {"High":1,"Medium":2,"Low":3};
    if(a.priority!==b.priority) return prio[a.priority]-prio[b.priority];
    return new Date(a.due)-new Date(b.due);
  });

  tasks.forEach((task,index)=>{
    const card = document.createElement("div");
    card.className = "card " + (task.done?"done":"");

    card.innerHTML = `
      <h3>${task.name}</h3>
      <div class="priority ${task.priority.toLowerCase()}">${task.priority}</div>
      <div>Due: ${task.due}</div>
      <div class="status" onclick="toggleDone(${index})">${task.done?"Done":"Pending"}</div>
      <div class="notes">${task.notes}</div>
      <div class="actions">
        <button class="done-btn" onclick="toggleDone(${index})">${task.done?"Undo":"Done"}</button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Toggle Done
function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

// Delete Task
function deleteTask(index) {
  if(confirm("Are you sure?")) {
    tasks.splice(index,1);
    saveTasks();
    renderTasks();
  }
}

// Initial render
renderTasks();
