import React, { Suspense } from "react";
import InsightIndex from "../Features/InsightPage/InsightIndex";

const page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white/40">
          กำลังโหลด
        </div>
      }
    >
      <InsightIndex />
    </Suspense>
  );
};

export default page;
