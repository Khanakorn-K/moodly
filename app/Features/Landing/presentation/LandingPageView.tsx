"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PenLine, ChevronRight } from "lucide-react";
import Link from "next/link";
import useLandingPage from "./hooks/useLandingPage";
import { Calendar } from "@/components/ui/calendar";
import { convertDateToThaiDateFormat } from "@/cores/utils/thaiDate";
import { DynamicSkeleton } from "@/components/ui/DynamicSkeleton";
import Causes from "./components/Causes";
import Chart from "./components/Chart";

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
    averageMood,
    calculateMoodColor,
  } = useLandingPage();

  const isDataLoading = status === "loading" || isLoading;

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-3 py-8 pb-28 sm:px-4 md:px-8 lg:py-24 lg:pb-12">
      <div className="mx-auto w-full max-w-4xl space-y-6 sm:space-y-8">
        <HeaderSection
          isLoading={isDataLoading}
          greeting={greeting}
          firstName={firstName}
        />

        <section className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          <TotalLogsCard
            isLoading={isDataLoading}
            totalLogs={data?.totalLogs}
          />

          <MoodOverviewCard
            isLoading={isDataLoading}
            date={date}
            setDate={setDate}
            moodChartData={moodChartData}
            averageMood={averageMood}
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
    <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="space-y-1">
        {isLoading ? (
          <>
            <DynamicSkeleton width="100px" height="14px" className="mb-2" />
            <DynamicSkeleton width="240px" height="36px" />
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-white/40">{greeting} 👋</p>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
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
    <Card className="relative overflow-hidden rounded-3xl border-white/10 bg-gradient-to-br from-[#1E1E2E] to-[#2A2A3D] shadow-2xl md:col-span-3">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFD166]/5 rounded-full blur-3xl -mr-16 -mt-16" />
      <CardContent className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
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
  averageMood: number;
  calculateMoodColor: (value: number | null) => string;
}

function MoodOverviewCard({
  isLoading,
  date,
  setDate,
  moodChartData,
  averageMood,
  calculateMoodColor,
}: MoodOverviewCardProps) {
  return (
    <Card className="flex h-full flex-col rounded-3xl border-white/5 bg-[#161622] shadow-lg md:col-span-1">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <CardTitle className="min-w-0 text-sm font-bold leading-relaxed text-white/90">
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
      <CardContent className="flex flex-1 flex-col justify-between px-4 pb-5 sm:px-6">
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
            className="mx-auto max-w-full bg-transparent p-0 text-white border-none [--cell-size:--spacing(6)] sm:[--cell-size:--spacing(7)]"
          />

          <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-bold leading-relaxed text-white/90">
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
                color: calculateMoodColor(Math.round(averageMood)),
              }}
            >
              {isLoading ? "..." : averageMood}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
