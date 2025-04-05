
function _(element) {
    return document.querySelector(element);
}

const csrfToken = _('meta[name="csrf-token"]').getAttribute('content'); // CSRF token for fetch API request or forms created using javascript.

// CODE TO TOGGLE LOGOUT POPUP.

// if logout button is clicked then the logout popup will show up.
_('.logout-btn').addEventListener("click", toggleLogoutPopup);

//function to make logout popup show up.
function toggleLogoutPopup() {
    const logoutPopupWrapper = _('.logout-popup-wrapper');
    logoutPopupWrapper.classList.toggle('active');
}

// if user clicks the no logout button the popup will disappear.
_('.logout-no').addEventListener('click', toggleLogoutPopup);


// GET ALL CONTACTS.

_('.contacts-btn').addEventListener('click', getAllContacts);

let allContacts = []; //variable to store all contacts;

const innerLeftPanelContent = _('.inner-left-panel-content'); // grabbing inner left panel to dynamically change its content.
const innerRightPanelContent = _('.inner-right-panel-content'); // grabbing inner right panel to dynamically chats.



//function to send request to get all contacts(users that are not the current logged in user).
function getAllContacts() {
    fetch('/get-all-contacts')
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok:', res.status);
        } else {
            return res.json();
        }
    })
    .then(data => {
        if (data.success) {
            console.log('Reques to get contacts was successfull');
            // storing all contacts in a previously created variable.
            allContacts = data.contacts;
            if (allContacts.length <= 0) {
                console.log('No contacts found');
                innerLeftPanelContent.innerHTML = `
                    <div style="display:flex; justify-content:center;  width:100%; margin-top:30%;">
                        <h1 style="font-size:3rem; font-weight:600;">No contacts to display</h1>
                    </div>
                `;
            } else {
                // if contacts were found then we will print them out and display them.
                displayContacts(allContacts);
                allContacts.forEach(contact => {
                    console.log(contact);
                })
            }
        }
    })
    .catch(err => {
        console.error(err);
    })
}

// when the script is first loaded the contacts is one of the first things we wanna get so when the page is reloaded the contacts are updated.
getAllContacts();



// function to display all contacts
function displayContacts(allContacts) {
    // clearing inner panels' content.
    innerLeftPanelContent.innerHTML = " ";
    innerRightPanelContent.innerHTML = " ";

    const contactsWrapper = document.createElement('ul');
    contactsWrapper.classList = 'contacts-wrapper';
    innerLeftPanelContent.appendChild(contactsWrapper);

    allContacts.forEach(contact => {
        const contactContainer = document.createElement('li');
        contactContainer.classList = 'contact-container';

        contactContainer.innerHTML = `

            <img src="/storage/profile_pics/male.jpeg" alt="profile pic" class="contacts-profile-pic">
            <h1 style="text-align:center; font-size:1.5rem; font-weight:500;" class="contact-name">${contact.name}<h1>
        `;

        contactsWrapper.appendChild(contactContainer);
    })
}

// CHAT CODE.

let currentChatContact;

_('.chat-btn').addEventListener('click', function () {
    showChat(currentChatContact);
});

function showChat(currentContact) {
    innerLeftPanelContent.innerHTML = '';

    const showInnerLeftPanelInput = document.querySelector('#show-inner-right-panel');
    showInnerLeftPanelInput.checked = true;

    // if no contact to chat with has been selected then a message will show up indicating so, otherwise
    // the selected contact info will show up.
    if (!currentContact) {
        innerLeftPanelContent.innerHTML = `
            <div style="padding:1rem;"> 
            <h1>No contact has been selected yet</h1>
            </div>
        `;

        innerRightPanelContent.innerHTML = `
            <h1 style="font-size:2.5rem; text-align:center; margin-top:4rem;">No messages to show<h1>
        `;
    } else {
        innerLeftPanelContent.innerHTML = `
            <section class="selected-contact-info">
                Now chatting with: 
                <img src="/storage/profile_pics/male.jpeg" class="selected-contact-pic">
                <h1>${currentContact.name}</h1>
                <h1>${currentContact.id}</h1>
            </section>
        `;

        innerRightPanelContent.innerHTML = `
            <div class="chat-header">
                <h1>${currentContact.name}</h1>
                
            </div>
            <div class="chat-messages-wrapper">
            </div>
            <div class="send-message-bar">
                <textarea placeholder="Type something" class="message-input"></textarea>
                <button class="send-message-btn">send</button>
            </div>
        `;

        getMessages();
    }
}

// checking to see if user clicks on a contacts.
document.querySelector(".inner-left-panel-content").addEventListener('click', e => {
    if (e.target.closest('.contact-container')) {
        getContactSelected(e);
    }
})

// function to get the selected contact info when the user clicks on a contacts
function getContactSelected(e) {
    const contactContainer = e.target.closest('.contact-container');
    const contactName = contactContainer.querySelector('.contact-name').textContent;

    const dataObj = {
        'contactName' : contactName
    };

    // getting contact/user instance depending on the contact name.
    fetch('/get-selected-contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify(dataObj)
    })
    .then(res => {
        if(!res.status) {
            throw new Error('Network response was not ok:', res.status);
        } else {
            return res.json();
        }
    })
    .then(data => {
        if (data.success) {
            currentChatContact = data.contact;
            console.log(currentChatContact.name);
            showChat(currentChatContact);
        }
    })
    .catch(err => {
        console.error(err);
    })

}


// SEND MESSAGE CODE.

// checking to see if user is clicking send message button to then trigger the send message algorithm.
innerRightPanelContent.addEventListener('click', e => {
    if (e.target.matches('.send-message-btn')) {
        getMessage();
    }
});

// function to get message.
function getMessage() {
    // using the innerRightPanelContent variable to grab the message-input element and then extract its content(message).
    const messageInput = innerRightPanelContent.querySelector('.message-input');
    const message = messageInput.value

    // if the message is empty then pretty much nothing will happen other than en error message being displayed in the console.
    if (!message) {
        console.log('message empty');
    } else{ // if there's a message then we move on to the next phase which will be storing it into our messages table.
        console.log(message);
        messageInput.value = '';
        saveMessageToTable(message);
    }
    

}

function saveMessageToTable(message) {

    const objData = {
        "message": message,
        'receiver_id' : currentChatContact.id
    };

    fetch('/save-message', {
        method: "POST",
        headers: {
            'Content-Type':'application/json',
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify(objData)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Network response was not ok:", res.ok);
        } else {
            return res.json();
        }
    })
    .then(data => {
        if (data.success) {
            console.log("message was saved");
            console.log('Message:', data.message);
            getMessages();
        }
    })
    .catch(error => {
        console.error(error);
    })
}

// CODE TO GET MESSAGES AND THEN DISPLAY THEM.


let allMessages; // this variable will store all messages corresponding with the current logged in user and the current chat contact .

function getMessages() {

    const dataObj = {
        'receiver' : currentChatContact.id
    }

    fetch('/get-messages', {
        method: "POST",
        headers: {
            'Content-Type':'application/json',
            'X-CSRF-TOKEN' : document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify(dataObj)
    })
    .then(res => {
        if (!res.json) {
            throw new Error('Network response was not ok:', res.status);
        } else {
            return res.json();
        }
    })
    .then(data => {
        if (data.success) {
            allMessages = data.messages;
            console.log('Messages:', allMessages);
            displayMessages(allMessages);
        }
    })
}

function displayMessages(messages) {

    console.log('Current receiver, Name:', currentChatContact.name, 'id:', currentChatContact.id);

    const messagesArea = _('.chat-messages-wrapper');
    messagesArea.innerHTML = "";



    messages.forEach(message => {
        let messageWrap;

        console.log('message receiver id:', message.receiver_id);

        if (message.receiver_id != currentChatContact.id) {
            messageWrap = document.createElement('div');
            // messageWrap.classList = 'message-wrap-left';
            messageWrap.innerHTML = leftMessageTemplate(message);
        } else {
            messageWrap = document.createElement('div');
            // messageWrap.classList = 'message-wrap-right';
            messageWrap.innerHTML = rightMessageTemplate(message);
        }

        
        messagesArea.appendChild(messageWrap);
        messagesArea.scrollTop = messagesArea.scrollHeight;
        
    })

    
}

function rightMessageTemplate(message) {

    const currentUsername = _('body').getAttribute('user-name');

    return `
        <div class="message-wrap-right">
        <h1 style="font-weight:500; color:rgb(0, 0, 0); text-align:center;">${currentUsername}</h1>
        <h1>${message.message}</h1>
        <span>${message.created_at}</span>
        </div>
    `;
}

function leftMessageTemplate(message) {
    return `
        <div class="message-wrap-left">
        <h1 style="font-weight:500; color:rgb(0, 0, 0); text-align:center;">${currentChatContact.name}</h1>
        <h1>${message.message}</h1>
        </div>
    `;
}

// SETTINGS CODE.

_('.settings-btn').addEventListener('click', showSettings);

function showSettings() {

    // clearing inner panels' content.
    innerLeftPanelContent.innerHTML = " ";
    innerRightPanelContent.innerHTML = " ";

    innerLeftPanelContent.innerHTML = `
    
        <div class="settings-wrapper">
            <h1 style="font-size:2rem; font-weight:600;">Settings</h1>

            <ul class="settings-list">
                <li class="dropdown">
                    <p>Change Username</p>
                     <div class="dropdown-menu">
                         <form action="/update-user-info" method="POST">
                            <input type="hidden" name="_token" value="${csrfToken}">
                            <label for="updated-name">Enter new username</label>
                            <input type="text" name="new-name" placeholder="New Name" id="updated-name" class="settings-new-field-update">
                            <button class="settings-save-btn">Save</button>
                        </form>
                    </div>
                    
                <li>
                <li class="dropdown">
                    <p>Change Email</p>
                    <div class="dropdown-menu">
                        <form action="/update-user-info" method="POST">
                            <input type="hidden" name="_token" value="${csrfToken}">
                            <label for="updated-email">Enter new Email</label>
                            <input type="text" name="new-email" placeholder="New Email" id="updated-email" class="settings-new-field-update">
                            <button class="settings-save-btn">Save</button>
                        </form>
                    </div>
                <li>
                <li class="dropdown">
                    <p>Change Password</p>
                    <div class="dropdown-menu">
                        <form action="/update-user-info" method="POST">
                            <input type="hidden" name="_token" value="${csrfToken}">
                            <label for="current-password">Enter current password</label>
                            <input type="password" name="current-password" placeholder="Current password" id="current-password" class="settings-new-field-update" required>

                            <label for="updated-password">Enter new password</label>
                            <input type="password" name="new_password" placeholder="New password" id="updated-password" class="settings-new-field-update" required>

                            <label for="confirm-password">Confirm new password</label>
                            <input type="password" name="new_password_confirmation" placeholder="Enter new pwd again" id="confirm-password" class="settings-new-field-update" required>
                            <button class="settings-save-btn">Save</button>
                        </form>
                    </div>
                <li>
                <li>-you joined on ${user.created_at}</li>
                <li>-account last uodated at ${user.updated_at}</li>
            </ul>
        </div>
    `;
}

// code for dropdown menus.

document.addEventListener('click', e => {
    const isDropdown = e.target.closest('.dropdown');


    let currentDropdown;
    if (isDropdown) {
        console.log('dropdown was clicked');
        currentDropdown =  isDropdown;
        currentDropdown.classList.add('active');
    }

    document.querySelectorAll('.dropdown').forEach(dropdown => {
        if (dropdown != currentDropdown) {
            dropdown.classList.remove('active');
        } else {
            return;
        }
    });




});

