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

//console.log(`userID: ${userID}`)

// Render room links
let renderRoomLinks = function(userRooms) {
    //console.log(userRooms[0]["roomMembers"]);
    const cardTemplate = document.getElementById("convoCard");
    const container = document.getElementById("convoList");
    container.innerHTML = "";

    userRooms.forEach((room) => {
        let sellerData = room.roomMembers.find(member => member._id.toString() !== userID);
        let sellerIndex = room.roomMembers.findIndex(member => member._id.toString() === sellerData._id.toString());
        let unreadMessages = room.unread[sellerIndex];
        // console.log(room)
        // console.log(sellerData)
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
            console.log("room clicked");
            activeRoom = event.currentTarget.id;
            renderChat(activeRoom);
            console.log(`New active room: ${activeRoom}`)

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
let renderChat = function(selectedRoomID) {
    if(!selectedRoomID) {
        //empty state for chat
        emptyStateChat.classList.remove("hidden")
        return;
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
}


// Send message
let sendMessage = async function(roomID) {
    console.log(`Sending to ${roomID}`)
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
        
        // console.log(recipient)
        // console.log(currentRoom)
        // console.log(roomID)
        // console.log(messageContent)
        // console.log(recipientIndex)

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

    console.log(data);
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

    // If room ID of incoming message matches active room, append message box and reset unread to 0
    if(data.room == activeRoom) {

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
    else {
        // Else, increment unread count locally and update count div
        currentRoom.unread[recipientIndex]++;
        console.log(data.room)
        const roomCard = document.getElementById(data.room);
        roomCard.querySelector(".messageCount").querySelector("p").textContent = currentRoom.unread[recipientIndex];
        roomCard.querySelector(".messageCount").classList.add("bg-orange");
        roomCard.querySelector(".messageCount").classList.remove("bg-[#c7c7c7]");        
    }
});


// Initial page setup
let pageSetup = async function () {
    console.log("Page setup running")
    const data = await fetch("/getRooms");
    const roomsData = await data.json();
    userRooms = roomsData.sort((a,b) => {
        return new Date(b.chatLog.at(-1).date) - new Date(a.chatLog.at(-1).date);
    })
    
    if(userRooms.length > 0) {
        console.log(userRooms)
        renderRoomLinks(userRooms);
        renderChat(activeRoom);

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

