"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, PenLine, ChevronRight } from "lucide-react";
import Link from "next/link";
import Chart from "./components/Chart";
import useLandingPage from "./hooks/useLandingPage";

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
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-8 md:px-8 md:py-12 pb-28 md:pb-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-white/40">{greeting} 👋</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            สวัสดีครับ {firstName}
          </h1>
        </div>

        <Card className="bg-gradient-to-br from-[#1E1E2E] to-[#2A2A3D] border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD166]/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <CardHeader className="pb-4 relative z-10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold text-white">
                บันทึกอารมณ์วันนี้
              </CardTitle>
              <Badge
                variant="outline"
                className="border-[#FFD166]/40 text-[#FFD166] text-xs font-semibold bg-[#FFD166]/10 px-3 py-1 rounded-full"
              >
                🔥 {data?.totalLogs ?? 0} ครั้ง
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <Link href="/log">
              <Button className="w-full bg-[#FFD166] hover:bg-[#FFD166]/80 text-[#0A0A0F] font-bold rounded-2xl h-14 text-base transition-all shadow-[0_0_20px_rgba(255,209,102,0.15)]">
                <PenLine size={18} className="mr-2.5" /> บันทึกอารมณ์ตอนนี้
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 md:gap-5">
          <Card className="bg-[#161622] border-white/5 rounded-3xl col-span-2 md:col-span-1 shadow-lg hover:border-white/10 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-bold text-white/90">
                  ภาพรวมอารมณ์
                </CardTitle>
                <Link href="/history">
                  <button className="text-xs font-medium text-[#FFD166] hover:text-[#FFD166]/80 flex items-center gap-1 transition-colors">
                    ดูทั้งหมด <ChevronRight size={14} />
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Chart data={moodChartData} />
              <Separator className="bg-white/5 my-4" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#06D6A0]/15 flex items-center justify-center shadow-inner">
                  <TrendingUp size={16} className="text-[#06D6A0]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white/90">บันทึกแล้ว</p>
                  <p className="text-[11px] font-medium text-[#06D6A0]">
                    อัปเดตล่าสุดวันนี้
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#161622] border-white/5 rounded-3xl col-span-2 md:col-span-1 shadow-lg hover:border-white/10 transition-colors">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold text-white/90">
                สาเหตุหลัก
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topCausesList.map((c, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-white/70">{c.label}</span>
                    <span style={{ color: c.color }}>{c.pct}%</span>
                  </div>
                  <Progress
                    value={c.pct}
                    className="h-1.5 bg-white/5 rounded-full"
                  />
                </div>
              ))}
              {topCausesList.length === 0 && (
                <p className="text-xs text-white/40 text-center py-2">
                  ยังไม่มีข้อมูล
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
