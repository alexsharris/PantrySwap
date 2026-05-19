import {
  displaySimpleWindow,
  displayWindow,
  closePopupWindow,
} from "./popupWindow.js";
import {
  NotifTypes,
  newNotificationWithGetReciever,
} from "./notificationSystem.js";
import "../components/bookmarkButton.js";

// get the id of the document from the url
const id = window.location.pathname.split("/").pop();

async function renderBookmarkButton() {
  const bookmarkButtonDiv = document.getElementById("save-button-div");
  const currentUser = await (await fetch("/user")).json();
  bookmarkButtonDiv.innerHTML = `
  <bookmark-btn
            class="bookmark-btn"
            listing-id="${id}"
            is-saved="${currentUser.savedItems.includes(id)}"
            button-style="FULL"
          ></bookmark-btn>
  `;
}

renderBookmarkButton();
//=======================================================================================
//This function gets all the reviews submitted for a seller and displays them dynamically
//=======================================================================================
async function displayReviews(id) {
  //array for store all the ratings for the seller to calculate average
  let allRatings = [];
  const reviewsResponse = await (await fetch(`/sellerReviews/${id}`)).json(); // this would be an array
  const reviewContainer = document.getElementById("reviewsContainer");
  reviewContainer.innerHTML = "";
  let ratings = 0;
  reviewsResponse.forEach((review) => {
    ratings++;
    allRatings.push(Number(review.rating));
    const element = document.createElement("div");
    element.innerHTML = `<div class="flex flex-col gap-3">
            <h2 id="reviewTitle">${review.title}</h2>
            <!-- container of stars -->
            <div id="starContainer" class="flex flex-row gap-1 items-center">
              <svg data-value="1"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 text-light-grey"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>
              <svg data-value="2"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 text-light-grey"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>
              <svg data-value="3"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 text-light-grey"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>
              <svg data-value="4"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 text-light-grey"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>
              <svg data-value="5"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 text-light-grey"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>
            </div>
            <p  class="py-5">${review.description}</p>
            <p  class="font-bold pb-4">${review.reviewerName}</p>
            <hr class="border-light-grey">
          </div>`;
    reviewContainer.appendChild(element);
    //handle the stars in each review
    const starValueDB = review.rating;
    document.querySelectorAll("#starContainer svg").forEach((star) => {
      if (star.dataset.value <= starValueDB) {
        star.classList.add("text-orange");
        star.classList.remove("text-light-grey");
      } else {
        star.classList.remove("text-orange");
        star.classList.add("text-light-grey");
      }
    });
  });

  // display total number of reviews seller has
  document.getElementById("numberReviews").innerHTML = ratings;

  // display rating average for the seller

  let sum = 0;
  for (let i = 0; i < allRatings.length; i++) {
    sum += allRatings[i];
  }

  const average = allRatings.length > 0 ? (sum / allRatings.length).toFixed(1) : "0";

  document.getElementById("average").innerHTML = average;
}
displayReviews(id);
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
        name: formData.get("name"),
        title: formData.get("title"),
        description: formData.get("description"),
        rating: Number(formData.get("rating")),
      }),
    });
    if (Response.ok) {
      closePopupWindow();
      displayReviews(id);
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
      <label>Name</label>
      <input type="text" name="name" placeholder="Displayed Name" />
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
