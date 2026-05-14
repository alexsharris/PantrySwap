export const NotifTypes = Object.freeze({
  DELETED: {
    name: "DELETED",
    message: "A listing you have saved has been deleted by its owner",
  },

  UNLISTED: {
    name: "UNLISTED",
    message: "A listing you have saved has been unlisted by its owner",
  },

  BOOKMARKED: {
    name: "BOOKMARKED",
    message: "One of your listings has been saved by another user",
  },

  LISTING_AVAILABLE_AGAIN: {
    name: "LISTING_AVAILABLE_AGAIN",
    message:
      "A listing you had saved that became unlisted is now available again",
  },
});

// =============================
// NOTIF LOGIC
// =============================

// Get the reciever from the listing ID
export async function newNotificationWithGetReciever(listingID, type) {
  let listing = null;
  try {
    const res = await fetch(`/LoadListing/${listingID}`);
    if (res.ok) {
      listing = await res.json();
      newNotification(listing.seller, listingID, type);
    } else {
      console.log("Failed to load listing:", listingID, res.status);
    }
  } catch (err) {
    console.log("Network error loading listing:", listingID);
  }
}

export async function newNotification(receiverID, listingID, type) {
  if (!listingID || !receiverID) {
    console.log("No listing or reciever provided");
    return;
  }

  try {
    const res = await fetch(`/addUserNotification/${receiverID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newNotif: {
          hasSeen: false,
          listing: listingID,
          notifType: type.name,
          createdAt: new Date(),
        },
      }),
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
