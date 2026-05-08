// ============================================
// BUTTONS
// ============================================
function createButtons(functions, autoClose) {
  let buttons = [];

  if (!functions || functions.length === 0) {
    let btn = document.createElement("button");
    btn.textContent = "OK";
    formatButton(btn, "box-color-0", "hover-outline");
    buttons.push(btn);
    btn.addEventListener("click", () => console.log("Confirmed"));
    if (autoClose) btn.addEventListener("click", closePopupWindow);
    return buttons;
  }

  functions.forEach((fnObj) => {
    let btn = document.createElement("button");
    btn.textContent = fnObj.label;

    formatButton(btn, fnObj.color, fnObj.hover);

    btn.addEventListener("click", fnObj.onClick);
    if (autoClose) btn.addEventListener("click", closePopupWindow);
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
export function displaySimpleWindow(message, functions, autoClose = true) {
  let formattedMessage = `<h2 class="font-bold">${message}</h2>`;
  displayWindow(formattedMessage, functions, autoClose);
}

export function displayWindow(
  message,
  functions = "",
  autoClose = true,
  customCardStle = "",
) {
  document.body.style.overflow = "hidden";

  const window = document.createElement("div");

  // add a full screen blocker window
  window.className = `
    fixed inset-0 z-[100]
    flex items-center justify-center overlay
    `;
  window.id = "popup-window";

  // create content card
  const card = document.createElement("div");
  const messageEl = document.createElement("div");
  if (customCardStle) {
    card.className = customCardStle;
  } else {
    card.className =
      "card flex flex-col items-center justify-center p-7 md:max-w-1/4 max-w-1/2 md:min-w-2/5 min-w-3/4";
    messageEl.className = "max-w-[80%] text-center";
  }

  messageEl.innerHTML = message;

  const newButtons = createButtons(functions, autoClose);
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "flex justify-between gap-2 pt-5";
  newButtons.forEach((btn) => buttonContainer.appendChild(btn));

  // assemble
  card.appendChild(messageEl);
  card.appendChild(buttonContainer);
  window.appendChild(card);
  document.body.appendChild(window);
}

export function closePopupWindow() {
  const popupWindow = document.getElementById("popup-window");
  popupWindow.remove();
  document.body.style.overflow = "auto";
}

// ============================================
// EXAMPLES
// ============================================
// Defined functions for each button
// =================================
// const buttons = [
//   {
//     label: "yes, delete",
//     color: "box-color-0",
//     hover: "hover-outline",
//     onClick: () => console.log("Deleted"),
//   },
//   {
//     label: "no, cancel",
//     color: "box-color-1",
//     hover: "hover-outline",
//     onClick: () => console.log("Cancelled"),
//   },
// ];
// displaySimpleWindow("Are you sure you want to delete this listing?", buttons);

// =================================
// Custom message formatting
// =================================
// displaySimpleWindow(
//   `<div class="flex flex-col items-center justify-center">
//     <div class="text-orange-500">
//         <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="76"
//         height="76"
//         viewBox="0 0 24 24"
//         fill="currentColor"
//         >
//         <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
//         </svg>
//     </div>
//     <div>Listing deleted</div>
//   </div>`,
//   [
//     {
//       label: "Go back to my listings",
//       color: "box-color-1",
//       hover: "hover-bright",
//       onClick: () => console.log("Cancelled"),
//     },
//   ],
// );
// =================================
// Custom form
// =================================

// const buttons = [
//   {
//     label: "Add food",
//     color: "box-color-0",
//     hover: "hover-outline",
//     onClick: addFood,
//   },
//   {
//     label: "cancel",
//     color: "box-color-1",
//     hover: "hover-outline",
//     onClick: closePopupWindow,
//   },
// ];

// function addFood() {
//   const foodForm = document.getElementById("food-form");
//   const formData = new FormData(foodForm);

//   let isValid = true;

//   for (const [key, value] of formData.entries()) {
//     console.log(value);
//     if (!value.trim()) isValid = false;
//   }

//   if (isValid) {
//     closePopupWindow();
//   } else {
//     if (foodForm.querySelector(".form-error")) return;

//     const error = document.createElement("div");
//     error.className = "form-error text-red text-sm";
//     error.textContent = "Required fields missing";

//     foodForm.appendChild(error);
//   }
// }
// const form = `
// <form id="food-form" class="flex flex-col gap-4 mt-4 text-start">
//   <div class="flex flex-col gap-1">
//     <label>Name</label>
//     <input type="text" name="name" placeholder="Gala apples" />
//   </div>
//   <div class="flex flex-col gap-1">
//     <label>Quantity</label>
//     <input type="text" name="quantity" placeholder="2" />
//   </div>
// </form>`;

// displaySimpleWindow("Add food" + form, buttons, false);
