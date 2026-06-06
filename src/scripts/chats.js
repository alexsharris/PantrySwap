//const socket = io();
//console.log("chat javascript running")
const socket = io("http://localhost:3001", {
  withCredentials: true
});

socket.emit("joinUserRooms");

const userResponse = await fetch("/user");
const userData = await userResponse.json();
const userID = userData._id;
let userRooms = null;
let activeRoom = activeRoomDiv.textContent;

console.log(`userID: ${userID}`)

// Render room links
let renderRoomLinks = function(userRooms) {
    //console.log(userRooms[0]["roomMembers"]);
    const cardTemplate = document.getElementById("convoCard");
    const container = document.getElementById("convoList");
    container.innerHTML = "";

    userRooms.forEach((room) => {
        let sellerData = room.roomMembers.find(member => member._id.toString() !== userID);
        let recipientIndex = room.roomMembers.findIndex(member => member._id.toString() !== sellerData._id.toString());
        let unreadMessages = room.unread[recipientIndex];
        // console.log(room)
        console.log(sellerData)
        // console.log(sellerIndex)
        // console.log(unreadMessages)

        //clone template and fill data
        const clone = cardTemplate.content.cloneNode(true);
        clone.querySelector(".convoCard").id = room._id;
        clone.querySelector(".sellerImage").src = sellerData.profilePicture || "/images/sample-portrait-default.jpg";
        clone.querySelector(".sellerName").textContent = sellerData.name;
        clone.querySelector(".sellerLocation").textContent = sellerData.city;
        clone.querySelector(".messageCount").classList.add(unreadMessages == 0 ? "bg-[#c7c7c7]" : "bg-orange");
        clone.querySelector(".messageCount p").textContent = unreadMessages;

        // Show corresponding room if selected
        clone.querySelector(".convoCard").addEventListener("click", (event) => {

            document.getElementById("convoContainer").classList.remove("hidden");

            if(window.innerWidth < 768) {
                document.getElementById("backButton").classList.remove("hidden")
            }

            //console.log("room clicked");
            activeRoom = event.currentTarget.id;
            renderChat(activeRoom);
            //console.log(`New active room: ${activeRoom}`)

            // Unhighlight all rooms, 
            const cardDivs = document.querySelectorAll(".convoCard")
            cardDivs.forEach((card) => {
                card.querySelector("div").classList.remove("bg-orange");
                card.classList.remove("convoCardActive");
            })

            // Highlight active room, 
            const activeDiv = document.getElementById(activeRoom)
            if(activeDiv) {
                activeDiv.classList.add("convoCardActive");
                activeDiv.querySelector("div").classList.add("bg-orange");
            } 
        })

        container.appendChild(clone);
    })  
}

// Render chat log
let renderChat = async function(selectedRoomID) {

    if(!selectedRoomID) {
        // Empty state for chat
        emptyStateChat.classList.remove("hidden")
        //document.getElementById("convoContainer").classList.add("hidden");
        return;
    }

    // Reset unread count if not zero in current room for current user
    const currentRoom = userRooms.find(room => room._id.toString() === selectedRoomID);
    const userIndex = currentRoom.roomMembers.findIndex(member => member._id.toString() === userID);

    console.log(`Rendering: ${currentRoom._id}`)
    console.log(`Unread count: ${currentRoom.unread[userIndex]}`)

    //console.log(currentRoom.unread[userIndex]);

    if (currentRoom.unread[userIndex] > 0) {
        console.log("Condition Met")
        try {
            const response = await fetch(`/resetUnread`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                roomID: selectedRoomID,
                recipientIndex: userIndex
            }),
            });

            if (response.ok) console.log("Unread reset");   
            else console.error("Failed to reset count"); 
        }
        catch (err) {
            console.error("Network error:", err);
        }    

        // Reset in local copy and modify CSS
        
        const roomCard = document.getElementById(activeRoom);
        roomCard.querySelector(".messageCount").querySelector("p").textContent = 0;
        roomCard.querySelector(".messageCount").classList.remove("bg-orange");
        roomCard.querySelector(".messageCount").classList.add("bg-[#c7c7c7]");
    }


    const convoContainer = document.getElementById("convoContainer");
    convoContainer.innerHTML = "";
    let chatData = userRooms.find(room => room._id.toString() === selectedRoomID);

    // chatData = userRooms[0];
    // activeRoom = userRooms[0]._id.toString();
    
    // Create chat header
    const cloneHeader = chatHeaderTemplate.content.cloneNode(true);
    const createdDate = new Date(chatData.dateCreated);
    cloneHeader.querySelector("#chatHeaderText").textContent = `Chat started on ${
        createdDate.toLocaleDateString("en-CA", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }`;
    convoContainer.appendChild(cloneHeader)

    chatData.chatLog.forEach((message) => {
        // format as sender
        if(message.senderID == userID) {
            const cloneSender = senderTemplate.content.cloneNode(true);
            const messageDate = new Date(message.date);
            cloneSender.querySelector(".sentMessage").textContent = message.message;
            cloneSender.querySelector(".messageDate").textContent = messageDate.toLocaleDateString("en-CA", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
            convoContainer.appendChild(cloneSender);
        }
        // format as recipient
        else {
            const cloneRecipient = recipientTemplate.content.cloneNode(true);
            const messageDate = new Date(message.date);
            cloneRecipient.querySelector(".receivedMessage").textContent = message.message;
            cloneRecipient.querySelector(".messageDate").textContent = messageDate.toLocaleDateString("en-CA", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
            convoContainer.appendChild(cloneRecipient);
        }
    })

    // Render text box
    const cloneNewMessageBox = newMessageTemplate.content.cloneNode(true);
    cloneNewMessageBox.getElementById("senderProfileImage").src = userData.profilePicture;
    cloneNewMessageBox.querySelector("button").id = `sendTo-${chatData._id}`
    convoContainer.appendChild(cloneNewMessageBox);

    convoContainer.scrollTop = convoContainer.scrollHeight;

}


// Send message
let sendMessage = async function(roomID) {
    //console.log(`Sending to ${roomID}`)
    const messageContent = document.getElementById("newMessage").value;

    if(!messageContent) {
        errorMessage.classList.remove("hidden");
        return
    }
    else {
        //Hide error message if there is one
        errorMessage.classList.add("hidden");

        // console.log(userRooms)

        // Add new message to database
        const currentRoom = userRooms.find(room => room._id.toString() === roomID)
        const recipient = currentRoom.roomMembers.find(member => member._id.toString() !== userID);
        const recipientIndex = currentRoom.roomMembers.findIndex(member => member._id.toString() === recipient._id.toString());
        
        console.log(`RecipientID: ${recipient._id}`)
        console.log(currentRoom.roomMembers)
        // console.log(roomID)
        // console.log(messageContent)
        //console.log(recipientIndex)

        try {
            const response = await fetch(`/newMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                roomID: roomID,
                message: messageContent,
                date: Date.now(),
                recipientIndex: recipientIndex
              }),
            });

            if (response.ok) console.log("Message saved");   
            else console.error("Failed to save message");  
        }
        catch (err) {
            console.error("Network error:", err);
        }     

        // Emit to socket
        socket.emit("message", {messageContent: messageContent, room: roomID, senderID:userID, date: Date.now()})

        // Save to local copy
        currentRoom.chatLog.push({
            senderID: userID,
            date: Date.now(),
            message: messageContent
        })

        //console.log(userRooms);

    }
}


// Receive message
socket.on("message", async (data) => {

    //console.log(`Received message data: ${data}`);
    const messageBox = document.querySelector(".newMessageBox");

    // Save message to local data
    const currentRoom = userRooms.find(room => room._id.toString() === data.room)
    const recipient = currentRoom.roomMembers.find(member => member._id.toString() !== userID);
    const recipientIndex = currentRoom.roomMembers.findIndex(member => member._id.toString() === recipient._id.toString());

    currentRoom.chatLog.push({
        senderID: data.senderID,
        date: Date.now(),
        message: data.messageContent
    })

    // console.log(`Room: ${data.room}`)
    // console.log(`Active Room: ${activeRoom}`)
    // console.log(`SenderID: ${data.senderID}`)
    // console.log(`User ID: ${userID}`)

    // If received by user that didn't send the message, render new messages and reset unread to 0
    if(data.room == activeRoom && data.senderID !== userID) {

        console.log("reset route triggered");
        // Reset unread count in DB
        try {
            const response = await fetch(`/resetUnread`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                roomID: data.room,
                recipientIndex: recipientIndex
              }),
            });

            if (response.ok) console.log("Unread reset");   
            else console.error("Failed to reset count");  
        }
        catch (err) {
            console.error("Network error:", err);
        }    

        // Reset in local copy
        currentRoom.unread[recipientIndex] = 0;

        // format as sender
        if(data.sender == userID) {
            const cloneSender = senderTemplate.content.cloneNode(true);
            cloneSender.querySelector(".sentMessage").textContent = data.messageContent;
            cloneSender.querySelector(".messageDate").textContent = new Date(data.date).toLocaleDateString("en-CA", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
            messageBox.before(cloneSender);
        }
        // format as recipient
        else {
            const cloneRecipient = recipientTemplate.content.cloneNode(true);
            cloneRecipient.querySelector(".receivedMessage").textContent = data.messageContent;
            cloneRecipient.querySelector(".messageDate").textContent = new Date(data.date).toLocaleDateString("en-CA", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
            messageBox.before(cloneRecipient);
        }
    }
    // If received by the same user that sent the message
    else if (data.room == activeRoom && data.senderID == userID){
        // format as sender
        if(data.senderID == userID) {
            const cloneSender = senderTemplate.content.cloneNode(true);
            cloneSender.querySelector(".sentMessage").textContent = data.messageContent;
            cloneSender.querySelector(".messageDate").textContent = new Date(data.date).toLocaleDateString("en-CA", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
            messageBox.before(cloneSender);
        }
        // format as recipient
        else {
            const cloneRecipient = recipientTemplate.content.cloneNode(true);
            cloneRecipient.querySelector(".receivedMessage").textContent = data.messageContent;
            cloneRecipient.querySelector(".messageDate").textContent = new Date(data.date).toLocaleDateString("en-CA", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
            messageBox.before(cloneRecipient);
        }
    }
    else {
        // Else, increment unread count locally to match DB and update count div
        currentRoom.unread[recipientIndex]++;
        console.log(`Unread incremented: ${currentRoom.unread}`)
        const roomCard = document.getElementById(data.room);
        roomCard.querySelector(".messageCount").querySelector("p").textContent = currentRoom.unread[recipientIndex];
        roomCard.querySelector(".messageCount").classList.add("bg-orange");
        roomCard.querySelector(".messageCount").classList.remove("bg-[#c7c7c7]");        
    }

    document.getElementById("convoContainer").scrollTop = document.getElementById("convoContainer").scrollHeight;
});


// Initial page setup
let pageSetup = async function () {
    //console.log("Page setup running")
    const data = await fetch("/getRooms");
    const roomsData = await data.json();
    userRooms = roomsData.sort((a,b) => {
        return new Date(b.chatLog.at(-1).date) - new Date(a.chatLog.at(-1).date);
    })
    
    if(userRooms.length > 0) {
        //console.log(userRooms)
        renderRoomLinks(userRooms);
        if(window.innerWidth < 768) {
            document.getElementById("convoContainer").classList.add("hidden");
            backButton.classList.add("hidden");
        }
        else {
            renderChat(activeRoom);
        }
        
        // Highlight active room
        let selectedDiv = document.getElementById(`${activeRoom}`)
        if(selectedDiv) {
            selectedDiv.classList.add("convoCardActive");
            selectedDiv.querySelector("div").classList.add("bg-orange");
        } 
    }
    else {
        emptyStatePage.classList.remove("hidden")
    }    
}

pageSetup();


// Event delegation for send message button
document.addEventListener("click", (event) => {
    const button = event.target.closest(".messageButton");
    if (!button) return;
    const sendTo = button.id.split("-")[1];
    sendMessage(sendTo);
});


// Event listener for back button
document.getElementById("backButton").addEventListener("click", (event) => {

    document.getElementById("convoContainer").classList.add("hidden");
    event.currentTarget.classList.add("hidden")

    // Deselect active room
    const activeDiv = document.getElementById(activeRoom);
    if(activeDiv) {
        activeDiv.classList.remove("convoCardActive");
        activeDiv.querySelector("div").classList.remove("bg-orange");
    }
    
    activeRoom = null;

    // Clear chat container
    document.getElementById("convoContainer").innerHTML = "";

})


// Event listener for window width
let currentWidth = window.innerWidth;

window.addEventListener("resize", () => {
    currentWidth = window.innerWidth;
    // Sizing up with active room
    if(currentWidth > 768) {
        document.getElementById("convoContainer").classList.remove("hidden");
    }
    // Sizing up with no active room
    if(currentWidth > 768 && !activeRoom) {
        document.getElementById("convoContainer").classList.remove("hidden");
        const emptyStateTemplate = document.getElementById("emptyStateChatTemplate");
        const emptyStateClone = emptyStateTemplate.content.cloneNode(true);
        document.getElementById("convoContainer").appendChild(emptyStateClone);
    }
    // Sizing down with no active room
    if(currentWidth < 768 && !activeRoom) {
        document.getElementById("convoContainer").classList.add("hidden")
        backButton.classList.add("hidden");
    }
    // Sizing down with active room
    if(currentWidth < 768 && activeRoom) {
        backButton.classList.remove("hidden");
    }
});