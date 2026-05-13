import {
  displaySimpleWindow,
  closePopupWindow,
  displayWindow,
} from "../scripts/popupWindow.js";
import {
  getDayName,
  getDayWithSuffix,
  getMonthName,
} from "../scripts/dateTime.js";
const bellSVG = [
  `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="currentColor"
        >
        <path d="M14.235 19c.865 0 1.322 1.024 .745 1.668a3.992 3.992 0 0 1 -2.98 1.332a3.992 3.992 0 0 1 -2.98 -1.332c-.552 -.616 -.158 -1.579 .634 -1.661l.11 -.006h4.471z" />
        <path d="M12 2c1.358 0 2.506 .903 2.875 2.141l.046 .171l.008 .043a8.013 8.013 0 0 1 4.024 6.069l.028 .287l.019 .289v2.931l.021 .136a3 3 0 0 0 1.143 1.847l.167 .117l.162 .099c.86 .487 .56 1.766 -.377 1.864l-.116 .006h-16c-1.028 0 -1.387 -1.364 -.493 -1.87a3 3 0 0 0 1.472 -2.063l.021 -.143l.001 -2.97a8 8 0 0 1 3.821 -6.454l.248 -.146l.01 -.043a3.003 3.003 0 0 1 2.562 -2.29l.182 -.017l.176 -.004z" />
        </svg>`,
  `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="currentColor"
        >
        <path d="M17.451 2.344a1 1 0 0 1 1.41 -.099a12.05 12.05 0 0 1 3.048 4.064a1 1 0 1 1 -1.818 .836a10.05 10.05 0 0 0 -2.54 -3.39a1 1 0 0 1 -.1 -1.41z" />
        <path d="M5.136 2.245a1 1 0 0 1 1.312 1.51a10.05 10.05 0 0 0 -2.54 3.39a1 1 0 1 1 -1.817 -.835a12.05 12.05 0 0 1 3.045 -4.065z" />
        <path d="M14.235 19c.865 0 1.322 1.024 .745 1.668a3.992 3.992 0 0 1 -2.98 1.332a3.992 3.992 0 0 1 -2.98 -1.332c-.552 -.616 -.158 -1.579 .634 -1.661l.11 -.006h4.471z" />
        <path d="M12 2c1.358 0 2.506 .903 2.875 2.141l.046 .171l.008 .043a8.013 8.013 0 0 1 4.024 6.069l.028 .287l.019 .289v2.931l.021 .136a3 3 0 0 0 1.143 1.847l.167 .117l.162 .099c.86 .487 .56 1.766 -.377 1.864l-.116 .006h-16c-1.028 0 -1.387 -1.364 -.493 -1.87a3 3 0 0 0 1.472 -2.063l.021 -.143l.001 -2.97a8 8 0 0 1 3.821 -6.454l.248 -.146l.01 -.043a3.003 3.003 0 0 1 2.562 -2.29l.182 -.017l.176 -.004z" />
        </svg>`,
];

const seedNotifications = [
  {
    message: "Someone commented on your listing.",
    hasSeen: false,
    listing: "680fa1d23c4b2a001f9d1003",
    createdAt: new Date(),
  },
  {
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    hasSeen: true,
    listing: "680fa1d23c4b2a001f9d1001",
    createdAt: new Date(),
  },
  {
    message: "Your item was successfully sold.",
    hasSeen: true,
    listing: "680fa1d23c4b2a001f9d1002",
    createdAt: new Date(),
  },
];

const formatWindow = (notificationItems) => {
  return `
    <div class="flex flex-col max-h-[75vh]">
      <div class="flex justify-between px-10 py-5 shrink-0">
        <h1>Notifications</h1>
        <div class="text-medium-grey">${bellSVG[0]}</div>
      </div>
      <div class="flex-1 overflow-y-auto overflow-x-hidden">
        ${notificationItems || `<div class="card-item px-10 text-light-brown">No notifications yet!</div>`}
      </div>
      <div class="border-b border-peach px-4 -mx-4 shrink-0"></div>
    </div>
  `;
};
const formatNotificationItem = (notification) => {
  const date = new Date(notification.createdAt);
  const month = getMonthName(date);
  const dayStr = getDayWithSuffix(date);
  const hasSeen = notification.hasSeen;
  return `<div class="card-item px-10 ">
          <p class="text-light-brown">${month} ${dayStr}</p>
          <h2 class="${hasSeen ? `text-black` : `text-orange`}">${notification.message}</h2>
        </div>`;
};

function notificationItems(notifications) {
  let output = "";
  notifications.forEach((notif) => {
    output += formatNotificationItem(notif);
  });
  return output;
}

function showWindow(notifications) {
  displayWindow(
    formatWindow(notificationItems(notifications)),
    [
      {
        label: "Close",
        color: "box-color-0",
        hover: "hover-outline",
        onClick: () => console.log("Close"),
      },
    ],
    true,
    `card md:max-w-1/4 max-w-1/2 md:min-w-2/5 min-w-3/4`,
  );
}

class NotificationButton extends HTMLElement {
  constructor() {
    super();
    this.user = null;
    this.userId = null;
    this.notifications = [];
    this.renderBtn();
    this.addEventListener("click", () => this.clickEvent());
  }
  // ======================
  // LOGIC
  // ======================
  async getUser() {
    try {
      const response = await fetch("/user");
      if (!response.ok) {
        console.log("No user found for this session");
        return;
      }
      const data = await response.json();

      if (
        data.notifications.length === 0 ||
        data.notifications.length !== seedNotifications.length
      ) {
        await seedNotifications(false);
      } else {
        this.user = data;
        this.notifications = data.notifications;
      }

      this.userId = this.user._id;
    } catch (error) {
      console.log(error);
    }
  }

  async clickEvent() {
    showWindow(this.notifications);

    if (!this.user) return;
    const updatedNotifications = this.notifications.map((notif) => ({
      ...notif,
      hasSeen: true,
    }));

    await fetch(`/updateUser/${this.userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notifications: updatedNotifications,
      }),
    });

    // update user info
    await this.getUser();
    this.renderBtn();
  }

  async seedNotifications(seed = true) {
    if (!seed) return;

    await fetch(`/updateUser/${data._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notifications: seedNotifications }),
    });

    const refreshed = await fetch("/user");
    const refreshedData = await refreshed.json();

    this.user = refreshedData;
    this.notifications = refreshedData.notifications;
  }
  // ======================
  // RENDER LOGIC
  // ======================

  async renderBtn() {
    await this.getUser();
    let hasUnreadNotifications = false;
    let buttonClass = `text-medium-grey hover:text-black`;
    if (this.user) {
      hasUnreadNotifications = this.notifications
        ? this.notifications.some((notif) => notif.hasSeen == false)
        : false;
      buttonClass = hasUnreadNotifications
        ? `text-orange hover:text-black`
        : `text-medium-grey hover:text-black`;
    }

    this.innerHTML = `
      <button class="${buttonClass} p-0">
      ${hasUnreadNotifications ? bellSVG[1] : bellSVG[0]}
      </button>
    `;
  }
}

customElements.define("notification-btn", NotificationButton);
