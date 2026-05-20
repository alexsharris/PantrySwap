// =================================================
// Imports + variables
// =================================================
import { closePopupWindow, displayWindow } from "./popupWindow.js";
import { tutorialData } from "./tutorials.js";

const popupWindowButtons = [
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

let tutorialState = [];
let currentTutorial = null;
let currentPage = 0;

let tutorialImage = null;
let tutorialText = null;
let tutorialProgressBar = null;
// =================================================
// Logic
// =================================================
async function getUserTutorialState() {
  try {
    const response = await fetch("/user");
    const currentUser = await response.json();
    tutorialState = currentUser.tutorials;
  } catch (e) {
    console.log(e);
  }
}
// Get the data associated with a tutorial's steps
const getTutorialData = (name) => tutorialData.find((tut) => tut.name == name);

function nextStepButtonEvent() {
  currentPage++;
  if (currentTutorial["steps"].length <= currentPage) closePopupWindow();
  else renderTutorialPage();
}
// =================================================
// Rendering
// =================================================

function renderTutorialPage() {
  tutorialImage.src = currentTutorial["steps"][currentPage].image;
  tutorialText.textContent = currentTutorial["steps"][currentPage].text;
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

async function callTutorial(tutorialName) {
  await getUserTutorialState();
  // if (!tutorialState || tutorialState.includes(tutorialName)) return;

  currentTutorial = getTutorialData(tutorialName);
  if (!currentTutorial) return;

  const tutorialWindowMainContent = `
  <div class="flex flex-col gap-3 items-center justify-center">
    <img id="tutorial-img" src="${getTutorialData("create")["steps"][1].image}" class="size-50 object-scale-down">
    <p id="tutorial-text" class="font-semibold">${getTutorialData("create")["steps"][0].text}</p>
  </div>`;

  displayWindow(
    tutorialWindowMainContent,
    popupWindowButtons,
    false,
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

  tutorialProgressBar = document.getElementById("popup-card");
  tutorialImage = document.getElementById("tutorial-img");
  tutorialText = document.getElementById("tutorial-text");

  renderTutorialPage(currentPage);
}

document.addEventListener("load", callTutorial("create"));
