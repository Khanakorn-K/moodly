import React, { Suspense } from "react";
import type { Metadata } from "next";
import { LoginView } from "./components/Login/loginView";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ",
  robots: {
    index: false,
    follow: false,
  },
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white/40">
          กำลังโหลด...
        </div>
      }
    >
      <LoginView />
    </Suspense>
  );
};

export default Page;
