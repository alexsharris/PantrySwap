import "./notificationButton.js";

class Navbar extends HTMLElement {
  constructor() {
    super();
    this.renderNavbar();
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
                        <button class="hover:bg-[#F6E8E8] text-[#9B9B9B] hover:text-[#FF6700] rounded-lg p-2 min-w-18" id="buyBtnDesktop">
                        Buy
                        </button>
                        <button class="hover:bg-[#F6E8E8] text-[#9B9B9B] hover:text-[#FF6700] rounded-lg p-2 min-w-18" id="sellBtnDesktop">
                        Sell
                        </button>
                        <button class="hover:bg-[#F6E8E8] text-[#9B9B9B] hover:text-[#FF6700] rounded-lg p-2 min-w-18" id="savedBtnDesktop">
                        Saved
                        </button>
                        <button class="hover:bg-[#F6E8E8] text-[#9B9B9B] hover:text-[#FF6700] rounded-lg p-2 min-w-18" id="accountBtnDesktop">
                        Account
                        </button>
                
                    </div>
                </div>
                <notification-btn></notification-btn>
            </div>
        </div>

        <div class="flex w-screen justify-between gap-2 visible md:hidden fixed inset-x-0 bottom-0 right-0 left-0 bg-white md:relative h-16 p-2 ">
            <button class="hover:bg-[#F6E8E8] text-[#9B9B9B] hover:text-[#FF6700] rounded-lg p-2 min-w-18" id="buyBtnDesktop">
            Buy
            </button>
            <button class="hover:bg-[#F6E8E8] text-[#9B9B9B] hover:text-[#FF6700] rounded-lg p-2 min-w-18" id="sellBtnDesktop">
            Sell
            </button>
            <button class="hover:bg-[#F6E8E8] text-[#9B9B9B] hover:text-[#FF6700] rounded-lg p-2 min-w-18" id="savedBtnDesktop">
            Saved
            </button>
            <button class="hover:bg-[#F6E8E8] text-[#9B9B9B] hover:text-[#FF6700] rounded-lg p-2 min-w-18" id="accountBtnDesktop">
            Account
            </button>
        </div>
    </nav>
    `;
  }
}

// bg-[#FF6700]

customElements.define("site-navbar", Navbar);
