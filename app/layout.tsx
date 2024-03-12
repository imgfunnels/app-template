import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/NextAuthProvider/next-auth-provider";
import Debugger from "@/components/Debugger/debugger";
import ContextProvider from "@/components/ContextProvider/context-provider";
import ChakraProvider from "@/components/ChakraProvider/chakra-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChakraProvider>
          <NextAuthProvider>
            <ContextProvider>{children}</ContextProvider>
            <Debugger />
          </NextAuthProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}