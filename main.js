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

//[STEP 0]: Make sure our document is A-OK
document.addEventListener("DOMContentLoaded", function () {
  // What kind of interface we want at the start 
  const APIKEY = "698d4bf2bf4bcc26dd53e4d5";
  getContacts();
  document.getElementById("update-contact-container").style.display = "none";
  document.getElementById("add-update-msg").style.display = "none";

  //[STEP 1]: Create our submit form listener
  document.getElementById("contact-submit").addEventListener("click", function (e) {
    // Prevent default action of the button 
    e.preventDefault();

    //[STEP 2]: Let's retrieve form data
    let contactName = document.getElementById("contact-name").value;
    let contactEmail = document.getElementById("contact-email").value;
    let birthday = document.getElementById("contact-birthday").value;
    let phoneNumber = document.getElementById("contact-phone").value;
    let password = document.getElementById("contact-password").value;
    let confirmPassword = document.getElementById("contact-confirm-password").value;

    // Validate passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    //[STEP 3]: Get form values when the user clicks on send
    let jsondata = {
      "name": contactName,
      "email": contactEmail,
      "birthday": birthday,
      "phone": phoneNumber,
      "password": password
    };

    console.log("Sending data:", jsondata); // DEBUG

    //[STEP 4]: Create our AJAX settings
    let settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(jsondata),
    }

    //[STEP 5]: Send our AJAX request over to the DB
    document.getElementById("contact-submit").disabled = true;
    
    fetch("https://raennelogin-c2b4.restdb.io/rest/sign-up", settings)
      .then(response => {
        console.log("Response status:", response.status); // DEBUG
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
  console.log("Success! Data saved:", data);
  // Redirect immediately to new arrivals page
  window.location.href = "Newarrival.html";
})
      })
      .catch(error => {
        console.error('Error details:', error); // DEBUG
        alert("Error saving data: " + error.message);
        document.getElementById("contact-submit").disabled = false;
      });
  });//end click 


  //[STEP 6]
  // Function to retrieve all contacts
  function getContacts(limit = 100, all = true) {

    //[STEP 7]: Create our AJAX settings
    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      },
    }

    //[STEP 8]: Make our AJAX calls
    fetch("https://raennelogin-c2b4.restdb.io/rest/sign-up", settings)
      .then(response => {
        console.log("GET Response status:", response.status); // DEBUG
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(response => {
        console.log("Retrieved contacts:", response); // DEBUG
        let content = "";

        for (var i = 0; i < response.length && i < limit; i++) {
          content = `${content}<tr id='${response[i]._id}'>
          <td>${response[i].name || 'N/A'}</td>
          <td>${response[i].email || 'N/A'}</td>
          <td>${response[i].birthday || 'N/A'}</td>
          <td>${response[i].phone || 'N/A'}</td>
          <td>••••••••</td>
          <td><a href='#' class='delete' data-id='${response[i]._id}'>Del</a></td>
          <td><a href='#update-contact-container' class='update' 
            data-id='${response[i]._id}' 
            data-name='${response[i].name || ''}' 
            data-email='${response[i].email || ''}'
            data-birthday='${response[i].birthday || ''}'
            data-phone='${response[i].phone || ''}'>Update</a></td>
          </tr>`;
        }

        //[STEP 9]: Update our HTML content
        document.getElementById("contact-list").getElementsByTagName("tbody")[0].innerHTML = content;
        document.getElementById("total-contacts").innerHTML = response.length;
      })
      .catch(error => {
        console.error('Error retrieving contacts:', error); // DEBUG
      });
  }

  //[STEP 10]: Create our update listener
  document.getElementById("contact-list").addEventListener("click", function (e) {
    if (e.target.classList.contains("update")) {
      e.preventDefault();
      // Update our update form values
      let contactName = e.target.getAttribute("data-name");
      let contactEmail = e.target.getAttribute("data-email");
      let birthday = e.target.getAttribute("data-birthday");
      let phone = e.target.getAttribute("data-phone");
      let contactId = e.target.getAttribute("data-id");

      //[STEP 11]: Load data into update form
      document.getElementById("update-contact-name").value = contactName;
      document.getElementById("update-contact-email").value = contactEmail;
      document.getElementById("update-contact-birthday").value = birthday;
      document.getElementById("update-contact-phone").value = phone;
      document.getElementById("update-contact-id").value = contactId;
      document.getElementById("update-contact-container").style.display = "block";
    }
    if (e.target.classList.contains("delete")) {
      e.preventDefault();
      let contactId = e.target.getAttribute("data-id");
      console.log("Deleting contact:", contactId); // DEBUG
      if (confirm("Are you sure you want to delete this contact?")) {
        deleteRecord(contactId);
      }
    }
  });//end contact-list listener

  //[STEP 12]: Update form listener
  document.getElementById("update-contact-submit").addEventListener("click", function (e) {
    e.preventDefault();
    // Retrieve all update form values
    let contactName = document.getElementById("update-contact-name").value;
    let contactEmail = document.getElementById("update-contact-email").value;
    let birthday = document.getElementById("update-contact-birthday").value;
    let phone = document.getElementById("update-contact-phone").value;
    let contactId = document.getElementById("update-contact-id").value;
    let password = document.getElementById("update-contact-password").value;
    let confirmPassword = document.getElementById("update-contact-confirm-password").value;

    // Only validate passwords if they're being updated
    if (password && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    //[STEP 12a]: Call update function
    updateForm(contactId, contactName, contactEmail, birthday, phone, password);
  });//end updatecontactform listener

  //[STEP 13]: Function that makes an AJAX call to UPDATE
  function updateForm(id, contactName, contactEmail, birthday, phone, password) {
    var jsondata = { 
      "name": contactName, 
      "email": contactEmail, 
      "birthday": birthday, 
      "phone": phone
    };
    
    // Only include password if it's being updated
    if (password) {
      jsondata.password = password;
    }

    console.log("Updating contact:", jsondata); // DEBUG

    var settings = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(jsondata)
    }

    //[STEP 13a]: Send AJAX request
    fetch(`https://raennelogin-c2b4.restdb.io/rest/sign-up/${id}`, settings)
      .then(response => {
        console.log("Update response status:", response.status); // DEBUG
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Update successful:", data); // DEBUG
        document.getElementById("update-contact-container").style.display = "none";
        document.getElementById("add-update-msg").style.display = "block";
        document.getElementById("add-update-msg").innerHTML = "Contact updated successfully!";
        setTimeout(function () {
          document.getElementById("add-update-msg").style.display = "none";
        }, 3000);
        // Clear password fields
        if (document.getElementById("update-contact-password")) {
          document.getElementById("update-contact-password").value = "";
        }
        if (document.getElementById("update-contact-confirm-password")) {
          document.getElementById("update-contact-confirm-password").value = "";
        }
        // Update table
        getContacts();
      })
      .catch(error => {
        console.error('Error updating contact:', error); // DEBUG
        alert("Error updating contact: " + error.message);
      });
  }//end updateform function

  function deleteRecord(id) {
    var settings = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      },
    }

    //[STEP 13a]: Send DELETE request
    fetch(`https://raennelogin-c2b4.restdb.io/rest/sign-up/${id}`, settings)
      .then(response => {
        console.log("Delete response status:", response.status); // DEBUG
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Delete successful:", data); // DEBUG
        document.getElementById("add-update-msg").style.display = "block";
        document.getElementById("add-update-msg").innerHTML = "Contact deleted successfully!";
        setTimeout(function () {
          document.getElementById("add-update-msg").style.display = "none";
        }, 3000);
        // Update table
        getContacts();
      })
      .catch(error => {
        console.error('Error deleting contact:', error); // DEBUG
        alert("Error deleting contact: " + error.message);
      });
  }

