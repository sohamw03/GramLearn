"use client";
import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.title}>
        GramLearn
      </Link>
    </nav>
  );
}
