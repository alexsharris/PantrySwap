import "./popupWindow.js";

let tutorialState = null;

async function getTutorialState() {
  try {
    const response = await fetch("/user");
    const currentUser = await response.json();
    tutorialState = currentUser.tutorials;
  } catch (e) {
    console.log(e);
  }
}

function callTutorial(tutorialName) {
  console.log(tutorialName);

  //   Set tutorial to completed
  //   const res = await fetch(
  //       `/updateUser/${currentUser._id}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           "tutorials": tutorialName,
  //         }),
  //       },
  //     );
}

document.addEventListener("load", callTutorial("test"));
