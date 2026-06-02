//const socket = io();
//console.log("chat javascript running")
const socket = io("http://localhost:3001", {
  withCredentials: true
});
socket.emit("joinUserRooms");

console.log("line 8 reached")

const userResponse = await fetch("/user");
const userData = await userResponse.json();
const userID = userData._id;

console.log(`userID: ${userID}`)

let renderRoomLinks = function(userRooms) {
    console.log(userRooms[0]["roomMembers"]);
    const cardTemplate = document.getElementById("convoCard");
    const container = document.getElementById("convoList");
    container.innerHTML = "";

    userRooms.forEach((room) => {
        let sellerData = room.roomMembers.find(member => member._id.toString() !== userID);
        let sellerIndex = room.roomMembers.findIndex(member => member._id.toString() === sellerData._id.toString());
        let unreadMessages = room.unread[sellerIndex];
        console.log(room)
        console.log(sellerData)
        console.log(sellerIndex)
        console.log(unreadMessages)

        //clone template and fill data
        const clone = cardTemplate.content.cloneNode(true);
        clone.querySelector(".sellerImage").src = sellerData.profilePicture;
        clone.querySelector(".sellerName").textContent = sellerData.name;
        clone.querySelector(".sellerLocation").textContent = sellerData.city;
        clone.querySelector(".messageCount").classList.add(unreadMessages == 0 ? "bg-[#c7c7c7]" : "bg-orange");
        clone.querySelector(".messageCount p").textContent = unreadMessages;

        clone.addEventListener("click", async => {
            fetch(`/chats/${room._id}`);
        })

        container.appendChild(clone);
    })
    
}

let pageSetup = async function () {
    console.log("Page setup running")
    const data = await fetch("/getRooms");
    const userRooms = await data.json();

    //Add list of rooms to page
    renderRoomLinks(userRooms);
}

pageSetup();


// document.getElementById("messageButton").addEventListener("click", async () => {
//     const sellerID = document.getElementById("messageButton").dataset.sellerId;

//     const response = await fetch(".chats", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({sellerID})
//     });

//     //window.location.href = "/chats"
// });

socket.emit("message", "Hi!")