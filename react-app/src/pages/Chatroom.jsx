import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./Chatroom.css";
import HeaderLogin from "../components/HeaderLogin";

const SOCKET_URL = "http://localhost:5001";

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.email ? user.email.split("@")[0] : "User";
  });

  const [allUsers, setAllUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch(`${SOCKET_URL}/api/all-users`)
      .then((res) => res.json())
      .then((users) => {
        setAllUsers(users.filter((u) => u !== username));
      })
      .catch((err) => console.error("Failed to fetch all users:", err));

    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("register", username);

    socketRef.current.on("online-users", (onlineUserList) => {
      setOnlineUsers(onlineUserList);
    });

    socketRef.current.on("chat message", (msg) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, msg];
        return newMessages;
      });
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [username]);

  useEffect(() => {
    if (selectedUser) {
      fetch(
        `${SOCKET_URL}/messages?user1=${username}&user2=${selectedUser.name}`
      )
        .then((res) => res.json())
        .then((history) => setMessages(history))
        .catch((err) => console.error("Failed to fetch message history:", err));
    } else {
      setMessages([]);
    }
  }, [selectedUser, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  const handleSelectUser = (user) => {
    setSelectedUser({ name: user });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser) return;
    const msg = { user: username, text: input.trim(), to: selectedUser.name };
    socketRef.current.emit("private message", msg);
    setInput("");
  };

  const latestMessages = {};
  messages.forEach((msg) => {
    const contact = msg.user === username ? msg.to : msg.user;
    if (!latestMessages[contact] || msg.id > latestMessages[contact].id) {
      latestMessages[contact] = msg;
    }
  });

  const filteredMessages = messages.filter(msg =>
    (msg.user === username && msg.to === selectedUser?.name) ||
    (msg.user === selectedUser?.name && msg.to === username)
  );

  return (
    <div className="app-layout">
      <HeaderLogin />
      <div className="chatroom-container">
        <h2 className="chatroom-title">
          {selectedUser
            ? `Chat with ${selectedUser.name}`
            : "Select a user to chat"}
        </h2>
        <div className="chatroom-flex-row">
          <div className="chatroom-userlist">
            <div className="chatroom-userlist-title">Contacts</div>
            <ul className="chatroom-userlist-list">
              {allUsers.map((user) => (
                <li
                  key={user}
                  className={`chatroom-userlist-item${
                    selectedUser?.name === user ? " selected" : ""
                  }`}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="chatroom-userlist-user-info">
                    <span
                      className={`online-indicator ${
                        onlineUsers.includes(user) ? "online" : ""
                      }`}
                    ></span>
                    <span className="chatroom-userlist-username">{user}</span>
                  </div>
                  {latestMessages[user] && (
                    <div className="chatroom-userlist-latest-message">
                      <span className="chatroom-userlist-latest-message-user">
                        {latestMessages[user].user === username ? "You: " : ""}
                      </span>
                      <span className="chatroom-userlist-latest-message-text">
                        {latestMessages[user].text}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="chatroom-main">
            <div className="chatroom-messages">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chatroom-message ${
                    msg.user === username ? "bubble-self" : "bubble-other"
                  }`}
                >
                  <span className="chatroom-message-user">
                    {msg.user === username ? "You" : msg.user}
                  </span>
                  <span className="chatroom-message-bubble">{msg.text}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="chatroom-form">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  selectedUser
                    ? `Message ${selectedUser.name}...`
                    : "Select a user to begin"
                }
                className="chatroom-input"
                disabled={!selectedUser}
              />
              <button
                type="submit"
                className="chatroom-send-btn"
                disabled={!selectedUser}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;