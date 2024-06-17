const baseUrl = "http://127.0.0.1:5000";
const advancedUrl = baseUrl + "/";

async function toggleCredentials() {
  try {
    const isAdmin = await checkForAdmin();
    const submitButton = document.getElementById("submit");
    const changeText = document.getElementById("change_text");
    const changeButton = document.getElementById("change_button");
    const rPassword = document.getElementById("r_password").parentElement;

    if (isAdmin && submitButton.value === "Inloggen") {
      submitButton.value = "Registreren";
      changeText.innerHTML = "Heb je een account?";
      changeButton.innerHTML = "Inloggen";
      rPassword.style.display = "";
    } else if (submitButton.value === "Registreren") {
      submitButton.value = "Inloggen";
      changeText.innerHTML = "Nog geen account?";
      changeButton.innerHTML = "Registreren";
      rPassword.style.display = "none";
    }
  } catch (error) {
    console.error(`Error in toggleCredentials:`, error);
  }
}

async function checkForAdmin() {
  try {
    const response = await fetch(advancedUrl + "fetch", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        table: "users",
        data: {
          permission_level: 50,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const { data } = await response.json();
    const fetched = data && data["data"];

    if (fetched && fetched.id !== undefined) {
      return true;
    } else {
      handleErrorDisplay("Admin is already registerd!");
      return false;
    }
  } catch (error) {
    console.error(`Error during fetch operation:`, error);
    return false;
  }
}

function handleErrorDisplay(text) {
  const submitButton = document.getElementById("submit");
  const originalValue = submitButton.value;
  submitButton.value = text;
  setTimeout(() => {
    submitButton.value = originalValue;
  }, 2500);
}

function handleSubmit() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const r_password = document.getElementById("r_password").value;

  if (email.length <= 0 || password.length <= 0) {
    handleErrorDisplay("Please fill in all required fields!");
  }

  if (document.getElementById("submit").value === "Inloggen") {
    fetch(advancedUrl + "fetch", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        table: "users",
        data: {
          email: email,
          secret_password: password,
        },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(({ data }) => {
        console.log(data);
        if (data && data.type !== "ERROR") {
          data.forEach((item, index) => {
            if (item.secret_password) {
              localStorage.setItem("user", JSON.stringify(item));
              window.location.href = advancedUrl + "dashboard";
            } else {
              handleErrorDisplay("incorrect password!");
            }
          });
        } else {
          handleErrorDisplay("user not found!");
        }
      })
      .catch((error) => {
        console.error("Error during fetch operation:", error);
      });
  } else if (document.getElementById("submit").value === "Registreren") {
    if (r_password <= 0) {
      handleErrorDisplay("Please fill in all required fields!");
      return;
    }

    if (password !== r_password) {
      handleErrorDisplay("Password was incorrect!");
      return;
    }

    fetch(advancedUrl + "insert", {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        table: "users",
        data: {
          email: email,
          secret_password: password,
        },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(({ data }) => {
        if (data) {
          toggleCredentials();
        }
      })
      .catch((error) => {
        console.error("Error during fetch operation:", error);
      });
  } else {
    console.log("ERROR");
  }
}
