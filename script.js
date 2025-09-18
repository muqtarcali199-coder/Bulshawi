let tasks = [];
if(localStorage.getItem("tasks")) tasks = JSON.parse(localStorage.getItem("tasks"));

const addBtn = document.getElementById("addBtn");
const saveBtn = document.getElementById("saveBtn");

// Add Task
addBtn.addEventListener("click", ()=>{
  const name = document.getElementById("taskName").value;
  const due = document.getElementById("taskDue").value;
  const priority = document.getElementById("taskPriority").value;
  const notes = document.getElementById("taskNotes").value;

  if(!name || !due) return alert("Enter task name and due date!");

  tasks.push({name,due,priority,notes,completed:false});
  clearInputs();
  renderTasks();
});

// Save Tasks manually
saveBtn.addEventListener("click", ()=>{
  localStorage.setItem("tasks", JSON.stringify(tasks));
  alert("Tasks saved!");
});

// Clear inputs
function clearInputs(){
  document.getElementById("taskName").value="";
  document.getElementById("taskDue").value="";
  document.getElementById("taskPriority").value="Medium";
  document.getElementById("taskNotes").value="";
}

// Render tasks
function renderTasks(){
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  tasks.forEach((task,index)=>{
    const card = document.createElement("div");
    card.className = `card ${task.priority.toLowerCase()} ${task.completed?"completed":""}`;
    card.innerHTML = `
      <h3>${task.name}</h3>
      <p><i class="fas fa-calendar-alt"></i> Due: ${task.due}</p>
      <p><i class="fas fa-flag"></i> Priority: ${task.priority}</p>
      <p>${task.notes}</p>
      <button onclick="toggleDone(${index})">${task.completed?"Undo":"Mark Done"}</button>
      <button onclick="deleteTask(${index})"><i class="fas fa-trash"></i></button>
    `;
    container.appendChild(card);
  });
}

// Toggle Done/Undo
function toggleDone(index){
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

// Delete task
function deleteTask(index){
  if(confirm("Delete this task?")){
    tasks.splice(index,1);
    renderTasks();
  }
}

// Initial render
renderTasks();
