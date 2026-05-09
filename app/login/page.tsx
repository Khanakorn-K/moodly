import React, { Suspense } from "react";
import { LoginView } from "../../cors/components/Login/loginView";

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
