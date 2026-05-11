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
