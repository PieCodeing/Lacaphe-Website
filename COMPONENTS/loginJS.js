//brings up login screen
//document.querySelector("#show-login").addEventListener("click", function(){document.querySelector(".popup").classList.add("active");});
//const verifyNewAcount = require("./MIDDLEWARE/verifyNewAcount");
document.addEventListener('DOMContentLoaded', (event) => {
    const loginBtn = document.getElementById('signin-btn');
    const signOutButton = document.getElementById('signout-btn');
    const loginModal = document.getElementById('loginModal');
    const reviewForm = document.getElementById('reviewForm');
    const mainPopup = document.querySelector(".popup");
    const createAccountPopup = document.querySelector(".create-popup");

    reviewForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const reviewText = document.getElementById('reviewText').value;
        axios.post('/submit-review', { reviewText: reviewText })
            .then(function (response) {
                console.log('Success:', response.data);
                document.getElementById('reviewText').value = ''; // Clear the form
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    });

    // Hide sign out button and login modal initially
    //signOutButton.style.display = 'none';
    loginModal.style.display = 'none';

    loginBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            const response = await axios.post('/login', { email, password });
            console.log('Login successful:', response.data);
            // Close other pop-ups
            mainPopup.classList.remove("active");
            createAccountPopup.classList.remove("active");
            // Show login modal on successful login
            loginModal.style.display = 'block';
            // Update UI to reflect logged in state
            //signOutButton.style.display = 'block';
            //loginBtn.style.display = 'none';
        } catch (error) {
            console.error('Login failed:', error);
            document.getElementById('invalid-popup-login').style.display = 'block';
        }
    });

    signOutButton.addEventListener('click', function () {
        axios.post('/logout')
            .then(function (response) {
                console.log('Logged out successfully');
                //signOutButton.style.display = 'none';
                loginBtn.style.display = 'block';
                loginModal.style.display = 'none'; // Hide the login modal
            })
            .catch(function (error) {
                console.error('Logout failed:', error);
            });
    });

    // Close the login modal
    document.querySelector('.modal .close-button').addEventListener('click', function () {
        loginModal.style.display = 'none';
    });

    // Event listeners for closing pop-ups using their close buttons
    document.querySelectorAll(".close-btn").forEach(button => {
        button.addEventListener("click", function(){
            this.closest(".popup, .create-popup").classList.remove("active");
        });
    });
});
async function activatePopup(event) {
    event.preventDefault(); // Prevent the default action of following the link
    document.querySelector(".popup").classList.add("active");
    try{
        const response = await axios.post('/tokenTest').then( res =>{
            console.log(res);
            //if not signed in
            if(res == null){
                document.querySelector('#signout-btn').classList.remove("active");
                signOutButton.removeEventListener('click',handleSignOut);
            }
            else{
                document.querySelector('#signout-btn').classList.add("active");
                signOutButton.addEventListener('click', handleSignOut);
            }
        }); 
    }
    catch (error) {
        console.error('Error:', error);
    }
    
}

document.querySelector("a.nav-bar-link[href='/login']").addEventListener("click", activatePopup);
document.querySelector("p.footer-nav-bar a[href='/login']").addEventListener("click", activatePopup);

/*
document.querySelector("a.nav-bar-link[href='/login']").addEventListener("click", function(event){
    event.preventDefault(); // Prevent the default action of following the link
    document.querySelector(".popup").classList.add("active");
});
*/

//closes pop ups
document.querySelector(".popup .close-btn").addEventListener("click", function(){
    document.querySelector(".popup").classList.remove("active");
    //clears login info when closed
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
    });
document.querySelector(".create-popup .close-btn").addEventListener("click", function(){
    document.querySelector(".create-popup").classList.remove("active");
    //clears login info when closed
    document.getElementById('email-create').value = "";
    document.getElementById('create-password').value = "";
    document.getElementById('confirm-password').value = "";
    //clears error popup when closed
    document.getElementById('create-invalid-popup').style.display = 'none';
    document.getElementById('create-invalid-popup-password').style.display = 'none';
    document.getElementById('create-invalid-popup-email').style.display = 'none';
    });
document.querySelector("#sign").addEventListener("click", function() {
    // Retrieve the values of email and password input fields
    var email = document.querySelector("#email").value;
    var password = document.querySelector("#password").value;
    // Log the email and password to the console
    console.log("Email:", email);
    console.log("Password:", password);
});

//Brings up create screen
document.querySelector("#createAcc").addEventListener("click", function(){
    document.querySelector(".popup").classList.remove("active");
    document.querySelector(".create-popup").classList.add("active");
    
    });

const emailInput = document.querySelector('#email');

const passwordInput = document.querySelector('#password');

const signInButton = document.querySelector('#signin-btn');
const signOutButton = document.querySelector('#signout-btn');

//signout 
//document.querySelector("#signout-btn").addEventListener("click", function(){document.querySelector(".signout-popup").classList.add("active");});
//document.querySelector(".signout-popup .close-btn").addEventListener("click", function(){document.querySelector(".signout-popup").classList.remove("active");});

async function handleSignIn() {
    // Get the values from the email and password fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
   // window.location.href = "/review";
    const userData = {
        email: email,
        password: password
    };

    try {

        const response = await axios.post('/login', userData);
        console.log('Login successful:', response);
        showModal('Login successful! Welcome!');
        const { accessToken } = response.data;
        localStorage.setItem('token', accessToken);
        const protectedResponse = await axios.get('/protected', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });


   
        //close popup when properly loged in
        document.querySelector(".popup").classList.remove("active");
        //clear fields when logged in
        document.getElementById('email').value = "";
        document.getElementById('password').value = "";
    
    } catch (error) {
      
        console.error('Error:', error);
    }
    
}
function showModal(message) {
    const modal = document.getElementById('loginModal');
    modal.style.display = "block";
    modal.querySelector('p').textContent = message;

    const closeButton = modal.querySelector('.close-button');
    closeButton.onclick = function() {
        modal.style.display = "none";
    };
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}
async function handleSignup(){
    // Get the values from the email and password fields
    const email = document.getElementById('email-create').value;
    const password = document.getElementById('create-password').value;
    console.log('Email:', email, 'Password:', password);
    const userData = {
        email: email,
        password: password
    };

    try{
        // Adds user to the database
        const response = await axios.post('/createAcount', userData);

        return response;
    }
    catch(error){
        // Handle error (create acount failure)
        console.error({message:'Error:', error});
    }
}
async function handleSignOut() {
    try {
   
        const token = localStorage.getItem('token'); 
        await axios.post('/logout', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        localStorage.removeItem('token');
        sessionStorage.removeItem('token');

        alert('Logged out successfully');

        //removes the signout button
        document.querySelector('#signout-btn').classList.remove("active");
        signOutButton.removeEventListener('click',handleSignOut);
    } catch (error) {
        console.error('Sign out failed:', error);

        alert('Logout failed. Please try again.');
    }
}


document.querySelector("#post-createAcc").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    
    //close invalid popups when a create acount is clicked
    document.getElementById('create-invalid-popup').style.display = 'none';
    document.getElementById('create-invalid-popup-password').style.display = 'none';
    document.getElementById('create-invalid-popup-email').style.display = 'none';


    // Validate email and password
    const email = document.getElementById('email-create').value;
    const password = document.getElementById('create-password').value;
    const password2 = document.getElementById('confirm-password').value;
    
    if (!email.includes('@') || !email.endsWith('.com')) {
        // Show the invalid create account popup message
        document.getElementById('create-invalid-popup').style.display = 'block';
        return; // Exit function to prevent account creation
    }
    if(password != password2 || password.length < 8){
        document.getElementById('create-invalid-popup-password').style.display = 'block';
        return; // Exit function to prevent account creation
    }
    

    //Continue Acccount CREATION HERE
    handleSignup().then( res =>{
        console.log(res);
        //if signup fails
        if(res == null){
            document.getElementById('create-invalid-popup-email').style.display = 'block';
            return; // Exit function to prevent account creation
        }
        else{
            //close popup once acount is loged in
            document.querySelector(".create-popup").classList.remove("active");
            //remove login info from boxe's once closed
            document.getElementById('email-create').value = "";
            document.getElementById('create-password').value = "";
            document.getElementById('confirm-password').value = "";
        }
    });

});

document.getElementById('invalid-popup-login').addEventListener('click', function() {
    this.style.display = 'none';
});
document.getElementById('create-invalid-popup').addEventListener('click', function() {
    this.style.display = 'none';
});
document.getElementById('create-invalid-popup-password').addEventListener('click', function() {
    this.style.display = 'none';
});
document.getElementById('create-invalid-popup-email').addEventListener('click', function() {
    this.style.display = 'none';
});
// Add event listener to the Sign in button

signInButton.addEventListener('click', handleSignIn);