// document.querySelector("#show-login").addEventListener("click", function(){document.querySelector(".popup").classList.add("active");});
// document.querySelector(".popup .close-btn").addEventListener("click", function(){document.querySelector(".popup").classList.remove("active");});

const emailInput = document.querySelector('#email');

const passwordInput = document.querySelector('#password');

const signInButton = document.querySelector('#signin-btn');


function handleSignIn() {
    // Get the values from the email and password fields
    const email = emailInput.value;
    const password = passwordInput.value;
    console.log('Email:', email, 'Password:', password);

    if (!email.includes('@')) {
        emailErrorElement.textContent = 'Please enter a valid email address';
        return; // Stop execution if email is invalid
    }

    emailErrorElement.textContent = '';

    const userData = {
        email: email,
        password: password
    };
    axios.post('/login', userData)
    .then(response => {
        // Handle success
        console.log('Login successful:', response);
        // You can redirect or perform other actions based on the response
    })
    .catch(error => {
        // Handle error
        console.error('Login error:', error);
    });

}

// Add event listener to the Sign in button
signInButton.addEventListener('click', handleSignIn);