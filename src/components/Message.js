"use client";
import { motion } from "framer-motion";
import TextAnimation from "./TextAnimation";
import styles from "./chatbot.module.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect } from "react";

export default function Message(props) {
  // New messages can be animated using framer motion
  const isNewMessage = props.index === props.messagesLength - 1;
  const animation = isNewMessage ? { initial: { opacity: 0, transform: "translateY(5px)" }, animate: { opacity: 1, transform: ["translateY(0px)", "translateY(-5px)", "translateY(0px)"] }, transition: { duration: 0.5 } } : {};

  const style_msgType = props.message.sender === "SJVN" ? styles.chatbot_message : styles.user_message;
  useEffect(() => {
    props.scrollToBottom();
  }, []);
  return (
    <motion.div {...animation}>
      <div className={`${style_msgType} ${styles.message}`}>
        {props.message.imgURL ? <img src={props.message.imgURL} className={styles.message_img} /> : <span className={styles.message_text}>{props.message.sender === "SJVN" && isNewMessage && !props.IsAnimationRenderedOnce ? <Markdown remarkPlugins={[remarkGfm]}>{props.streamMsg}</Markdown> : <Markdown remarkPlugins={[remarkGfm]}>{props.message.text}</Markdown>}</span>}

        <span className={styles.message_time}>{props.message.time}</span>
      </div>
    </motion.div>
  );
}
