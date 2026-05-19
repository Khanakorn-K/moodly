import React, { Suspense } from "react";
import OverviewIndex from "../Features/Overview/presentation/OverviewView";

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white/40">
          กำลังโหลด...
        </div>
      }
    >
      <OverviewIndex />
    </Suspense>
  );
};

export default Page;
