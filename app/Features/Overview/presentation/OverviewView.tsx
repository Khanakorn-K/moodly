"use client";
import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOverview } from "./hooks/useOverview";
import { ChartAreaDefault } from "./components/ChartAreaDefault";

const OverviewView = () => {
  const {
    overviewData,
    isLoading,
    error,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    refresh,
  } = useOverview();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    refresh({ startDate, endDate });
  };

  return (
    <main className="min-h-screen bg-[#0A0A0F] px-3 py-8 pb-28 text-white sm:px-4 lg:py-24 lg:pb-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-1">
            <h1 className="text-2xl font-semibold sm:text-3xl">ภาพรวม</h1>
            <p className="text-sm text-white/50">
              ทั้งหมด {overviewData?.totalLogs ?? 0} บันทึก
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
                className="border-white/10 bg-white/[0.04] text-white"
              />
            </label>
            <label className="grid gap-1.5 text-sm text-white/70">
              วันสิ้นสุด
              <Input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="border-white/10 bg-white/[0.04] text-white"
              />
            </label>
            <Button type="submit" className="h-11 w-full sm:w-auto">
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
      </div>
    </main>
  );
};

export default OverviewView;
