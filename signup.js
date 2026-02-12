//[STEP 0]: Make sure our document is A-OK
document.addEventListener("DOMContentLoaded", function () {
  const APIKEY = "698d4bf2bf4bcc26dd53e4d5";

  //[STEP 1]: Create our submit form listener
  document.getElementById("contact-submit").addEventListener("click", function (e) {
    e.preventDefault();

    console.log("Signup button clicked!"); // DEBUG

    //[STEP 2]: Let's retrieve form data
    let contactName = document.getElementById("contact-name").value;
    let contactEmail = document.getElementById("contact-email").value;
    let birthday = document.getElementById("contact-birthday").value;
    let phoneNumber = document.getElementById("contact-phone").value;
    let password = document.getElementById("contact-password").value;
    let confirmPassword = document.getElementById("contact-confirm-password").value;

    console.log("Form data:", {contactName, contactEmail, birthday, phoneNumber}); // DEBUG

    // Validate passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Validate all fields are filled
    if (!contactName || !contactEmail || !birthday || !phoneNumber || !password) {
      alert("Please fill in all fields!");
      return;
    }

    // Format birthday for RestDB (dd/mm/yyyy format)
    let birthdayFormatted = birthday.split('-').reverse().join('/');

    //[STEP 3]: Get form values - INCLUDING BOTH PASSWORD FIELDS
    let jsondata = {
      "username": contactName,
      "email": contactEmail,
      "birthday": birthdayFormatted,
      "phone number": parseInt(phoneNumber),
      "password": password,
      "enter password again": confirmPassword  // RestDB requires this field
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

    //[STEP 5]: Send our AJAX request
    document.getElementById("contact-submit").disabled = true;
    
    fetch("https://raennelogin-c2b4.restdb.io/rest/sign-up", settings)
      .then(response => {
        console.log("Response status:", response.status); // DEBUG
        if (!response.ok) {
          return response.json().then(err => {
            console.error("Error response:", err);
            throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(err)}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log("Success! Data saved:", data); // DEBUG
        console.log("Redirecting to Newarrival.html..."); // DEBUG
        // Redirect immediately to new arrivals page
        window.location.href = "Newarrival.html";
      })
      .catch(error => {
        console.error('Error details:', error); // DEBUG
        alert("Error saving data: " + error.message);
        document.getElementById("contact-submit").disabled = false;
      });
  });
});