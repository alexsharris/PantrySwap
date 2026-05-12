import "./notificationButton.js";

const buttonIDs = {
  buy: ["buyBtnDesktop", "buyBtnMobile"],
  sell: ["sellBtnDesktop", "sellBtnMobile"],
  saved: ["savedBtnDesktop", "savedBtnMobile"],
  account: ["accountBtnDesktop", "accountBtnMobile"],
};

class Navbar extends HTMLElement {
  constructor() {
    super();
    this.renderNavbar();
    this.addEventListeners();

    const activeButton = this.getCurrentPageButton();
    if (activeButton) {
      this.visuallySelectButton(activeButton);
    }
  }

  renderNavbar() {
    this.innerHTML = `
    <nav class="bg-white text-[#FF6700] font-extrabold z-20 relative p-6 md:drop-shadow-xl">
        <div class="flex min-w-full md:relative md:w-auto justify-between">
            <div class="flex gap-2 text-2xl self-center">
                <img src="/images/Pantry_Swap_Icon.png" class="size-9">
                <h1>
                Pantry Swap
                </h1>
            </div>
            <div class="flex justify-end gap-3">
                <div class="flex gap-12 self-center">
                    <div class="flex gap-6 md:visible md:w-auto w-0 invisible">
                        <button class="box-color-5 hover:text-orange hover:bg-peach" id="${buttonIDs.buy[0]}">
                        Buy
                        </button>
                        <button class="box-color-5 hover:text-orange hover:bg-peach" id="${buttonIDs.sell[0]}">
                        Sell
                        </button>
                        <button class="box-color-5 hover:text-orange hover:bg-peach" id="${buttonIDs.saved[0]}">
                        Saved
                        </button>
                        <button class="box-color-5 hover:text-orange hover:bg-peach" id="${buttonIDs.account[0]}">
                        Account
                        </button>
                
                    </div>
                </div>
                <notification-btn></notification-btn>
            </div>
        </div>

        <div class="flex w-screen justify-between gap-2 visible md:hidden fixed inset-x-0 bottom-0 right-0 left-0 bg-white md:relative h-16 p-2 ">
            <button class="box-color-5 hover:text-orange hover:bg-peach" id="${buttonIDs.buy[1]}">
            Buy
            </button>
            <button class="box-color-5 hover:text-orange hover:bg-peach" id="${buttonIDs.sell[1]}">
            Sell
            </button>
            <button class="box-color-5 hover:text-orange hover:bg-peach" id="${buttonIDs.saved[1]}">
            Saved
            </button>
            <button class="box-color-5 hover:text-orange hover:bg-peach" id="${buttonIDs.account[1]}">
            Account
            </button>
        </div>
    </nav>
    `;
  }

  addEventListeners() {
    const routes = {
      buy: "/buy",
      sell: "/sell",
      saved: "/bookmark",
      account: "/account",
    };

    const navigateIfNeeded = (path) => {
      if (window.location.pathname.toLowerCase() !== path.toLowerCase()) {
        window.location.href = path;
      }
    };

    Object.entries(buttonIDs).forEach(([key, ids]) => {
      ids.forEach((id) => {
        this.querySelector(`#${id}`)?.addEventListener("click", () => {
          navigateIfNeeded(routes[key]);
        });
      });
    });
  }

  visuallySelectButton(activeKey) {
    Object.entries(buttonIDs).forEach(([key, ids]) => {
      ids.forEach((id) => {
        const button = this.querySelector(`#${id}`);

        if (!button) return;

        if (key === activeKey) {
          button.classList.add("text-orange", "bg-peach");
          button.classList.remove("box-color-5");
        } else {
          button.classList.remove("text-orange", "bg-peach");
          button.classList.add("box-color-5");
        }
      });
    });
  }

  getCurrentPageButton() {
    const path = window.location.pathname.toLowerCase();

    if (path.startsWith("/buy")) return "buy";
    if (path.startsWith("/sell")) return "sell";
    if (path.startsWith("/bookmark")) return "saved";
    if (path.startsWith("/account")) return "account";

    return null;
  }
}

customElements.define("site-navbar", Navbar);
