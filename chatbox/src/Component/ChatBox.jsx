import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Conversation,
} from "@chatscope/chat-ui-kit-react";
import { useState } from "react";

const ChatBox = () => {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, Welcome to Mentor Connect AI",
      sender: "Gemenei",
      direction: "incoming",
    },
  ]);
  //console.log(messages);
  const handleSend = async (msg) => {
    const newMessage = {
      message: msg,
      sender: "User",
      direction: "outgoing",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setTyping(true);

    const fullConversation = [...messages, newMessage]
      .map((m) => `${m.message}`)
      .join("\n");
    //console.log(fullConversation);
    const data = {
      message: fullConversation,
    };

    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        const aiMessage = {
          message: result.response.response.candidates[0].content.parts[0].text,
          sender: "Gemenei",
          direction: "incoming",
        };
        //console.log(messages);
        //console.log(result.response.response.candidates[0].content.parts[0].text);
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: "Error: Failed to get a response.",
            sender: "Gemenei",
            direction: "incoming",
          },
        ]);
      }
    } catch (error) {
      console.error("Fetch error:", error); // Log detailed error info
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: `Error: ${error.message}`,
          sender: "Gemenei",
          direction: "incoming",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div style={{ position: "relative", height: "500px", width: "700px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList
            typingIndicator={
              typing ? <TypingIndicator content="Mentor AI is typing" /> : null
            }
          >
            {messages.map((msg, i) => (
              <Message key={i} model={msg} />
            ))}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatBox;
