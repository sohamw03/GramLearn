"use client";
import Image from "next/image";
import React from "react";
import styles from "./navbar.module.css";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link href="/">
                <Image className={styles.logo} src="/sanjeevani_logo.png" width={179} height={50} draggable={false} alt="Sanjeevani" />
            </Link>
        </nav>
    );
}
