// RestDB.io Configuration
const RESTDB_CONFIG = {
  apiKey: '698d4bf2bf4bcc26dd53e4d5',
  databaseUrl: 'https://raennelogin-c2b4.restdb.io/rest/sign-up',
};

const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const messageDiv = document.getElementById('message');

// Hardcoded credentials (optional - for admin access)
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

    console.log("Attempting login for:", email); // DEBUG

    // First check hardcoded credentials
    if (email === HARDCODED_CREDENTIALS.username && password === HARDCODED_CREDENTIALS.password) {
      showMessage('Login successful! Redirecting...', 'success');
      sessionStorage.setItem('user', JSON.stringify({
        username: email
      }));
      setTimeout(() => {
        window.location.href = 'Newarrival.html';
      }, 1000);
      return;
    }

    // Query RestDB.io for user with matching username or email
    const response = await fetch(`${RESTDB_CONFIG.databaseUrl}?q={"$or":[{"username":"${email}"},{"email":"${email}"}]}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-apikey': RESTDB_CONFIG.apiKey,
        'cache-control': 'no-cache'
      }
    });

    console.log("Response status:", response.status); // DEBUG

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const users = await response.json();
    console.log("Found users:", users); // DEBUG

    // Check if user exists
    if (users.length === 0) {
      showMessage('Invalid username or password', 'error');
      return;
    }

    const user = users[0];

    // Check password
    if (user.password === password) {
      showMessage('Login successful! Redirecting...', 'success');

      // Store user info in sessionStorage
      sessionStorage.setItem('user', JSON.stringify({
        id: user._id,
        username: user.username,
        email: user.email
      }));

      // Redirect to main page after 1 second
      setTimeout(() => {
        window.location.href = 'Newarrival.html';
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
if (loginForm) {
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
}

// Forgot password handler
const forgotPasswordLink = document.getElementById('forgotPassword');
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Password reset functionality would go here. Contact support for password reset.');
  });
}