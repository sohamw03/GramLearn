import { useEffect, useState } from "react";
import styles from "./chatbot.module.css";

export default function TextAnimation(props) {
  const { scrollToBottom } = props;

  const [completedTyping, setCompletedTyping] = useState(true);
  const [displayResponse, setDisplayResponse] = useState("");

  useEffect(() => {
    setCompletedTyping(false);
    let animIterTime = 100;
    let cursorDelay = 3000;

    // For every animIterTime milliseconds, add a word to the displayResponse
    let i = 0;
    const stringResponse = props.text.split(" ");
    const intervalId = setInterval(() => {
      setDisplayResponse(stringResponse.slice(0, i).join(" "));
      i++;
      if (i > stringResponse.length) {
        clearInterval(intervalId);
        setTimeout(() => {
          setCompletedTyping(true);
        }, cursorDelay);
        scrollToBottom();
      }
    }, animIterTime);

    // For every 1/5th of the stringResponse, scroll to the bottom
    let j = 1;
    const intervalId2 = setInterval(() => {
      if (j >= 5) {
        clearInterval(intervalId2);
      }
      scrollToBottom();
      j++;
    }, (stringResponse.length * animIterTime) / 5);

    return () => clearInterval(intervalId);
  }, [props.text]);
  return (
    <>
      {displayResponse}
      {/* If typing is not complete, display a cursor */}
      {!completedTyping && <span className={styles.message_text_cursor}></span>}
    </>
  );
}
