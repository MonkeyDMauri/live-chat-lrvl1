
function _(element) {
    return document.querySelector(element);
}

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
    // clearing inner left panel's content.
    innerLeftPanelContent.innerHTML = " ";

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

    if (!currentContact) {
        innerLeftPanelContent.innerHTML = `
            <div style="padding:1rem;"> 
            <h1>No contact has been selected yet</h1>
            </div>
        `;
    } else {
        innerLeftPanelContent.innerHTML = `
            <section class="selected-contact-info">
                <img src="/storage/profile_pics/male.jpeg" class="selected-contact-pic">
                <h1>${currentContact.name}</h1>
            </section>
        `;
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
