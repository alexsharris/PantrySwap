const bookmarkTutorial = async function() {
    const currentUser = await fetch("/user")
    if(!currentUser.tutorials.bookmark) {

        //Display tutorial
        let card = document.createElement("div");

        let step1 = `
            <div>

            </div>
        `

        // Set bookmark tutorial to True
        const res = await fetch(`/updateUser/id=${currentUser._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: currentUser.name,
                tutorials: {bookmark: true}
            })
        });
    }
    
    else {
        return;
    }
}

const createStep = function() {

}

document.addEventListener("load", bookmarkTutorial())