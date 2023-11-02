"use client";
import Aside from "@/components/Aside";
import styles from "./page.module.css";
import Chatbot from "@/components/Chatbot";

export default function Home() {
    return (
        <main className={styles.main}>
            <Chatbot />
        </main>
    );
}
