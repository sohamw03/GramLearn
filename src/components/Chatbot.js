"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Message from "./Message";
import Spinner from "./Spinner";
import styles from "./chatbot.module.css";

import { useGlobal } from "@/context/GlobalContext";
import Navbar from "./Navbar";

export default function Chatbot() {
  // Global Context
  const { currentTime, InputAllowed, setInputAllowed, chatDisplayRef, scrollToBottom, MsgLoading, setMsgLoading, Messages, setMessages, updateTime, renderBotMessage, streamMsg, setStreamMsg } = useGlobal();

  // Set states
  const [IsAnimationRenderedOnce, setIsAnimationRenderedOnce] = useState(false);

  const [Input, setInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  // Post user message to the server
  const postUserMessage = async (text) => {
    setInputAllowed(false);
    const data = {
      query: text,
      history: Messages,
    };
    const url = `${process.env.NEXT_PUBLIC_API_URL}/chat`;
    try {
      setMsgLoading(true);

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // HTTP Streaming
      const reader = response.body.getReader();

      let output = "";
      await renderBotMessage("");
      setMsgLoading(false);
      while (true) {
        const { done, value } = await reader.read();
        output += new TextDecoder().decode(value);
        setStreamMsg(output);
        if (done) {
          await renderBotMessage(output, true);
          break;
        }
      }

      console.log(output);
      setInputAllowed(true);
    } catch (error) {
      console.error(error);
      await renderBotMessage(responseJson);
      setInputAllowed(true);
    }
  };

  // Simulate chatbot response | Testing and development of API connection purposes only
  // const simulateChatbotResponse = (message) => {
  //   updateTime();
  //   setMsgLoading(true);
  //   setTimeout(() => {
  //     const response = { response: "Hi how are you ?", sender: "SJVN", time: currentTime };
  //     renderBotMessage(response);
  //     setMsgLoading(false);
  //   }, 1000);
  // };

  return (
    <div className={styles.chatbot_frame}>
      <Navbar />
      <div className={styles.chat_section}>
        {/* Chat Section */}
        <div className={styles.chat_display} ref={chatDisplayRef}>
          {Messages.map((message, index) => (
            <Message key={index} index={index} message={message} messagesLength={Messages.length} IsAnimationRenderedOnce={IsAnimationRenderedOnce} scrollToBottom={scrollToBottom} streamMsg={streamMsg} />
          ))}
          {MsgLoading && <Spinner scrollToBottom={scrollToBottom} />}
        </div>

        {/* Input Section */}
        <div className={styles.input_section}>
          <form className={styles.user_input} onSubmit={handleUserInput} autoComplete="off" noValidate>
            <input
              ref={inputRef}
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
              <svg className={styles.send_icon} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
