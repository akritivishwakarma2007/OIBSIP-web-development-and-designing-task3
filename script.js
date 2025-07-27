const taskInput = document.getElementById("taskInput");
const deadlineInput = document.getElementById("deadlineInput");
const prioritySelect = document.getElementById("prioritySelect");
const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");

const priorityTag = document.getElementById("priorityTag");
const deadlineTag = document.getElementById("deadlineTag");

// Show live priority tag
prioritySelect.addEventListener("change", () => {
  const value = prioritySelect.value;
  priorityTag.textContent = `Priority: ${value}`;
  priorityTag.className = `tag priority ${value.toLowerCase()}`;
});

// Show live deadline tag
deadlineInput.addEventListener("change", () => {
  if (deadlineInput.value) {
    const formatted = new Date(deadlineInput.value).toLocaleString();
    deadlineTag.textContent = `Deadline: ${formatted}`;
  } else {
    deadlineTag.textContent = `No deadline selected`;
  }
});

function saveToLocalStorage() {
  const pendingTasks = [...pendingList.children].map(li => ({
    text: li.querySelector("span").textContent,
    priority: li.dataset.priority,
    time: li.dataset.time,
    deadline: li.dataset.deadline
  }));
  const completedTasks = [...completedList.children].map(li => ({
    text: li.querySelector("span").textContent,
    priority: li.dataset.priority,
    time: li.dataset.time,
    deadline: li.dataset.deadline
  }));
  localStorage.setItem("pendingTasks", JSON.stringify(pendingTasks));
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
}

function createTaskElement(text, time, priority, deadline, isCompleted) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.priority = priority;
  li.dataset.time = time;
  li.dataset.deadline = deadline;

  const span = document.createElement("span");
  span.textContent = text;

  const priorityTag = document.createElement("small");
  priorityTag.textContent = `Priority: ${priority}`;
  priorityTag.style.color = priority === "High" ? "red" : priority === "Medium" ? "#e67e22" : "green";

  const date = document.createElement("div");
  date.className = "date";
  date.innerHTML = isCompleted 
    ? `✅ Completed: ${time}` 
    : `🕒 Created: ${time}`;

  const deadlineDiv = document.createElement("div");
  deadlineDiv.className = "date";
  if (deadline) deadlineDiv.innerHTML = `⏰ Deadline: ${new Date(deadline).toLocaleString()}`;

  const actionDiv = document.createElement("div");
  actionDiv.className = "actions";

  const completeBtn = document.createElement("button");
  completeBtn.textContent = isCompleted ? "↩️ Move Back" : "✔️ Complete";
  completeBtn.onclick = () => {
    li.remove();
    const newTime = new Date().toLocaleString();
    const newElement = createTaskElement(text, newTime, priority, deadline, !isCompleted);
    (isCompleted ? pendingList : completedList).appendChild(newElement);
    saveToLocalStorage();
  };

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️ Edit";
  editBtn.onclick = () => {
    const newText = prompt("Edit your task:", text);
    if (newText && newText.trim() !== "") {
      span.textContent = newText.trim();
      saveToLocalStorage();
    }
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️ Delete";
  deleteBtn.onclick = () => {
    li.remove();
    saveToLocalStorage();
  };

  actionDiv.appendChild(completeBtn);
  actionDiv.appendChild(editBtn);
  actionDiv.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(priorityTag);
  li.appendChild(date);
  if (deadline) li.appendChild(deadlineDiv);
  li.appendChild(actionDiv);

  return li;
}

function addTask() {
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;
  const deadline = deadlineInput.value;
  if (text === "") return;

  const time = new Date().toLocaleString();
  const li = createTaskElement(text, time, priority, deadline, false);
  pendingList.appendChild(li);

  taskInput.value = "";
  deadlineInput.value = "";
  deadlineTag.textContent = "No deadline selected";
  saveToLocalStorage();
}

window.onload = () => {
  const savedPending = JSON.parse(localStorage.getItem("pendingTasks")) || [];
  const savedCompleted = JSON.parse(localStorage.getItem("completedTasks")) || [];

  savedPending.forEach(task =>
    pendingList.appendChild(createTaskElement(task.text, task.time, task.priority, task.deadline, false))
  );
  savedCompleted.forEach(task =>
    completedList.appendChild(createTaskElement(task.text, task.time, task.priority, task.deadline, true))
  );
};
