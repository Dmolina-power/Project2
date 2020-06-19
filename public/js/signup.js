$(document).ready(() => {
  // Getting references to our form and input
  const signUpForm = $(".login-box-form-section");
  const usernameInput = $("input[name='email']");
  const passwordInput = $("input[name='password']");

  // When the signup button is clicked, we validate the username and password are not blank
  signUpForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      username: usernameInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.username || !userData.password) {
      return;
    }
    // If we have an username and password, run the signUpUser function
    signUpUser(userData.username, userData.password);
    usernameInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(username, password) {
    console.log(username, password);
    $.post("/api/signup", {
      username: username,
      password: password
    })
      .then(() => {
        window.location.replace("/members");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
