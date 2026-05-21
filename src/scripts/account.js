import { displaySimpleWindow, displayWindow } from "./popupWindow.js";

// this function will fetch informtaion from DB to present as the default placeholders in the form
async function GetDefaultInformation() {
  const ServerResponse = await fetch("/AccountData");
  const ServerResponseJson = await ServerResponse.json();

  // assign user's name and city
  document.getElementById("UserCurrentName").innerHTML =
    ServerResponseJson.name;
  document.getElementById("Usercity").innerHTML =
    ServerResponseJson.city || "Unknown";

  // assign the information retrieved to each placeholder
  document.getElementById("UserNewName").placeholder = ServerResponseJson.name;
  document.getElementById("UserNewEmail").placeholder =
    ServerResponseJson.email;
  console.log(ServerResponseJson.profilePicture);

  // some of the info could not exist if they user is recently signed up
  if (ServerResponseJson.phone) {
    document.getElementById("UserNewphone").placeholder =
      ServerResponseJson.phone;
  }
  if (ServerResponseJson.city) {
    document.getElementById("UserNewCity").placeholder =
      ServerResponseJson.city;
  }
  if (ServerResponseJson.profilePicture) {
    document.getElementById("userPFP").src = ServerResponseJson.profilePicture;
    document.getElementById("userPFP").classList.remove("hidden");
    document.getElementById("userPFPInitial").classList.add("hidden");
  } else {
    document.getElementById("userPFPInitial").textContent = ServerResponseJson.name.charAt(0).toUpperCase();
  }
  if (ServerResponseJson.address) {
    document.getElementById("UserNewAddress").placeholder =
      ServerResponseJson.address;
  }
  if (ServerResponseJson.postalCode) {
    document.getElementById("UserNewPostalCode").placeholder =
      ServerResponseJson.postalCode;
  }
}
GetDefaultInformation();

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
  console.log("pressed btn");
  const PFP = document.getElementById("userProfilePic").files[0];
  console.log(PFP);
  const encodedImg = await readImageAsBase64(PFP);
  console.log(encodedImg);
  currentPFP = encodedImg;
  document.getElementById("userPFP").src = currentPFP;
  document.getElementById("userPFP").classList.remove("hidden");
  document.getElementById("userPFPInitial").classList.add("hidden");
});

async function changeData() {
  const Name = document.getElementById("UserNewName").value;
  const Email = document.getElementById("UserNewEmail").value;
  const Phone = document.getElementById("UserNewphone").value;
  const City = document.getElementById("UserNewCity").value;
  const Address = document.getElementById("UserNewAddress").value;
  const PostalCode = document.getElementById("UserNewPostalCode").value;

  // should be defined outside if statements to be accessible
  let UserNewName, UserNewEmail, UserNewphone, UserNewCity, UserNewPFP, UserNewAddress, UserNewPostalCode

  // only send the fields that are actually updated (not falsey or empty)
  if (Name) {
    UserNewName = Name;
  }
  if (Email) {
    UserNewEmail = Email;
  }
  if (Phone) {
    UserNewphone = Phone;
  }
  if (City) {
    UserNewCity = City;
  }
  if (currentPFP) {
    UserNewPFP = currentPFP;
  }
  if (Address){
    UserNewAddress = Address
  }
  if (PostalCode){
    UserNewPostalCode = PostalCode
  }

  const Response = await fetch("/ChangeData", {
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
  await GetDefaultInformation();
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
    onClick: () => console.log("Cancelled"),
  },
];

// calling the function to send the delete request

async function deleteAccount() {
  const Response = await fetch("/DeleteAccount", { method: "DELETE" });
  if (Response.ok) {
    window.location.href = "/login";
  }
}
