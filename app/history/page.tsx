import React, { Suspense } from "react";
import HistoryIndex from "../Features/HistoryPage/HistoryIndex";

const page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white/40">
          กำลังโหลด
        </div>
      }
    >
      <HistoryIndex />
    </Suspense>
  );
};

export default page;
