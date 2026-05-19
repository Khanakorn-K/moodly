"use client";

import { Button } from "@/components/ui/button";
import { Calendar, X, Filter, RotateCcw } from "lucide-react";
import { standardMoods } from "@/app/shared/moodType";
import { createCauseOptions } from "@/app/shared/causes";
import { Input } from "@/components/ui/input";
import { moodColors } from "@/app/shared/moodColors";

import { useInsight } from "./hooks/useInsight";
import MoodInsightList from "./components/MoodInsightList";
import MoodLogBoard from "./components/MoodLogBoard";

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
    handleSaveMoodLog,
    openEditMoodLogModal,
    router,
    handleFilterChange,
    pathname,
    customCauses,
    selectedCauses,
    toggleCause,
  } = useInsight();

  const allCauses = createCauseOptions(customCauses);

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
              <Calendar size={12} className="text-[#FFD166]" /> เลือกวัน
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) =>
                  handleFilterChange({ startDate: e.target.value })
                }
                className="bg-black/40 border-white/5 text-white text-xs font-bold rounded-2xl h-11 focus:ring-1 focus:ring-[#FFD166]/30 [color-scheme:dark]"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) =>
                  handleFilterChange({ endDate: e.target.value })
                }
                className="bg-black/40 border-white/5 text-white text-xs font-bold rounded-2xl h-11 focus:ring-1 focus:ring-[#FFD166]/30 [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="space-y-3 lg:col-span-8">
            <div className="flex items-center gap-2 text-[10px] text-white/20 uppercase font-black tracking-widest ml-1">
              <Filter size={12} className="text-[#FFD166]" /> Mood Filter
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleFilterChange({ mood: null })}
                className={`h-10 rounded-2xl border px-4 py-2 text-[11px] font-bold transition-all sm:h-11 sm:px-6 ${
                  !mood
                    ? "bg-[#FFD166] text-black border-[#FFD166] shadow-lg shadow-[#FFD166]/10"
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
            />
          ) : (
            <MoodInsightList
              moodLogPage={moodLogPage}
              isListLoading={isListLoading}
              openEditMoodLogModal={openEditMoodLogModal}
              handleDeleteMoodLog={handleDeleteMoodLog}
            />
          )}
        </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-3 py-4 backdrop-blur-xl sm:px-4">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-md space-y-5 overflow-y-auto rounded-[1.75rem] border border-white/10 bg-[#16161E] p-5 shadow-[0_0_100px_rgba(0,0,0,0.5)] sm:space-y-6 sm:rounded-[3rem] sm:p-8">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  {editingMoodLog ? "ปรับปรุง" : ""}
                </h3>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                  ปรับปรุงสถานะ
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/30 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {standardMoods.map((moodOption) => {
                const isSelected = editMood === moodOption.value;
                const mColor = moodColors[moodOption.value as number];
                return (
                  <button
                    key={moodOption.value}
                    onClick={() => setEditMood(moodOption.value)}
                    style={
                      isSelected
                        ? { backgroundColor: mColor, color: "#000" }
                        : {}
                    }
                    className={`flex aspect-square items-center justify-center rounded-2xl text-base transition-all transform active:scale-95 sm:text-lg ${
                      !isSelected
                        ? "bg-white/5 text-white/20 hover:bg-white/10"
                        : "font-black shadow-xl scale-110"
                    }`}
                  >
                    {moodOption.emoji}
                  </button>
                );
              })}
            </div>
            <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-2 scrollbar-hide">
              {allCauses.map((c, index) => {
                const isActive = selectedCauses.includes(c.name);

                return (
                  <Button
                    key={index}
                    onClick={() => {
                      toggleCause(c.name);
                    }}
                    className={`px-4 py-2 h-auto rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-300
        ${isActive ? "bg-white text-black border-white shadow-xl" : "border-white/5 text-white/30 bg-white/5 hover:border-white/20 hover:text-white"}`}
                  >
                    {c.name}
                  </Button>
                );
              })}
            </div>
            <textarea
              className="h-32 w-full resize-none rounded-[1.5rem] border border-white/5 bg-black/40 p-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-white/10 sm:h-36 sm:rounded-[2rem] sm:p-5"
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="What's on your mind"
            />
            <Button
              onClick={handleSaveMoodLog}
              disabled={!editMood || selectedCauses.length !== 1}
              className="h-12 w-full rounded-2xl bg-white font-bold text-black hover:bg-white/90 disabled:bg-white/5 disabled:text-white/20"
            >
              {editingMoodLog ? "Confirm Changes" : "Create Entry"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
