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

export async function newNotifForConnectedUsers(listingID, type) {
  try {
    const res = await fetch("/allUsers");
    if (!res.ok) {
      return;
    }
    const userData = await res.json();
    for (const user of userData) {
      const hasListing = user.savedItems.some(
        (item) => item.toString() === listingID.toString(),
      );
      if (hasListing) {
        await newNotification(user._id, listingID, type);
      }
    }
  } catch (err) {
    console.error("Network error loading users:", err);
  }
}

// Get the reciever from the listing ID thenn send the notif
export async function newNotificationWithGetReciever(listingID, type) {
  let listing = null;
  try {
    const res = await fetch(`/LoadListing/${listingID}`);
    if (res.ok) {
      listing = await res.json();
      newNotification(listing.seller, listingID, type);
    }
  } catch (err) {
    console.error("Network error loading listing:", listingID);
  }
}

// Generic new notif function. Sends a notification of the type and listing to the reciever
export async function newNotification(receiverID, listingID, type) {
  if (!listingID || !receiverID) {
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
  } catch (err) {
    console.error(err);
  }
}
