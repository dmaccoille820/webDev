function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  console.log(`Cookie parts for ${name}:`, parts); // Add this line
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null; // Add a default return value
}

async function fetchProjects() {
  const sessionId = getCookie('sessionId'); // Ensure cookie name matches what is set on the server
  console.log("fetchProjects - sessionId:", sessionId);
  
  if (!sessionId) {
    console.error('Session ID is missing.');
    window.location.href = '/'; // Redirect to login if sessionId is missing
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionId}` // Pass the sessionId in the headers
  };
  
  try {
    const response = await fetch('/api/dashboard', { headers: headers });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/';
      } else {
        throw new Error('Network response was not ok');
      }
    }

    const projects = await response.json();
    console.log("Projects:", projects);
    displayProjects(projects);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

fetchProjects();