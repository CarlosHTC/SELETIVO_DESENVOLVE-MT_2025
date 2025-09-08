"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "../app/globals.css";
import TopoInstitucional from "../app/components/TopoInstitucional";
import RodapeInstitucional from "../app/components/RodapeInstitucional";
import { ModalProvider } from "../app/components/ModalContext";
import { FiltroProvider } from "../app/components/FiltroContext";
import Modal from "../app/components/Modal";
import ModalRouter from "../app/components/ModalRouter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function MyApp({ Component, pageProps }: { Component: any, pageProps: any }) {
  return (
    <ModalProvider>
      <FiltroProvider>
        <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
          <TopoInstitucional />
          <main className="min-h-screen">
            <ModalRouter>
              <Component {...pageProps} />
            </ModalRouter>
          </main>
          <RodapeInstitucional />
          <Modal />
        </div>
      </FiltroProvider>
    </ModalProvider>
  );
}