import React, { Suspense } from "react";
import { LoginIndex } from "../Features/LoginPage/loginIndex";

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white/40">
          กำลังโหลด... มาสเตอร์
        </div>
      }
    >
      <LoginIndex />
    </Suspense>
  );
};

export default Page;
