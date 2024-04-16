"use client";
import Image from "next/image";
import React from "react";
import styles from "./navbar.module.css";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.title}>
        GramLearn
      </Link>
    </nav>
  );
}
