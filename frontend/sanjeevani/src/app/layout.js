import Navbar from "@/components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import { GlobalContextProvider } from "@/context/GlobalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "GramLearn",
    description: "",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <GlobalContextProvider>
                <body className={inter.className}>
                    <Navbar />
                    {children}
                </body>
            </GlobalContextProvider>
        </html>
    );
}
