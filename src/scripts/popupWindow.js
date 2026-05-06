// ============================================
// BUTTONS
// ============================================
function createButtons(functions) {
  let buttons = [];

  if (!functions || functions.length === 0) {
    let btn = document.createElement("button");
    btn.textContent = "OK";
    formatButton(btn, "box-color-0", "hover-outline");
    buttons.push(btn);
    btn.addEventListener("click", () => console.log("Confirmed"));
    btn.addEventListener("click", closeWindow);
    return buttons;
  }

  functions.forEach((fnObj) => {
    let btn = document.createElement("button");
    btn.textContent = fnObj.label;

    formatButton(btn, fnObj.color, fnObj.hover);

    btn.addEventListener("click", fnObj.onClick);
    btn.addEventListener("click", closeWindow);
    buttons.push(btn);
  });

  return buttons;
}

function formatButton(buttonEl, buttonColor, buttonHover) {
  return (buttonEl.className = `${buttonColor} ${buttonHover}`);
}

// ============================================
// DISPLAY
// ============================================
export function displaySimpleWindow(message, functions, includeOverlay = true) {
  let formattedMessage = `<h2 class="font-bold">${message}</h2>`;
  displayWindow(formattedMessage, functions, includeOverlay);
}

export function displayWindow(message, functions = "", includeOverlay = true) {
  const window = document.createElement("div");

  // add a full screen blocker window
  window.className = `
    fixed inset-0 z-[100]
    flex items-center justify-center
    `;
  window.id = "popup-window";
  if (includeOverlay) {
    window.classList.add("overlay");
  }

  // create content card
  const card = document.createElement("div");
  card.className =
    "card flex flex-col items-center justify-center p-7 md:max-w-1/4 max-w-1/2 md:min-w-2/5 min-w-3/4";

  const messageEl = document.createElement("div");
  messageEl.className = "max-w-[80%] text-center";
  messageEl.innerHTML = message;

  const newButtons = createButtons(functions);
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "flex justify-between gap-2 pt-5";
  newButtons.forEach((btn) => buttonContainer.appendChild(btn));

  // assemble
  card.appendChild(messageEl);
  card.appendChild(buttonContainer);
  window.appendChild(card);
  document.body.appendChild(window);
}

function closeWindow() {
  const popupWindow = document.getElementById("popup-window");
  popupWindow.remove();
}

// // ============================================
// // EXAMPLES
// // ============================================
// const buttons = [
//   {
//     label: "yes, delete",
//     color: "box-color-0",
//     hover: "hover-outline",
//     onClick: () => console.log("Confirmed"),
//   },
//   {
//     label: "no, cancel",
//     color: "box-color-1",
//     hover: "hover-outline",
//     onClick: () => console.log("Cancelled"),
//   },
// ];
// displaySimpleWindow("Are you sure you want to delete this listing?", buttons);

displaySimpleWindow(
  `<div class="flex flex-col items-center justify-center">
    <div class="text-orange-500">
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="76"
        height="76"
        viewBox="0 0 24 24"
        fill="currentColor"
        >
        <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
        </svg>
    </div>
    <div>Listing deleted</div>
  </div>`,
  [
    {
      label: "Go back to my listings",
      color: "box-color-1",
      hover: "hover-bright",
      onClick: () => console.log("Cancelled"),
    },
  ],
);
