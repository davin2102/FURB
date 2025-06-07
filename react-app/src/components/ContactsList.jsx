import React from "react";
import "./ContactsList.css"; // Create this CSS file for styling

// The component receives the list of users and a function to handle selection
const ContactsList = ({ users, onSelectUser, selectedUserId }) => {
  return (
    <div className="contacts-list-container">
      <h2>Contacts</h2>
      <ul className="contacts-list">
        {users.map((user) => (
          <li
            key={user.id}
            className={user.id === selectedUserId ? "selected" : ""}
            onClick={() => onSelectUser(user)} // Pass the whole user object on click
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactsList;
