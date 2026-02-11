// RestDB.io Configuration
const RESTDB_CONFIG = {
  apiKey: '6989b725bf4bcc5a3a53e48f',
  databaseUrl: 'https://raenne-bb06.restdb.io/rest/contact',
};

const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const messageDiv = document.getElementById('message');

// Hardcoded credentials
const HARDCODED_CREDENTIALS = {
  username: 'raenne',
  password: 'raenne123!'
};

// Show message function
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = 'block';
}

// Hide message function
function hideMessage() {
  messageDiv.style.display = 'none';
}

// Login function using RestDB.io
async function login(email, password) {
  try {
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    hideMessage();

    // First check hardcoded credentials
    if (email === HARDCODED_CREDENTIALS.username && password === HARDCODED_CREDENTIALS.password) {
      showMessage('Login successful! Redirecting...', 'success');

      // Store user info in sessionStorage
      sessionStorage.setItem('user', JSON.stringify({
        username: email
      }));

      // Redirect to main page after 1 second
      setTimeout(() => {
        window.location.href = 'mainpage.html';
      }, 1000);
      return;
    }

    // If not hardcoded credentials, query RestDB.io for user with matching email/username
    const response = await fetch(`${RESTDB_CONFIG.databaseUrl}?q={"Username":"${email}"}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-apikey': RESTDB_CONFIG.apiKey,
        'cache-control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const users = await response.json();

    // Check if user exists
    if (users.length === 0) {
      showMessage('Invalid username or password', 'error');
      return;
    }

    const user = users[0];

    // In production, you should use hashed passwords and compare them securely
    // This is a simplified example - NEVER store plain text passwords
    if (user.Password === password) {
      showMessage('Login successful! Redirecting...', 'success');

      // Store user info in sessionStorage
      sessionStorage.setItem('user', JSON.stringify({
        id: user._id,
        username: user.Username
      }));

      // Redirect to main page after 1 second
      setTimeout(() => {
        window.location.href = 'mainpage.html';
      }, 1000);
    } else {
      showMessage('Invalid username or password', 'error');
    }

  } catch (error) {
    console.error('Login error:', error);
    showMessage('An error occurred. Please try again.', 'error');
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Log In';
  }
}

// Form submit handler
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showMessage('Please enter both username and password', 'error');
    return;
  }

  await login(email, password);
});

// Forgot password handler (you can customize this)
document.getElementById('forgotPassword').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Password reset functionality would go here. You can implement this using RestDB.io email features.');
});
