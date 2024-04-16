import { GlobalContextProvider } from "@/context/GlobalContext";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GramLearn",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GlobalContextProvider>
        <body className={inter.className}>{children}</body>
      </GlobalContextProvider>
    </html>
  );
}
