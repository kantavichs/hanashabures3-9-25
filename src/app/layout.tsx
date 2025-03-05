import "./globals.css";
import React, { ReactNode } from "react";
import { Kanit as KanitFont } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const kanit = KanitFont({
  subsets: ["latin", "thai"],
  weight: "400",
});

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${kanit.className}`}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
};

export default Layout;
