import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null); // שימוש ב-ref כדי לשמור על stompClient ללא רינדורים חוזרים

  useEffect(() => {
    if (stompClientRef.current) return; // אם כבר קיים חיבור, לא להתחבר שוב

    const socket = new SockJS("http://localhost:8080/ws");
    const stomp = Stomp.over(socket);
    stomp.connect({}, () => {
      console.log("Connected to WebSocket");

      stomp.subscribe("/topic/public", (msg) => {
        setMessages((prevMessages) => {
          const newMessage = JSON.parse(msg.body);

          // בדיקה למניעת כפילות (בודק אם כבר קיימת הודעה עם אותו תוכן)
          if (
            !prevMessages.some(
              (m) =>
                m.sender === newMessage.sender &&
                m.content === newMessage.content
            )
          ) {
            return [...prevMessages, newMessage];
          }
          return prevMessages;
        });
      });

      stompClientRef.current = stomp; // שמור את החיבור ב-ref
      setConnected(true);
    });

    return () => {
      if (stompClientRef.current) {
        console.log("Disconnecting WebSocket");
        stompClientRef.current.disconnect();
        stompClientRef.current = null;
      }
    };
  }, []); // רץ רק פעם אחת

  const sendMessage = () => {
    if (stompClientRef.current && message.trim() !== "") {
      const chatMessage = {
        sender: username,
        content: message,
        type: "CHAT",
      };
      stompClientRef.current.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify(chatMessage)
      );
      setMessage("");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>WebSocket Chat</h2>
      {!connected ? <p>Connecting...</p> : <p>Connected</p>}
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div
        style={{
          border: "1px solid black",
          height: "300px",
          overflowY: "scroll",
          margin: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatApp;
