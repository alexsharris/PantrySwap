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

  // some of the info could not exist if they user is recently signed up
  if (ServerResponseJson.phone) {
    document.getElementById("UserNewphone").placeholder =
      ServerResponseJson.phone;
  }
  if (ServerResponseJson.city) {
    document.getElementById("UserNewCity").placeholder =
      ServerResponseJson.city;
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


async function changeData() {
  const Name = document.getElementById("UserNewName").value;
  const Email = document.getElementById("UserNewEmail").value;
  const Phone = document.getElementById("UserNewphone").value;
  const City = document.getElementById("UserNewCity").value;

  // should be defined outside if statements to be accessible
  let UserNewName, UserNewEmail, UserNewphone, UserNewCity;

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

  const Response = await fetch("/ChangeData", {
    method: "PUT",
    redirect: "follow",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      UserNewName,
      UserNewEmail,
      UserNewphone,
      UserNewCity,
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
   await fetch("/DeleteAccount", { method: "DELETE" });
   window.location.href = "/Login";
}
