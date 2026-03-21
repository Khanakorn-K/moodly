import React, { Suspense } from "react";
import LogIndex from "../Features/LogPage/logIndex";

const page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white/40">
          กำลังโหลด... มาสเตอร์
        </div>
      }
    >
      <LogIndex />
    </Suspense>
  );
};

export default page;
