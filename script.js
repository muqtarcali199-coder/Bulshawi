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
const filterSelect = document.getElementById("filterSelect");
filterSelect.addEventListener("change", renderTasks);
// Generate Reports
function generateReport(type) {
  let filtered = [];
  const today = new Date();

  if (type === "daily") {
    filtered = tasks.filter(t => new Date(t.due).toDateString() === today.toDateString());
  }
  else if (type === "weekly") {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // start of week (Sunday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    filtered = tasks.filter(t => {
      const due = new Date(t.due);
      return due >= weekStart && due <= weekEnd;
    });
  }
  else if (type === "monthly") {
    const month = today.getMonth();
    const year = today.getFullYear();
    filtered = tasks.filter(t => {
      const due = new Date(t.due);
      return due.getMonth() === month && due.getFullYear() === year;
    });
  }
  else if (type === "custom") {
    const start = new Date(document.getElementById("startDate").value);
    const end = new Date(document.getElementById("endDate").value);
    if (!start || !end) return alert("Select start and end dates!");

    filtered = tasks.filter(t => {
      const due = new Date(t.due);
      return due >= start && due <= end;
    });
  }

  renderReport(filtered, type);
}

// Render Report Output with overdue detection + summary + notes
function renderReport(list, type) {
  const container = document.getElementById("reportContainer");
  container.innerHTML = `<h3>${type.charAt(0).toUpperCase() + type.slice(1)} Report</h3>`;

  if (list.length === 0) {
    container.innerHTML += `<p>No tasks found for this period.</p>`;
    return;
  }

  const today = new Date();
  let completedCount = 0;
  let pendingCount = 0;
  let overdueCount = 0;

  const ul = document.createElement("ul");

  list.forEach(t => {
    const due = new Date(t.due);
    let status = "";

    if (t.completed) {
      status = "✅ Done";
      completedCount++;
    } else if (due < today) {
      status = "⏰ Overdue! (You didn’t complete this task on time)";
      overdueCount++;
    } else {
      status = "❌ Pending";
      pendingCount++;
    }

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>📌 Task:</strong> ${t.name} <br>
      📝 <em>${t.notes ? t.notes : "No notes added"}</em><br>
      📅 Due: ${t.due} | 
      🚩 Priority: ${t.priority} | 
      ${status}
    `;

    if (due < today && !t.completed) {
      li.classList.add("overdue");
    }

    ul.appendChild(li);
  });

  // 🔹 Add Summary Bar
  const summary = document.createElement("div");
  summary.className = "summary-bar";
  summary.innerHTML = `
    <p><strong>Summary:</strong> 
      ✅ Completed: ${completedCount} | 
      ❌ Pending: ${pendingCount} | 
      ⏰ Overdue: ${overdueCount}
    </p>
  `;

  container.appendChild(summary);
  container.appendChild(ul);
}




// Render tasks with filtering
function renderTasks(){
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  const filter = filterSelect.value;
  const today = new Date();
  
  // Helper to get week start and end
  function getWeekRange(date) {
    const first = date.getDate() - date.getDay(); 
    const last = first + 6;
    return {
      start: new Date(date.setDate(first)),
      end: new Date(date.setDate(last))
    };
  }

  tasks.forEach((task,index)=>{
    const dueDate = new Date(task.due);
    let show = true;

    if(filter === "daily"){
      show = dueDate.toDateString() === today.toDateString();
    } 
    else if(filter === "weekly"){
      const week = getWeekRange(new Date());
      show = dueDate >= week.start && dueDate <= week.end;
    }
    else if(filter === "monthly"){
      show = (dueDate.getMonth() === today.getMonth() && dueDate.getFullYear() === today.getFullYear());
    }

    if(show){
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
    }
  });
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
