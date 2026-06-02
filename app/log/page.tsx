import React, { Suspense } from "react";
import type { Metadata } from "next";
import LogPageView from "../Features/Log/presentation/LogPageView";

export const metadata: Metadata = {
  title: "บันทึกอารมณ์",
  robots: {
    index: false,
    follow: false,
  },
};

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
