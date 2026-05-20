import { closePopupWindow, displaySimpleWindow } from "./popupWindow.js";

let tutorialState = null;

const buttons = [
  {
    label: "Next",
    color: "box-color-0",
    hover: "hover-outline",
    onClick: nextStepButtonEvent,
    customClasses: ["w-full"],
  },
  {
    label: "skip",
    color: "box-color-3",
    hover: "hover-bright",
    onClick: closePopupWindow,
    topButton: true,
    customClasses: ["rounded-full", "p-4"],
  },
];

async function getTutorialState() {
  try {
    const response = await fetch("/user");
    const currentUser = await response.json();
    tutorialState = currentUser.tutorials;
  } catch (e) {
    console.log(e);
  }
}

function nextStepButtonEvent() {
  console.log("NEXT BUTTON");
}

function callTutorial(tutorialName) {
  console.log(tutorialName);
  displaySimpleWindow(
    "Tutorial",
    buttons,
    true,
    "",
    null,
    "flex w-full flex-1 pt-5",
  );

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
