"use client";
import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOverView } from "./hooks/useOverView";
import { ChartAreaDefault } from "./components/ChartAreaDefault";

const OverViewView = () => {
  const {
    overViewData,
    isLoading,
    error,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    refresh,
  } = useOverView();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    refresh({ startDate, endDate });
  };

  return (
    <main className="min-h-screen bg-[#0A0A0F] px-4 py-20 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-1">
            <h1 className="text-2xl font-semibold">ภาพรวม</h1>
            <p className="text-sm text-white/50">
              ทั้งหมด {overViewData?.totalLogs ?? 0} บันทึก
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-3 sm:grid-cols-[minmax(0,160px)_minmax(0,160px)_auto] sm:items-end"
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
            <Button type="submit" className="h-8">
              <Search className="h-4 w-4" />
              แสดงผล
            </Button>
          </form>
        </section>

        <ChartAreaDefault
          data={overViewData?.dailyMoodAverages ?? []}
          moodNotes={overViewData?.moodNotes ?? []}
          startDate={startDate}
          endDate={endDate}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </main>
  );
};

export default OverViewView;
