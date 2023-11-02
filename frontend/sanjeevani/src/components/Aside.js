"use client";
import styles from "./aside.module.css";
import upload_icon from "../assets/upload_icon.png";
import marketinsight_icon from "../assets/marketinsight_icon.png";
import Image from "next/image";
import { useGlobal } from "@/context/GlobalContext";
import { useRef } from "react";

export default function Aside() {
    // Global Context
    const { imageUpload, file } = useGlobal();

    const imageUploadRef = useRef(null);
    const handleUploadClick = () => {
        imageUploadRef.current.click();
    };

    return (
        <div className={styles.aside}>
            <div className={styles.aside_upper}>
                <button className={styles.upload_btn} onClick={handleUploadClick}>
                    <input type="file" name="upload" ref={imageUploadRef} style={{ display: "none" }} onChange={imageUpload} />
                    <span>Upload</span>
                    <Image src={upload_icon} alt="Upload" />
                </button>
                <p>Upload the photo of the plant which you wish to identify</p>
            </div>
            <div className={styles.aside_lower}>
                <button className={styles.marketinsight_btn}>
                    <span>Check Market Insights</span>
                    <Image src={marketinsight_icon} alt="Market Insights" />
                </button>
            </div>
        </div>
    );
}
