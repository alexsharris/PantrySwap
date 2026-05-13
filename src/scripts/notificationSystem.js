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
export async function newNotification(receiver, type, listing) {
  if (!listing || !reciever) {
    console.log("No listing or reciever provided");
    return;
  }

  await fetch(`/updateUser/${receiver._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      newNotif: {
        hasSeen: false,
        listing,
        notifType: type.name,
        createdAt: new Date(),
      },
    }),
  });
}
