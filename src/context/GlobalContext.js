"use client";
import { createContext, useContext, useRef, useState } from "react";

const globalContext = createContext();

export function GlobalContextProvider({ children }) {
  // Chat specific context
  const [file, setFile] = useState(undefined);
  const [MsgLoading, setMsgLoading] = useState(false);
  const [Messages, setMessages] = useState([]);
  const [InputAllowed, setInputAllowed] = useState(true);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  );

  // Set References
  const chatDisplayRef = useRef(null);

  // Utility functions
  const scrollToBottom = () => {
    // Code to scroll .chat-display to bottom
    setTimeout(() => {
      // document.querySelector("div[chat-display]").scrollTop = document.querySelector("div[chat-display]").scrollHeight;
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }, 150);
  };

  // Update current time
  const updateTime = () => {
    setCurrentTime(
      new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    );
  };

  // Upload Image
  const imageUpload = async (e) => {
    var file = e.target.files[0];
    console.log("file", file);
    const fileURL = URL.createObjectURL(e.target.files[0]);
    setFile(fileURL);
    setMessages((prevMessages) => [...prevMessages, { imgURL: fileURL, sender: "USER", time: currentTime }]);

    const data = {
      image: e.target.files[0],
    };
    let form_data = new FormData();
    for (var key in data) {
      form_data.append(key, data[key]);
    }
    const url = `http://127.0.0.1:8000/predict`;
    try {
      setMsgLoading(true);

      const response = await fetch(url, {
        mode: "cors",
        method: "POST",
        body: form_data,
        // credentials: "include",
        SameSite: "None",
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
      alert("Server timed out please try again in some time! 🙂");
      setInputAllowed(true);
    }
  };

  // Render chatbot response
  const renderBotMessage = async (responseJson) => {
    updateTime();

    setMessages((prevMessages) => [...prevMessages, { text: responseJson.response, sender: "SJVN", time: currentTime }]);

    setTimeout(() => {
      document.querySelector('input[type="text"]').focus();
    }, 50);
  };

  const values = {
    chatDisplayRef,
    scrollToBottom,
    imageUpload,
    file,
    MsgLoading,
    setMsgLoading,
    Messages,
    setMessages,
    updateTime,
    renderBotMessage,
    InputAllowed,
    setInputAllowed,
    currentTime,
  };

  return <globalContext.Provider value={values}>{children}</globalContext.Provider>;
}

export function useGlobal() {
  return useContext(globalContext);
}
