//////////////////////////////
// General Functions //
/////////////////////////////

// Function to display errors
function displayError(message) {
  const errorContainer = document.getElementById('error-container');
  errorContainer.textContent = message;
  errorContainer.style.color = 'red';
}

// Function to clear errors
function clearError() {
  const errorContainer = document.getElementById('error-container');
  errorContainer.textContent = '';
}

/////////////////////////////////////
// Fetch Data and Display Projects //
////////////////////////////////////

async function fetchUserInfo() {
try {
  const response = await fetch('/api/user-data');
  if (!response.ok) {
    throw new Error('Network response was not ok.');
  }
  return await response.json();
} catch (error) {
  console.error('Failed to fetch user data:', error);
  return null;
}
}

// Function to fetch and display projects
async function fetchAndDisplayProjects() {
  console.log("fetchAndDisplayProjects called");
  clearError();

  const user = await fetchUserInfo();
  const userId = user?.user_id;

  if (!userId) {
      console.error('User ID is missing. Redirecting to login.');
      displayError('Unauthorized access. Redirecting to login.');
      setTimeout(() => {
          window.location.href = '/';
      }, 2000);
      return;
  }
  try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
          if (response.status === 401) {
              console.error('Unauthorized access. Redirecting to login.');
              displayError('Unauthorized access. Redirecting to login.');
              setTimeout(() => {
                  window.location.href = '/';
              }, 2000);
          } else if (response.status === 403) {
              console.error('Forbidden access. Redirecting to login.');
              displayError('Forbidden access. Redirecting to login.');
              window.location.href = '/';
          } else {
              throw new Error('Network response was not ok');
          }
          return;
      }
      const projects = await response.json();
      console.log("Projects:", projects);
      displayProjects(projects);
  } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      displayError('Failed to load projects. Please try again later.');
  }
}

// Function to display projects in the UI
function displayProjects(projects) {
  console.log("displayProjects called with projects:", projects);
  const cardContainer = document.querySelector('.card-container');

  if (!projects || !Array.isArray(projects[0])) {
      console.error("displayProjects: Projects data is invalid or not an array.");
      displayError('No projects found.');
      return;
  }

  const projectArray = projects[0]; // Extract the array of projects
  cardContainer.innerHTML = '';

  projectArray.forEach(project => {
      console.log("displayProjects - project:", project);

      const card = document.createElement('div');
      card.classList.add('card');

      const cardContent = document.createElement('div');
      cardContent.classList.add('card-content');

      const cardTitle = document.createElement('h3');
      cardTitle.classList.add('card-title');
      cardTitle.textContent = project.project_name || 'Unnamed Project';
      console.log("displayProjects - project.project_name:", project.project_name);

      const taskDescription = document.createElement('p');
      taskDescription.textContent = project.project_description || 'No description available';
      console.log("displayProjects - project.project_description:", project.project_description);

      const taskCount = document.createElement('p');
      taskCount.textContent = `Task Count: ${project.task_count || 'N/A'}`;
      console.log("displayProjects - project.task_count:", project.task_count);

      const taskCompletion = document.createElement('p');
      taskCompletion.textContent = `Task Completion: ${project.completion_percentage ? (project.completion_percentage * 100).toFixed(2) + '%' : 'N/A'}`;
      console.log("displayProjects - project.completion_percentage:", project.completion_percentage);

      const projectStatus = document.createElement('p');
      projectStatus.textContent = `Project Status: ${project.project_status || 'N/A'}`;
      console.log("displayProjects - project.project_status:", project.project_status);

      const dueDate = document.createElement('p');
      dueDate.textContent = `Due Date: ${project.latest_due_date ? new Date(project.latest_due_date).toLocaleDateString() : 'N/A'}`;

      console.log("displayProjects - project.due_date:", project.latest_due_date);

      const viewButton = document.createElement('button');
      viewButton.classList.add('btn', 'view-btn');
      viewButton.textContent = 'View Tasks';

      cardContent.appendChild(cardTitle);
      cardContent.appendChild(taskDescription);
      cardContent.appendChild(taskCount);
      cardContent.appendChild(taskCompletion);
      cardContent.appendChild(projectStatus);
      cardContent.appendChild(dueDate);
      card.appendChild(cardContent);
      card.appendChild(viewButton);
      cardContainer.appendChild(card);
  });
}


console.log("In dashboards.js");
fetchAndDisplayProjects();
