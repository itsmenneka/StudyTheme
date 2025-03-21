// Set default values if user already has a profile picture and username
document.addEventListener("DOMContentLoaded", function () {
  const savedUsername = localStorage.getItem("username");
  const savedProfilePicture = localStorage.getItem("profilePicture");

  if (savedUsername) {
    document.getElementById("username").value = savedUsername;
  }

  if (savedProfilePicture) {
    document.getElementById("profilePicturePreview").src = savedProfilePicture;
  }
});

document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById("username").value;
    const profilePictureInput = document.getElementById("profilePicture");
    const profilePictureFile = profilePictureInput.files[0];

    if (username) {
      if (profilePictureFile) {
        const reader = new FileReader();
        reader.onload = function () {
          // Save profile picture as Base64 string
          localStorage.setItem("profilePicture", reader.result);

          // Save username
          localStorage.setItem("username", username);

          alert("Signup successful!");
          document.getElementById("signupForm").reset(); // Clear the form

          // Redirect to home.html after signup
          window.location.href = "home.html";
        };
        reader.readAsDataURL(profilePictureFile);
      } else {
        // Save username even if no profile picture is uploaded
        localStorage.setItem("username", username);

        alert("Signed In!");
        document.getElementById("signupForm").reset(); // Clear the form

        // Redirect to home.html after signup
        window.location.href = "home.html";
      }
    } else {
      alert("Please fill in all fields.");
    }
  });

document
  .getElementById("profilePicture")
  .addEventListener("change", function () {
    const profilePictureFile = this.files[0];
    const preview = document.getElementById("profilePicturePreview");

    if (profilePictureFile) {
      const reader = new FileReader();
      reader.onload = function () {
        preview.src = reader.result; // Update the preview image
      };
      reader.readAsDataURL(profilePictureFile);
    } else {
      // Reset to placeholder image if no file is selected
      preview.src =
        "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?rs=1&pid=ImgDetMain";
    }
  });
