import { motion } from "framer-motion";
import { useEffect } from "react";
import loader from "../assets/loading-animation200px.svg";
import styles from "./chatbot.module.css";
import Image from "next/image";

export default function Spinner(props) {
  const { scrollToBottom } = props;

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    // Spinner for the chatbot message while user waits
    <motion.div className={styles.spinner} initial={{ opacity: 0, transform: "translateY(5px)" }} animate={{ opacity: 1, transform: ["translateY(0px)", "translateY(-5px)", "translateY(0px)"] }} transition={{ duration: 0.5 }} key={-1}>
      <Image src={loader} alt="loading" style={{ height: "2rem", width: "auto", objectFit: "contain" }} />
    </motion.div>
  );
}
