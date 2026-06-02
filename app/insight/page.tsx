import React, { Suspense } from "react";
import type { Metadata } from "next";
import InsightView from "../Features/Insight/presentation/InsightView";

export const metadata: Metadata = {
  title: "ข้อมูลเชิงลึก",
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
          กำลังโหลด
        </div>
      }
    >
      <InsightView />
    </Suspense>
  );
};

export default page;
