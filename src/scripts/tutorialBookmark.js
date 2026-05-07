//Display tutorial
const bookmarkTutorial = async function() {
    const currentUser = await fetch("/user")
    if(!currentUser.tutorials.bookmark) {

        //Display tutorial
        let tutorialContainer = document.createElement("div");
        tutorialContainer.classList.add("tutorialContainer", "absolute", "bg-black/40", "flex", "top-0", "left-0", "px-10", "h-screen", "w-full", "z-25", "items-center", "justify-center");

        let stepOne = `
            <div id="stepOne" class="relative flex flex-col bg-white rounded-lg pb-5 px-10 pt-10 max-w-60 justify-center shadow-xl">
                <button class="closeButton absolute top-2 right-2 rounded-full w-7 h-7 bg-[#D9D9D9]"><img src="images/closeIcon.png" class="p-2"></button>
                <img src="images/tutorialBookmarkStep1.png" class="mb-5">
                <h2 class="text-lg text-bold text-center font-bold mb-5  leading-[1.1]">Select the bookmark button to add to your collection</h2>
                <button class="nextButtonTwo bg-[#FF6700] rounded-lg px-4 py-2 mb-5 text-white font-bold">Next</button>
                <div class="progressBar flex justify-center gap-2">
                    <div class="bg-[#FF6700] rounded-full h-2 w-2"></div>
                    <div class="bg-[#D9D9D9] rounded-full h-2 w-2"></div>
                </div>
            </div>
        `

        let stepTwo = `
            <div id="stepTwo" class="relative flex flex-col bg-white rounded-lg pb-5 px-10 pt-10 max-w-60 justify-center shadow-xl hidden">
                <button class="closeButton absolute top-2 right-2 rounded-full w-7 h-7 bg-[#D9D9D9]"><img src="images/closeIcon.png" class="p-2"></button>
                <img src="images/tutorialBookmarkStep2.png" class="mb-5">
                <h2 class="text-lg text-bold text-center font-bold mb-5  leading-[1.1]">View bookmarks in the saved tab</h2>
                <button class="closeButton bg-[#FF6700] rounded-lg px-4 py-2 mb-5 text-white font-bold">Close</button>
                <div class="progressBar flex justify-center gap-2">
                    <div class="bg-[#D9D9D9] rounded-full h-2 w-2"></div>
                    <div class="bg-[#FF6700] rounded-full h-2 w-2"></div>
                </div>
            </div>
        `

        tutorialContainer.innerHTML = stepOne + stepTwo;
        document.body.prepend(tutorialContainer);

        // Set bookmark tutorial to True
        const res = await fetch(`/updateUser/${currentUser._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "tutorials.bookmark": true
            })
        });
    }
    else {
        return;
    }
}


document.addEventListener("load", bookmarkTutorial())

document.addEventListener("click", async (event) => {
  if (event.target.closest(".closeButton")) {
    event.target.closest(".tutorialContainer").remove();
    return;
  }

  if (event.target.closest(".nextButtonTwo")) {
    event.target.closest("#stepOne").classList.toggle("hidden");
    document.getElementById("stepTwo").classList.toggle("hidden");
  }
});
