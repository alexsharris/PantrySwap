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
    label: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
    `,
    color: "box-color-3",
    hover: "hover-bright",
    onClick: closePopup,
    topButton: true,
    customClasses: ["rounded-full", "p-4"],
  },
];
let currentTutorialName = "";
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

async function closePopup() {
  try {
    const response = await fetch("/user");
    const currentUser = await response.json();
    const res = await fetch(`/addUserTutorial/${currentUser._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tutorialName: currentTutorialName,
      }),
    });

    const resData = await response.res;
  } catch (e) {
    console.log(e);
  }

  closePopupWindow();
}

function nextStepButtonEvent() {
  currentPage++;
  if (currentTutorial["steps"].length == currentPage) closePopup();
  else renderTutorialPage();
}
// =================================================
// Rendering
// =================================================

// render the relevant image, text, and progress the progression bar
function renderTutorialPage() {
  tutorialImage.src = currentTutorial["steps"][currentPage].image;
  tutorialText.textContent = currentTutorial["steps"][currentPage].text;

  for (let i = 0; i < tutorialProgressBar.length; i++) {
    const element = tutorialProgressBar[i];
    if (i == currentPage) {
      element.classList.add("bg-orange");
      element.classList.remove("bg-light-grey");
    } else {
      element.classList.remove("bg-orange");
      element.classList.add("bg-light-grey");
    }
  }
}

export async function callTutorial(tutorialName) {
  // Check if we've already done the tutorial
  await getUserTutorialState();
  if (!tutorialState || tutorialState.includes(tutorialName)) return;
  currentTutorialName = tutorialName;

  // check if we have the tutorial data
  currentTutorial = getTutorialData(tutorialName);
  if (!currentTutorial) return;

  // define custom window contents
  const tutorialWindowMainContent = `
  <div class="flex flex-col gap-3 items-center justify-center">
  <img id="tutorial-img" src="" class="size-50 object-scale-down">
  <p id="tutorial-text" class="font-semibold"></p>
  </div>`;

  // display popup
  displayWindow(
    tutorialWindowMainContent,
    popupWindowButtons,
    false,
    "card flex flex-col items-center justify-center md:w-1/3 w-1/2 text-center",
    null,
    "flex w-full flex-1 pt-5",
  );

  // add tutorial dots
  const popupCard = document.getElementById("popup-card");
  let tutorialDots = ``;
  currentTutorial["steps"].forEach(
    (step) =>
      (tutorialDots += `<div class="tutorial-dot rounded-full h-2 w-2"></div>`),
  );
  popupCard.insertAdjacentHTML(
    "beforeend",
    `<div class="flex justify-center gap-2 p-4">
    ${tutorialDots}
    </div>`,
  );

  // assign variables
  tutorialProgressBar = document.querySelectorAll(".tutorial-dot");
  tutorialImage = document.getElementById("tutorial-img");
  tutorialText = document.getElementById("tutorial-text");

  // render first page
  renderTutorialPage();
}
