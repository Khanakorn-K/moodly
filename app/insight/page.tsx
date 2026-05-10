import React, { Suspense } from "react";
import InsightView from "../Features/Insight/presentation/InsightView";

const page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white/40">
          กำลังโหลด
        </div>
      }
    >
      <InsightView />
    </Suspense>
  );
};

export default page;
