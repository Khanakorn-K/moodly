import React, { Suspense } from "react";
import LogView from "../Features/Log/presentation/logView";

const page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white/40">
          กำลังโหลด...
        </div>
      }
    >
      <LogView />
    </Suspense>
  );
};

export default page;
