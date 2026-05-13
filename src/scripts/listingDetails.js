import {
  displaySimpleWindow,
  displayWindow,
  closePopupWindow,
} from "./popupWindow.js";

let bookmarkedItems = [];

// get the id of the document from the url
const id = window.location.pathname.split("/").pop();
const bookmarkButton = document.getElementById("bookmark");
const bookmarkLabel = document.getElementById("bookmark-label");

// ===========================================================================
//This function gets the current saved Items in user model
// ===========================================================================

async function getUserSavedItems() {
  // get the user info for viewing their saved items, this will be used for changing the state of the button visually
  const currentUser = await (await fetch("/user")).json();
  bookmarkedItems = currentUser.savedItems;
}

// ==========================================================================
// This function updates the look of the bookmark button for a listing
// ===========================================================================
function updateBookmarkButton(id) {
  if (bookmarkedItems.includes(id)) {
    bookmarkButton.classList.remove("box-color-0");
    bookmarkButton.classList.add("box-color-2");
    bookmarkLabel.innerText = "Remove Bookmark";
  } else {
    bookmarkButton.classList.remove("box-color-2");
    bookmarkButton.classList.add("box-color-0");
    bookmarkLabel.innerText = "Save For Later";
  }
}
// for showing the state of button upon the page reload, we should use a callback to run this function after we get the user data
getUserSavedItems().then(() => updateBookmarkButton(id));

// ===========================================================================
// This function saves/bookmarks a listing or remove it from user's collection
// ===========================================================================
async function bookmarkListing() {
  await getUserSavedItems();
  if (!bookmarkedItems.includes(id)) {
    const Response = await (
      await fetch(`/bookmarkListing/${id}`, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
    ).json();
    bookmarkedItems = Response;
  } else {
    const Response = await (
      await fetch(`/removeBookmark/${id}`, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
    ).json();
    bookmarkedItems = Response;
  }
  updateBookmarkButton(id);
}

bookmarkButton.addEventListener("click", bookmarkListing);

//======================================================================================
//This function collects a user review and send it to the server.
//This function is adopted from popupWindow file and refactored to be used for review.
//======================================================================================
async function submitReview() {
  const reviewForm = document.getElementById("reviewForm");

  //FormData is a built-in browser tool that reads all the inputs inside a form
  //  and collects their values for you automatically
  const formData = new FormData(reviewForm);

  // validate — make sure nothing is empty
  let isValid = true;
  //Loops through every field in the form.
  //key is the input's name, value is what the user typed.
  for (const [key, value] of formData.entries()) {
    if (key === "rating" && value === "0") isValid = false;
    if (!value.trim()) isValid = false; // if someone just types spaces, it still counts as empty
  }

  if (isValid) {
    const Response = await fetch(`/reviews/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // use get method to get the submitted values by the name of inputs
        title: formData.get("title"),
        description: formData.get("description"),
        rating: Number(formData.get("rating")),
      }),
    });
    if (Response.ok) {
      closePopupWindow();
    }
  } else {
    if (reviewForm.querySelector(".form-error")) return;

    const error = document.createElement("div");
    error.className = "form-error text-red text-sm";
    error.textContent = "Please fill in all fields and select a rating.";

    reviewForm.appendChild(error);
  }
}

// defining submit review form to use it in pop-up component
const form = `
  <form id="reviewForm" class="flex flex-col gap-4 mt-4 text-start w-full">
    <div class="flex flex-col gap-1">
      <label>Rating</label>
      <div id="starRating" class="flex flex-row gap-1 items-center">
        <svg data-value="1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-light-grey cursor-pointer"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
        <svg data-value="2" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-light-grey cursor-pointer"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
        <svg data-value="3" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-light-grey cursor-pointer"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
        <svg data-value="4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-light-grey cursor-pointer"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
        <svg data-value="5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-light-grey cursor-pointer"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
      </div>
      <input type="hidden" id="ratingValue" name="rating" value="0" />
    </div>
    <div class="flex flex-col gap-1">
      <label>Title</label>
      <input type="text" name="title" placeholder="Review title" />
    </div>
    <div class="flex flex-col gap-1">
      <label>Description</label>
      <textarea name="description" placeholder="Leave your review here..."></textarea>
    </div>
  </form>`;

const buttons = [
  {
    label: "Submit",
    color: "box-color-0",
    hover: "hover-outline",
    onClick: submitReview,
  },
  {
    label: "Cancel",
    color: "box-color-1",
    hover: "hover-outline",
    onClick: closePopupWindow,
  },
];


let starValue = undefined;

document.getElementById("leaveReviewBtn").addEventListener("click", () => {
  displaySimpleWindow("Submit" + form, buttons, false);

  // handling starts once the form opens
  const stars = document.querySelectorAll("#starRating svg");
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      starValue = Number(star.dataset.value); // we invented our custom data-value for each star, to retrieve it we can use dataset.value, we should convert it to the number
      document.getElementById("ratingValue").value = starValue; // we assign this value in hidden output to submit it with the form
      stars.forEach((newStar) => {
        if (Number(newStar.dataset.value) <= starValue) {
          newStar.classList.add("text-orange");
          newStar.classList.remove("text-light-grey");
        } else {
          newStar.classList.remove("text-orange");
          newStar.classList.add("text-light-grey");
        }
      });
    });
  });
});
