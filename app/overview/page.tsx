import React, { Suspense } from "react";
import OverViewIndex from "../Features/OverView/presentation/OverViewView";

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white/40">
          กำลังโหลด...
        </div>
      }
    >
      <OverViewIndex />
    </Suspense>
  );
};

export default Page;
