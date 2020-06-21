$(document).ready(() => {
  // Getting references to our form and input
  var signUpForm = $(".signup-box-form-section");
  var emailInput = $("input[name='email']");
  var passwordInput = $("input[name='password']");

  // When the signup button is clicked, we validate the username and password are not blank
  signUpForm.on("submit", function (event) {
    event.preventDefault();
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signupUser(userData.email, userData.password);
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signupUser(email, password) {
    console.log(email, password);
    $.post("/api/signup", {
      email: email,
      password: password
    })
      .then(function (data) {
        window.location.replace("/members");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleSignupErr);
  }

  function handleSignupErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});