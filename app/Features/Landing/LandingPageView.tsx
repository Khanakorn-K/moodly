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
import { Calendar } from "@/components/ui/calendar";
import { convertDateToThaiDateFormat } from "@/cors/utils/thaiDate";
import { DynamicSkeleton } from "@/components/ui/DynamicSkeleton";
import { LandingEntity } from "./domain/entity/LandingEntity";

export default function LandingPageView() {
  const {
    status,
    isLoading,
    firstName,
    greeting,
    data,
    moodChartData,
    date,
    setDate,
    topCausesList,
    calculateAverageMood,
    calculateMoodColor,
  } = useLandingPage();

  const isDataLoading = status === "loading" || isLoading;

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-12 md:px-8 md:py-20 pb-28 md:pb-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <HeaderSection
          isLoading={isDataLoading}
          greeting={greeting}
          firstName={firstName}
        />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TotalLogsCard
            isLoading={isDataLoading}
            totalLogs={data?.totalLogs}
          />

          <MoodOverviewCard
            isLoading={isDataLoading}
            date={date}
            setDate={setDate}
            moodChartData={moodChartData}
            data={data}
            calculateAverageMood={calculateAverageMood}
            calculateMoodColor={calculateMoodColor}
          />

          <div className="md:col-span-2 h-full">
            {isDataLoading ? (
              <Card className="bg-[#161622] border-white/5 rounded-3xl h-full p-6">
                <div className="space-y-4">
                  <DynamicSkeleton width="40%" height="28px" />
                  <DynamicSkeleton width="100%" height="300px" />
                </div>
              </Card>
            ) : (
              <Causes topCausesList={topCausesList} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function HeaderSection({
  isLoading,
  greeting,
  firstName,
}: {
  isLoading: boolean;
  greeting: string;
  firstName: string;
}) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="space-y-1">
        {isLoading ? (
          <>
            <DynamicSkeleton width="100px" height="14px" className="mb-2" />
            <DynamicSkeleton width="240px" height="36px" />
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-white/40">{greeting} 👋</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              สวัสดีครับ {firstName}
            </h1>
          </>
        )}
      </div>
      <Link href="/log" className="w-full md:w-auto">
        <Button className="w-full md:px-8 bg-[#FFD166] hover:bg-[#FFD166]/80 text-[#0A0A0F] font-bold rounded-2xl h-12 transition-all shadow-lg">
          <PenLine size={18} className="mr-2" /> บันทึกตอนนี้
        </Button>
      </Link>
    </header>
  );
}

function TotalLogsCard({
  isLoading,
  totalLogs,
}: {
  isLoading: boolean;
  totalLogs?: number;
}) {
  return (
    <Card className="bg-gradient-to-br from-[#1E1E2E] to-[#2A2A3D] border-white/10 rounded-3xl shadow-2xl overflow-hidden relative md:col-span-3">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFD166]/5 rounded-full blur-3xl -mr-16 -mt-16" />
      <CardContent className="p-6 flex items-center justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-white/60 text-sm font-medium">
            บันทึกอารมณ์วันนี้
          </p>
          {isLoading ? (
            <DynamicSkeleton width="60px" height="32px" />
          ) : (
            <p className="text-2xl font-bold text-white">
              {totalLogs ?? 0}{" "}
              <span className="text-sm font-normal text-white/40">ครั้ง</span>
            </p>
          )}
        </div>
        <Badge
          variant="outline"
          className="border-[#FFD166]/20 text-[#FFD166] bg-[#FFD166]/5 px-4 py-2 rounded-xl"
        >
          Keep going! ⚡️
        </Badge>
      </CardContent>
    </Card>
  );
}

interface MoodOverviewCardProps {
  isLoading: boolean;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  moodChartData: {
    label: string;
    heightPercentage: number;
    color: string;
    actualCount: number;
    causes: string[];
    date: Date | undefined;
  }[];
  data: LandingEntity | null;
  calculateAverageMood: (insightData: LandingEntity | null) => number;
  calculateMoodColor: (value: number | null) => string;
}

function MoodOverviewCard({
  isLoading,
  date,
  setDate,
  moodChartData,
  data,
  calculateAverageMood,
  calculateMoodColor,
}: MoodOverviewCardProps) {
  return (
    <Card className="bg-[#161622] border-white/5 rounded-3xl md:col-span-1 shadow-lg h-full flex flex-col">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-white/90">
          {isLoading ? (
            <DynamicSkeleton width="150px" height="16px" />
          ) : (
            `ภาพรวมอารมณ์ ${date ? convertDateToThaiDateFormat(date) : ""}`
          )}
        </CardTitle>
        <Link href="/insight">
          <ChevronRight size={16} className="text-[#FFD166]" />
        </Link>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          {isLoading ? (
            <DynamicSkeleton width="100%" height="180px" />
          ) : (
            <Chart data={moodChartData} />
          )}

          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (!newDate || newDate.getTime() === date?.getTime()) {
                return;
              }
              const selectedDate = new Date(newDate);
              selectedDate.setHours(0, 0, 0, 0);
              setDate(selectedDate);
            }}
            className="w-full bg-transparent text-white border-none p-0"
          />

          <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
            <span className="text-sm font-bold text-white/90">
              {isLoading ? (
                <DynamicSkeleton width="150px" height="16px" />
              ) : (
                date &&
                `ค่าเฉลี่ยอารมณ์ของคุณใน ${convertDateToThaiDateFormat(date)}`
              )}
            </span>
            <span
              className="text-xl font-black italic"
              style={{
                color: calculateMoodColor(
                  Math.round(calculateAverageMood(data)),
                ),
              }}
            >
              {isLoading ? "..." : calculateAverageMood(data)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
