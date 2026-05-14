const bookmarkSVG = `<svg 
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 shrink-0"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>`;

export const ButtonStyle = Object.freeze({
  SMALL: {
    name: "SMALL",
    saveClass: "bg-white text-black hover-outline p-4 rounded-full",
    saveText: "",
    unsaveClass: "bg-white text-orange hover-outline p-4 rounded-full",
    unsaveText: "",
  },

  FULL: {
    name: "FULL",
    saveClass: "box-color-0 hover-bright",
    saveText: "Save for Later",
    unsaveClass: "box-color-2 hover-bright",
    unsaveText: "Remove Bookmark",
  },
});

class bookmarkButton extends HTMLElement {
  constructor() {
    super();

    this.user = null;
    this.userId = null;
    this.listingId = this.getAttribute("listing-id");
    this.saveState = false;

    this.buttonStyle =
      ButtonStyle[this.getAttribute("button-style")] || ButtonStyle.SMALL;

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
      this.user = data;
      this.userId = this.user._id;
      this.notifications = data.notifications;
    } catch (error) {
      console.log(error);
    }
  }

  async clickEvent() {
    this.saveState = !this.saveState;
    this.renderBtn();
  }
  // ======================
  // RENDER LOGIC
  // ======================

  async renderBtn() {
    console.log(this.saveState);
    this.innerHTML = `
    <button class="${
      this.saveState ? this.buttonStyle.unsaveClass : this.buttonStyle.saveClass
    }">
      <div class="flex gap-2">
        ${bookmarkSVG}
        ${
          this.saveState
            ? this.buttonStyle.unsaveText
            : this.buttonStyle.saveText
        }
      </div>
    </button>
  `;
  }
}

customElements.define("bookmark-btn", bookmarkButton);
