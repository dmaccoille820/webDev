const createTaskForm = document.getElementById("createTaskForm");
const taskList = document.getElementById("taskList");
const userName = document.getElementById("userName");

async function createTask(taskData) {
  try {
    const response = await fetch("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    if (response.ok) {
      const data = await response.json();
      loadTasks();
    } else {
      const data = await response.json();
    }
  } catch (error) {
    console.error("Error creating task:", error);
  }
}

async function getTasks() {
  try {
    const sessionId = getCookie("sessionId");
    const response = await fetch("/tasks", {
      headers: {
        "sessionId": sessionId,
      },
    });
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

async function updateTask(taskId, taskData) {
  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (response.ok) {
      loadTasks();
    }
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

async function deleteTask(taskId) {
  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      loadTasks(); // Reload tasks after successful deletion
    } else {
      console.error("Failed to delete task");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

function displayUpdateForm(task) {
  const taskElement = document.getElementById(`task-${task.taskId}`);
  const updateForm = document.createElement("form");
  updateForm.className = "update-form";

  // Create and append input fields
  const inputFields = [
    { name: "taskName", value: task.taskName, label: "Task Name" },
    { name: "taskDescription", value: task.taskDescription, label: "Task Description" },
    { name: "taskDueDate", value: task.taskDueDate, label: "Due Date", type: "date" },
    { name: "taskPriority", value: task.taskPriority, label: "Priority" },
    { name: "taskStatus", value: task.taskStatus, label: "Status" },
  ];

  inputFields.forEach(field => {
    const input = document.createElement("input");
    input.type = field.type || "text";
    input.name = field.name;
    input.value = field.value;
    input.placeholder = field.label;
    updateForm.appendChild(input);
  });
  
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Update Task";
  submitButton.className = 'update-submit';
  updateForm.appendChild(submitButton);

  updateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateTask(task.taskId, Object.fromEntries(new FormData(updateForm)));
  });
  taskElement.appendChild(updateForm);
}
async function fetchUserData() {
  const sessionId = getCookie("sessionId");

  try {
    const response = await fetch("/api/user-data", {
      headers: {
        sessionId: sessionId,
      }
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    try {
      const data = await response.json();
      userName.textContent = data.name;
      // Now we have more data
      console.log("User data:", data);
    } catch (parseError) {
      console.error("Error parsing user data:", parseError);
    }
  
  } catch (error) {
    console.error("Error getting user data", error);
  } 
}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

// Add event listener to the form
createTaskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const taskName = document.getElementById("taskName").value;
  const taskDescription = document.getElementById("taskDescription").value;
  const taskDueDate = document.getElementById("taskDueDate").value;
  const taskPriority = document.getElementById("taskPriority").value;
  const taskStatus = document.getElementById("taskStatus").value;

  await createTask({
    taskName,
    taskDescription,
    taskDueDate,
    taskPriority,
    taskStatus,
  });
});

async function loadTasks() {
  const tasks = await getTasks();

  taskList.innerHTML = ""; // Clear previous tasks

  // Append each task to the task list
  tasks.forEach((task) => {
    const taskElement = document.createElement("li");
    taskElement.id = `task-${task.taskId}`; // Add id to task element
    taskElement.textContent = `${task.taskName} - ${task.taskDescription} - ${task.taskDueDate} - ${task.taskPriority} - ${task.taskStatus}`;
    
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.className = 'update-btn';
    updateButton.id = `update-${task.taskId}`;
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-btn';
    deleteButton.id = `delete-${task.taskId}`;

    updateButton.addEventListener("click", () => {
      displayUpdateForm(task);
    });

    // Add event listener to delete button
    deleteButton.addEventListener("click", () => {
      deleteTask(task.taskId);
    });  
    

    taskElement.appendChild(updateButton);
    taskElement.appendChild(deleteButton);
    taskList.appendChild(taskElement);
  });
}

async function handleLogout() {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      window.location.href = "/"; // Redirect to login page
    } else {
      const errorData = await response.json();
      console.error("Logout failed:", errorData.message);
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
}

//Logout function
document.getElementById("logoutBtn").addEventListener("click", handleLogout);

//Fetch user data
fetchUserData();
