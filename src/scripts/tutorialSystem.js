import { closePopupWindow, displayWindow } from "./popupWindow.js";

let tutorialState = null;

const buttons = [
  {
    label: "Next",
    color: "box-color-0",
    hover: "hover-outline",
    onClick: nextStepButtonEvent,
    customClasses: ["w-full", "text-10"],
  },
  {
    label: `<img src="images/closeIcon.png" class="size-3">`,
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
  const tutorialWindowMainContent = `
  <div class="flex flex-col gap-3 items-center justify-center">
    <img src="images/tutorialSearchStep1.png" class="size-50 object-scale-down">
    <p class="font-semibold">Select the bookmark button to add to your collectionSelect the bookmark button to add to your collectionSelect the bookmark button to add to your collectionSelect the bookmark button to add to your collectionSelect the bookmark button to add to your collection</p>
  </div>`;

  displayWindow(
    tutorialWindowMainContent,
    buttons,
    true,
    "card flex flex-col items-center justify-center md:w-1/3 w-1/2 text-center",
    null,
    "flex w-full flex-1 pt-5",
  );

  const popupCard = document.getElementById("popup-card");
  popupCard.insertAdjacentHTML(
    "beforeend",
    `<div id = "tutorial-step" class="flex justify-center gap-2 p-4">
                <div class="bg-[#D9D9D9] rounded-full h-2 w-2"></div>
                <div class="bg-[#FF6700] rounded-full h-2 w-2"></div>
                <div class="bg-[#D9D9D9] rounded-full h-2 w-2"></div>
                <div class="bg-[#D9D9D9] rounded-full h-2 w-2"></div>
            </div>`,
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
