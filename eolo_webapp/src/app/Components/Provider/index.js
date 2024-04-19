"use client";

import { AuthProvider } from "@/app/Context/auth/authState";

export default function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
