import React, { Suspense } from "react";
import type { Metadata } from "next";
import OverviewIndex from "../Features/Overview/presentation/OverviewView";

export const metadata: Metadata = {
  title: "ภาพรวมอารมณ์",
  robots: {
    index: false,
    follow: false,
  },
};

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
