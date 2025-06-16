/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./Chatroom.css";
import HeaderLogin from "../components/HeaderLogin";
import { useLocation } from "react-router-dom";

const SOCKET_URL = "http://localhost:5001";

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.email ? user.email : "User"; // Use full email!
  });

  const [allUsers, setAllUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    fetch(`${SOCKET_URL}/api/all-users`)
      .then((res) => res.json())
      .then((users) => {
        setAllUsers(users.filter((u) => u.email !== username));
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
        `${SOCKET_URL}/messages?user1=${username}&user2=${selectedUser.email}`
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
    setSelectedUser(user);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser) return;
    const msg = { user: username, text: input.trim(), to: selectedUser.email };
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
    (msg.user === username && msg.to === selectedUser?.email) ||
    (msg.user === selectedUser?.email && msg.to === username)
  );

  useEffect(() => {
    if (location.state && location.state.selectedUser) {
      setSelectedUser(location.state.selectedUser);
    }
  }, [location.state]);

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
                  key={user.email}
                  className={`chatroom-userlist-item${
                    selectedUser?.email === user.email ? " selected" : ""
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="chatroom-userlist-user-info">
                    <span
                      className={`online-indicator ${onlineUsers.includes(user.email) ? "online" : ""}`}
                      title={onlineUsers.includes(user.email) ? "Online" : "Offline"}
                    ></span>
                    <span className="chatroom-userlist-username">{user.name}</span>
                  </div>
                  {latestMessages[user.email] && (
                    <div className="chatroom-userlist-latest-message">
                      <span className="chatroom-userlist-latest-message-user">
                        {latestMessages[user.email].user === username ? "You: " : ""}
                      </span>
                      <span className="chatroom-userlist-latest-message-text">
                        {latestMessages[user.email].text}
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
              <div className="chatroom-input-wrapper">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="chatroom-input"
                />
                <button type="submit" className="chatroom-send-btn">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;