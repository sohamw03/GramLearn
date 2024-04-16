"use client";
import Image from "next/image";
import { useState } from "react";
import Message from "./Message";
import Spinner from "./Spinner";
import styles from "./chatbot.module.css";

import { useGlobal } from "@/context/GlobalContext";
import send_logo from "../assets/send_logo.png";
import Navbar from "./Navbar";

export default function Chatbot() {
  // Global Context
  const { currentTime, InputAllowed, setInputAllowed, chatDisplayRef, scrollToBottom, MsgLoading, setMsgLoading, Messages, setMessages, updateTime, renderBotMessage } = useGlobal();

  // Set states
  const [IsAnimationRenderedOnce, setIsAnimationRenderedOnce] = useState(false);

  const [Input, setInput] = useState("");

  // Handle user input
  const handleUserInput = (event) => {
    event.preventDefault();
    scrollToBottom();

    setIsAnimationRenderedOnce(false);
    const text = Input;
    updateTime();
    if (text.trim() !== "") {
      setMessages((prevMessages) => [...prevMessages, { text: text, sender: "User", time: currentTime }]);

      // ENSURE THIS IS ON FOR PRODUCTION ↓
      setTimeout(() => {
        postUserMessage(text);
      }, 1000);
      // simulateChatbotResponse(text);
    }
    setInput("");
    setTimeout(() => {
      document.querySelector('input[type="text"]').focus();
    }, 50);
  };

  // Post user message to the server
  const postUserMessage = async (text) => {
    setInputAllowed(false);
    const data = {
      query: text,
    };
    const url = `http://127.0.0.1:8000/chat`;
    try {
      setMsgLoading(true);

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseJson = await response.json();
      console.log(responseJson);
      if (responseJson.status) {
        await renderBotMessage(responseJson);
      }
      setInputAllowed(true);

      setMsgLoading(false);
    } catch (error) {
      console.error(error);
      await renderBotMessage(responseJson);
      setInputAllowed(true);
    }
  };

  // Simulate chatbot response | Testing and development of API connection purposes only
  const simulateChatbotResponse = (message) => {
    updateTime();
    setMsgLoading(true);
    setTimeout(() => {
      const response = { response: "Hi how are you ?", sender: "SJVN", time: currentTime };
      renderBotMessage(response);
      setMsgLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.chatbot_frame}>
      <Navbar />
      <div className={styles.chat_section}>
        {/* Chat Section */}
        <div className={styles.chat_display} ref={chatDisplayRef}>
          {Messages.map((message, index) => (
            <Message key={index} index={index} message={message} messagesLength={Messages.length} IsAnimationRenderedOnce={IsAnimationRenderedOnce} scrollToBottom={scrollToBottom} />
          ))}
          {MsgLoading && <Spinner scrollToBottom={scrollToBottom} />}
        </div>

        {/* Input Section */}
        <div className={styles.input_section}>
          <form className={styles.user_input} onSubmit={handleUserInput} autoComplete="off" noValidate>
            <input
              type="text"
              name="userMessage"
              placeholder="Ask a question"
              value={Input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              required
              autoComplete="off"
            />
            <button type="submit" disabled={!InputAllowed}>
              <Image className={styles.send_icon} src={send_logo} alt="Send" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
