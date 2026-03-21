"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, PenLine, ChevronRight } from "lucide-react";
import Link from "next/link";
import Chart from "./components/Chart";
import useLandingPage from "./hooks/useLandingPage";
import Causes from "./components/Causes";

export default function LandingPageIndex() {
  const {
    status,
    isLoading,
    firstName,
    greeting,
    data,
    moodChartData,
    topCausesList,
  } = useLandingPage();

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white/50 animate-pulse text-sm">
        กำลังเตรียมข้อมูล... มาสเตอร์
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-12 md:px-8 md:py-20 pb-28 md:pb-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-white/40">{greeting} 👋</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              สวัสดีครับ {firstName}
            </h1>
          </div>
          <Link href="/log" className="w-full md:w-auto">
            <Button className="w-full md:px-8 bg-[#FFD166] hover:bg-[#FFD166]/80 text-[#0A0A0F] font-bold rounded-2xl h-12 transition-all shadow-lg">
              <PenLine size={18} className="mr-2" /> บันทึกตอนนี้
            </Button>
          </Link>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-[#1E1E2E] to-[#2A2A3D] border-white/10 rounded-3xl shadow-2xl overflow-hidden relative md:col-span-3">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFD166]/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <CardContent className="p-6 flex items-center justify-between relative z-10">
              <div className="space-y-1">
                <p className="text-white/60 text-sm font-medium">
                  บันทึกอารมณ์วันนี้
                </p>
                <p className="text-2xl font-bold text-white">
                  {data?.totalLogs ?? 0}{" "}
                  <span className="text-sm font-normal text-white/40">
                    ครั้ง
                  </span>
                </p>
              </div>
              <Badge
                variant="outline"
                className="border-[#FFD166]/20 text-[#FFD166] bg-[#FFD166]/5 px-4 py-2 rounded-xl"
              >
                Keep going! ⚡️
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-[#161622] border-white/5 rounded-3xl md:col-span-1 shadow-lg h-full flex flex-col">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-white/90">
                ภาพรวมอารมณ์
              </CardTitle>
              <Link href="/history">
                <ChevronRight size={16} className="text-[#FFD166]" />
              </Link>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <Chart data={moodChartData} />
              <div>
                <Separator className="bg-white/5 my-4" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#06D6A0]/10 flex items-center justify-center">
                    <TrendingUp size={16} className="text-[#06D6A0]" />
                  </div>
                  <p className="text-[11px] font-medium text-[#06D6A0]">
                    อัปเดตล่าสุดวันนี้
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 h-full">
            <Causes topCausesList={topCausesList} />
          </div>
        </section>
      </div>
    </div>
  );
}
