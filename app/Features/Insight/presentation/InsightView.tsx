"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Filter, RotateCcw } from "lucide-react";
import { standardMoods } from "@/app/shared/moodType";
import { Input } from "@/components/ui/input";
import { moodColors } from "@/app/shared/moodColors";

import { useInsight } from "./hooks/useInsight";
import MoodInsightList from "./components/MoodInsightList";
import MoodLogBoard from "./components/MoodLogBoard";
import MoodLogDetailSidebar from "./components/MoodLogDetailSidebar";

export default function InsightView() {
  const {
    moodLogPage,
    isInitialLoading,
    isListLoading,
    isModalOpen,
    setIsModalOpen,
    editNote,
    setEditNote,
    editMood,
    setEditMood,
    editingMoodLog,
    mood,
    startDate,
    endDate,
    handleDragEnd,
    handleDeleteMoodLog,
    handleUpdateMoodLog,
    openEditMoodLogModal,
    router,
    handleFilterChange,
    pathname,
    customCauses,
    selectedCauses,
    isUpdating,
    toggleCause,
  } = useInsight();

  if (isInitialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F] px-4 pb-28 text-center font-medium text-white/40 lg:pb-0">
        กำลังโหลดประวัติ
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A0F] px-3 py-8 pb-28 sm:px-6 lg:py-24 lg:pb-16">
      <div className="mx-auto w-full max-w-[1600px] space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-4 px-1 sm:flex-row sm:items-end sm:justify-between sm:px-2">
          <div className="space-y-1">
            <h1 className="font-outfit text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
              Mood Insight
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(pathname)}
            className="w-fit text-[10px] font-bold uppercase tracking-wider text-white/30 hover:bg-white/5 hover:text-white"
          >
            <RotateCcw size={14} className="mr-2" /> ล้างค่า
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 rounded-[1.75rem] border border-white/5 bg-[#16161E]/50 p-4 shadow-2xl backdrop-blur-md sm:rounded-[2.5rem] sm:p-6 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2 text-[10px] text-white/20 uppercase font-black tracking-widest ml-1">
              <Calendar size={12} className="text-moodly-calm" /> เลือกวัน
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) =>
                  handleFilterChange({ startDate: e.target.value })
                }
                className="bg-black/40 border-white/5 text-white text-xs font-bold rounded-2xl h-11 focus:ring-1 focus:ring-moodly-primary/30 [color-scheme:dark]"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) =>
                  handleFilterChange({ endDate: e.target.value })
                }
                className="bg-black/40 border-white/5 text-white text-xs font-bold rounded-2xl h-11 focus:ring-1 focus:ring-moodly-primary/30 [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="space-y-3 lg:col-span-8">
            <div className="flex items-center gap-2 text-[10px] text-white/20 uppercase font-black tracking-widest ml-1">
              <Filter size={12} className="text-moodly-calm" /> Mood Filter
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleFilterChange({ mood: null })}
                className={`h-10 rounded-2xl border px-4 py-2 text-[11px] font-bold transition-all sm:h-11 sm:px-6 ${
                  !mood
                    ? "border-moodly-primary bg-moodly-primary text-black shadow-lg shadow-moodly-primary/10"
                    : "bg-black/20 border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                }`}
              >
                ทั้งหมด
              </Button>
              {standardMoods.map((moodOption) => {
                const isActive = mood === String(moodOption.value);
                const mColor = moodColors[moodOption.value as number];
                return (
                  <Button
                    key={moodOption.value}
                    onClick={() =>
                      handleFilterChange({ mood: String(moodOption.value) })
                    }
                    style={
                      isActive
                        ? {
                            backgroundColor: mColor,
                            borderColor: mColor,
                            color: "#000",
                          }
                        : {}
                    }
                    className={`h-10 rounded-2xl border px-3 py-2 text-[11px] font-bold transition-all sm:h-11 sm:px-5 ${
                      !isActive
                        ? "bg-black/20 border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                        : "shadow-lg"
                    }`}
                  >
                    {moodOption.emoji} {moodOption.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full min-h-[420px] sm:min-h-[600px]">
          {!mood ? (
            <MoodLogBoard
              handleDragEnd={handleDragEnd}
              moodLogPage={moodLogPage}
              isListLoading={isListLoading}
              openEditMoodLogModal={openEditMoodLogModal}
              selectedMoodLogId={isModalOpen ? editingMoodLog?.id : undefined}
            />
          ) : (
            <MoodInsightList
              moodLogPage={moodLogPage}
              isListLoading={isListLoading}
              openEditMoodLogModal={openEditMoodLogModal}
              isDetailOpen={isModalOpen}
              editingMoodLog={editingMoodLog}
            />
          )}
        </div>
      </div>
      <MoodLogDetailSidebar
        customCauses={customCauses}
        isOpen={isModalOpen}
        setIsDetailOpen={setIsModalOpen}
        moodLog={editingMoodLog}
        editNote={editNote}
        setEditNote={setEditNote}
        editMood={editMood}
        setEditMood={setEditMood}
        selectedCauses={selectedCauses}
        toggleCause={toggleCause}
        handleUpdateMoodLog={handleUpdateMoodLog}
        handleDeleteMoodLog={handleDeleteMoodLog}
        isUpdating={isUpdating}
      />
    </div>
  );
}
