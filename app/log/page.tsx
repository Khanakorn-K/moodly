import React, { Suspense } from "react";
import LogPageView from "../Features/Log/presentation/LogPageView";

const page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white/40">
          กำลังโหลด...
        </div>
      }
    >
      <LogPageView />
    </Suspense>
  );
};

export default page;
