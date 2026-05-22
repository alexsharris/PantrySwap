import { displaySimpleWindow, displayWindow } from "./popupWindow.js";

//======================================================================================================
// this function will fetch informtaion from DB to present as the default placeholders in the form
//======================================================================================================
async function getDefaultInformation() {
  const serverResponse = await fetch("/AccountData");
  const serverResponseJson = await serverResponse.json();

  // assign user's name and city
  document.getElementById("UserCurrentName").innerHTML =
    serverResponseJson.name;
  document.getElementById("Usercity").innerHTML =
    serverResponseJson.city || "Unknown";

  // assign the information retrieved to each placeholder
  document.getElementById("UserNewName").placeholder = serverResponseJson.name;
  document.getElementById("UserNewEmail").placeholder =
    serverResponseJson.email;

  // some of the info could not exist if they user is recently signed up
  if (serverResponseJson.phone) {
    document.getElementById("UserNewphone").placeholder =
      serverResponseJson.phone;
  }
  if (serverResponseJson.city) {
    document.getElementById("UserNewCity").placeholder =
      serverResponseJson.city;
  }
  if (serverResponseJson.profilePicture) {
    document.getElementById("userPFP").src = serverResponseJson.profilePicture;
    document.getElementById("userPFP").classList.remove("hidden");
    document.getElementById("userPFPInitial").classList.add("hidden");
  } else {
    document.getElementById("userPFPInitial").textContent = serverResponseJson.name.charAt(0).toUpperCase();
  }
  if (serverResponseJson.address) {
    document.getElementById("UserNewAddress").placeholder =
      serverResponseJson.address;
  }
  if (serverResponseJson.postalCode) {
    document.getElementById("UserNewPostalCode").placeholder =
      serverResponseJson.postalCode;
  }
}
getDefaultInformation();

//==========================================================================
//using the pre-defined pop-up component to display changes saved message
//==========================================================================

// if user clicks on save button the information should be sent to server

const form = document.getElementById("AccountForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  displayWindow("Saved Changes!", button);
});
const button = [
  {
    label: "Confirm",
    color: "box-color-0",
    hover: "hover-outline",
    onClick: changeData,
  },
];

//=============================================================================================
// This function converts a File object to a Base64-encoded data URL for storage and preview
//=============================================================================================
function readImageAsBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      resolve(e.target.result); // full Base64 string
    };
    reader.onerror = function () {
      reject(new Error("Error reading image"));
    };
    reader.readAsDataURL(file);
  });
}

let currentPFP;

const uploadImgBtn = document.getElementById("profilePicBtn");
uploadImgBtn.addEventListener("click", async () => {
  const PFP = document.getElementById("userProfilePic").files[0];
  const encodedImg = await readImageAsBase64(PFP);
  currentPFP = encodedImg;
  document.getElementById("userPFP").src = currentPFP;
  document.getElementById("userPFP").classList.remove("hidden");
  document.getElementById("userPFPInitial").classList.add("hidden");
});

//=====================================================================================================
// This function collects updated fields from the form and sends only the changed values to the server
//=====================================================================================================
async function changeData() {
  const name = document.getElementById("UserNewName").value;
  const email = document.getElementById("UserNewEmail").value;
  const phone = document.getElementById("UserNewphone").value;
  const city = document.getElementById("UserNewCity").value;
  const address = document.getElementById("UserNewAddress").value;
  const postalCode = document.getElementById("UserNewPostalCode").value;

  // should be defined outside if statements to be accessible
  let UserNewName, UserNewEmail, UserNewphone, UserNewCity, UserNewPFP, UserNewAddress, UserNewPostalCode;

  // only send the fields that are actually updated (not falsey or empty)
  if (name) {
    UserNewName = name;
  }
  if (email) {
    UserNewEmail = email;
  }
  if (phone) {
    UserNewphone = phone;
  }
  if (city) {
    UserNewCity = city;
  }
  if (currentPFP) {
    UserNewPFP = currentPFP;
  }
  if (address) {
    UserNewAddress = address;
  }
  if (postalCode) {
    UserNewPostalCode = postalCode;
  }

  const response = await fetch("/ChangeData", {
    method: "PUT",
    redirect: "follow",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      UserNewName,
      UserNewEmail,
      UserNewphone,
      UserNewCity,
      UserNewPFP,
      UserNewAddress,
      UserNewPostalCode
    }),
  });
  await getDefaultInformation();
}

//==============================================================================
// using the pre-defined pop up component from popupWindow module for deleteing
//==============================================================================

// attach event listener to deleteaccount button to show the pop up window
document.getElementById("DeleteAccount").addEventListener("click", async () => {
  displayWindow("Are you sure you want to delete your account?", buttons);
});

//  customize the buttons

const buttons = [
  {
    label: "yes, delete",
    color: "box-color-4",
    hover: "hover-outline",
    onClick: deleteAccount,
  },
  {
    label: "No, cancel",
    color: "box-color-1",
    hover: "hover-outline",
    onClick: () => console.log(""),
  },
];


// ============================================================================
// This function sends the delete request to the server to delete an account
// ============================================================================
async function deleteAccount() {
  const response = await fetch("/DeleteAccount", { method: "DELETE" });
  if (response.ok) {
    window.location.href = "/login";
  }
}
