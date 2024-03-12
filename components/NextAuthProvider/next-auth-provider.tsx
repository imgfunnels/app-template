"use client";
import { SessionProvider } from "next-auth/react";

export const NextAuthProvider = ({ session, children }: any) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
