"use client";
import React from "react";
import { Activity, BarChart3, CalendarDays, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOverview } from "./hooks/useOverview";
import { ChartAreaDefault } from "./components/ChartAreaDefault";
import { MonthlyMoodCalendar } from "./components/MonthlyMoodCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type StatItemProps = {
  label: string;
  value: string | number;
  helper: string;
};

function StatItem({ label, value, helper }: StatItemProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
      <p className="text-xs font-medium text-white/45">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-normal text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-white/45">{helper}</p>
    </div>
  );
}

const OverviewView = () => {
  const {
    overviewData,
    monthlyAverageMood,
    isLoading,
    isMonthlyLoading,
    error,
    monthlyError,
    startDate,
    endDate,
    selectedMonth,
    setStartDate,
    setEndDate,
    setSelectedMonth,
    refresh,
    refreshMonthlyAverageMood,
  } = useOverview();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    refresh({ startDate, endDate });
  };

  const handleMonthSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    refreshMonthlyAverageMood({ month: selectedMonth });
  };

  return (
    <main className="min-h-screen bg-[#0A0A0F] px-3 py-8 pb-28 text-white sm:px-4 lg:py-24 lg:pb-16">
      <div className="mx-auto grid w-full max-w-6xl gap-6">
        <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-2">
            <div className="grid gap-1">
              <h1 className="text-3xl font-semibold tracking-normal text-white sm:text-4xl">
                ภาพรวมอารมณ์
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-white/50">
                ดูแนวโน้มตามช่วงวันที่
                และตรวจสีอารมณ์เฉลี่ยของแต่ละวันในเดือนที่เลือก
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[28rem]">
            <StatItem
              label="บันทึกช่วงนี้"
              value={overviewData?.totalLogs ?? 0}
              helper="รายการ"
            />
            <StatItem
              label="เฉลี่ยช่วงนี้"
              value={overviewData?.averageMood ?? 0}
              helper="คะแนน"
            />
            <StatItem
              label="เฉลี่ยรายเดือน"
              value={monthlyAverageMood?.averageMood ?? 0}
              helper={selectedMonth}
            />
          </div>
        </section>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid h-11 w-full grid-cols-2 rounded-lg border border-white/10 bg-white/[0.04] p-1 text-white/60 sm:w-[24rem]">
            <TabsTrigger
              value="overview"
              className="gap-2 rounded-md data-active:bg-white text-amber-100"
            >
              <BarChart3 className="h-4 w-4" />
              ภาพรวม
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="gap-2 rounded-md data-active:bg-white text-amber-100"
            >
              <CalendarDays className="h-4 w-4" />
              วิเคราะห์รายเดือน
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-5 space-y-5">
            <section className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_auto] md:items-end">
              <div className="grid gap-1">
                <h2 className="text-lg font-semibold">แนวโน้มอารมณ์</h2>
                <p className="text-sm text-white/45">
                  เลือกช่วงวันที่เพื่อดูกราฟอารมณ์เฉลี่ยรายวัน
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid w-full gap-3 sm:grid-cols-[minmax(0,160px)_minmax(0,160px)_auto] sm:items-end md:w-auto"
              >
                <label className="grid gap-1.5 text-sm text-white/70">
                  วันเริ่มต้น
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className="h-11 border-white/10 bg-white/[0.04] text-white"
                  />
                </label>

                <label className="grid gap-1.5 text-sm text-white/70">
                  วันสิ้นสุด
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    className="h-11 border-white/10 bg-white/[0.04] text-white"
                  />
                </label>

                <Button type="submit" className="h-11 w-full gap-2 sm:w-auto">
                  <Search className="h-4 w-4" />
                  แสดงผล
                </Button>
              </form>
            </section>

            <ChartAreaDefault
              data={overviewData?.dailyMoodAverages ?? []}
              moodNotes={overviewData?.moodNotes ?? []}
              startDate={startDate}
              endDate={endDate}
              isLoading={isLoading}
              error={error}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-5 space-y-5">
            <section className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_auto] md:items-end">
              <div className="grid gap-1">
                <h2 className="text-lg font-semibold">ปฏิทินสีอารมณ์</h2>
                <p className="text-sm text-white/45">
                  แต่ละช่องใช้ค่าเฉลี่ยอารมณ์ของวันนั้นเพื่อกำหนดสี
                </p>
              </div>

              <form
                onSubmit={handleMonthSubmit}
                className="grid w-full gap-3 sm:grid-cols-[minmax(0,180px)_auto] sm:items-end md:w-auto"
              >
                <label className="grid gap-1.5 text-sm text-white/70">
                  เลือกเดือน
                  <Input
                    type="month"
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                    className="h-11 border-white/10 bg-white/[0.04] text-white"
                  />
                </label>
                <Button type="submit" className="h-11 w-full gap-2 sm:w-auto">
                  <Search className="h-4 w-4" />
                  แสดงสีรายวัน
                </Button>
              </form>
            </section>

            <MonthlyMoodCalendar
              data={monthlyAverageMood}
              isLoading={isMonthlyLoading}
              error={monthlyError}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default OverviewView;
